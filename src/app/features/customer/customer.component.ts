import {Component} from "@angular/core";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {MatInput, MatLabel} from "@angular/material/input";
import {User} from "../shared/user.model";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField} from "@angular/material/form-field";
import {ActivatedRoute} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {CustomerService} from "./customer.service";

@Component({
    standalone: true,
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    imports: [
        MatCard,
        MatCardContent,
        MatCardTitle,
        NgOptimizedImage,
        FormsModule,
        MatDialogContent,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        MatButton,
        MatDialogActions
    ],
    styleUrl: './customer.component.css'
})
export class CustomerComponent {
    user: User;
    documentTypes = ["DNI", "NIE", "CIF"];
    oldMobile: string;
    token: string;

    constructor(private readonly customerService: CustomerService, private readonly route: ActivatedRoute) {
        this.token = this.route.snapshot.paramMap.get("token");
        this.user = {mobile: this.route.snapshot.paramMap.get('mobile'), firstName: null}
        this.oldMobile = this.user.mobile;
        this.customerService.readWithToken(this.user.mobile, this.token)
            .subscribe(user => this.user = user);
    }

    update(): void {
        this.customerService
            .updateWithToken(this.oldMobile, this.user, this.token).subscribe(user => this.user = user);
    }


    invalid(): boolean {
        return this.check(this.user.mobile) || this.check(this.user.firstName);
    }

    check(attr: string): boolean {
        return attr === undefined || null || attr === '';
    }
}