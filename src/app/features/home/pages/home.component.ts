import {Component, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatTooltip} from '@angular/material/tooltip';
import {filter, Observable, switchMap} from 'rxjs';

import {AuthService} from "@core/auth/auth.service";
import {FooterComponent} from '@core/layout/footer/footer.component';
import {UserService} from "../users/users/user.service";
import {UserCreationUpdatingDialogComponent} from "../users/users/dialogs/user-creation-updating-dialog.component";
import {ChatbotComponent} from "../chatbot/pages/chatbot.component";
import {
    InvoiceIssuedBookDialogData,
    InvoiceIssuedBookDialogComponent,
    InvoiceIssuedBookDialogResult
} from '../tax-agency/dialogs/invoice-issued-book-dialog.component';
import {Model130DialogComponent} from '../tax-agency/dialogs/model-130-dialog.component';
import {Model303DialogComponent} from '../tax-agency/dialogs/model-303-dialog.component';
import {TaxAgencyService} from '../tax-agency/tax-agency.service';
import {Model130} from '../tax-agency/models/model-130.model';
import {Model303} from '../tax-agency/models/model-303.model';

@Component({
    standalone: true,
    providers: [],
    imports: [
        RouterLink,
        RouterOutlet,
        NgOptimizedImage,
        FooterComponent,
        MatToolbar,
        MatIcon,
        MatButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatTooltip
    ],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
    title = 'GOA';

    constructor(private readonly dialog: MatDialog, private readonly userService: UserService,
                private readonly authService: AuthService, private readonly taxAgencyService: TaxAgencyService) {
    }

    login(): void {
        this.authService.login();
    }

    update() {
        this.userService.readByMobile(this.authService.mobile)
            .subscribe(fullUser => this.dialog.open(UserCreationUpdatingDialogComponent, {data: fullUser}));

    }

    logout(): void {
        this.authService.logout();
    }

    openChatbot(): void {
        this.dialog.open(ChatbotComponent, {
            disableClose: true,
            width: '1200px',
            maxWidth: '96vw',
            height: '85vh'
        });
    }

    downloadInvoiceIssuedBook(): void {
        this.downloadTaxAgencyBook(
            'Libro de facturas expedidas',
            result => this.taxAgencyService.invoiceIssuedBook(result.year, result.quarter)
        );
    }

    downloadReceivedBook(): void {
        this.downloadTaxAgencyBook(
            'Libro de facturas recibidas',
            result => this.taxAgencyService.receivedBook(result.year, result.quarter, result.from!, result.to!),
            {showRange: true}
        );
    }

    openModel303(): void {
        this.requestTaxAgencyPeriod('Modelo 303', 'Enviar', 'send', {showRange: true})
            .pipe(switchMap(result => this.taxAgencyService.model303(result.year, result.quarter, result.from!, result.to!)))
            .subscribe(model303 => this.showModel303(model303));
    }

    openModel130(): void {
        this.requestTaxAgencyPeriod('Modelo 130', 'Enviar', 'send', {showTo: true})
            .pipe(switchMap(result => this.taxAgencyService.model130(result.year, result.quarter, result.to!)))
            .subscribe(model130 => this.showModel130(model130));
    }

    private downloadTaxAgencyBook(
        title: string,
        download: (result: InvoiceIssuedBookDialogResult) => Observable<void>,
        options?: Pick<InvoiceIssuedBookDialogData, 'showRange' | 'showTo'>
    ): void {
        this.requestTaxAgencyPeriod(title, undefined, undefined, options)
            .pipe(switchMap(result => download(result)))
            .subscribe();
    }

    private requestTaxAgencyPeriod(
        title: string,
        submitLabel = 'Descargar CSV',
        submitIcon = 'download',
        options?: Pick<InvoiceIssuedBookDialogData, 'showRange' | 'showTo'>
    ): Observable<InvoiceIssuedBookDialogResult> {
        return this.dialog.open<InvoiceIssuedBookDialogComponent, InvoiceIssuedBookDialogData, InvoiceIssuedBookDialogResult>(
            InvoiceIssuedBookDialogComponent,
            {width: '420px', data: {title, submitLabel, submitIcon, ...options}}
        )
            .afterClosed()
            .pipe(
                filter((result): result is InvoiceIssuedBookDialogResult => !!result)
            );
    }

    private showModel303(model303: Model303): void {
        this.dialog.open(Model303DialogComponent, {
            width: '680px',
            data: model303
        });
    }

    private showModel130(model130: Model130): void {
        this.dialog.open(Model130DialogComponent, {
            width: '560px',
            data: model130
        });
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    name() {
        return this.authService.name;
    }

    initials(): string {
        const n = this.authService.name || '';
        const raw = n.substring(0, 3);
        return raw.charAt(0).toUpperCase() + raw.substring(1).toLowerCase();
    }

}
