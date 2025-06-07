import {Component} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatOptionModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ActivatedRoute} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";

import {CustomerService} from "../customer.service";
import {UserDocumentType} from "@shared/models/UserDocumentType";
import {User} from "@shared/models/user.model";


@Component({
    standalone: true,
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    imports: [
        FormsModule,
        NgOptimizedImage,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatDialogModule
    ],
    styleUrl: './customer.component.css'
})
export class CustomerComponent {
    user: User;
    documentTypes: string[] = Object.values(UserDocumentType);
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