import {Component} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {FormsModule, NgModel} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MatCardModule} from "@angular/material/card";
import {MatOptionModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ActivatedRoute} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";

import {FormFieldComponent} from "@shared/ui/inputs/forms/field.component";
import {FormSelectComponent} from "@shared/ui/inputs/forms/select.component";
import {User} from "@features/shared/models/user.model";
import {UserDocumentType} from "@features/shared/models/UserDocumentType";
import {SharedUserService} from "@features/shared/services/shared-user.service";
import {CustomerService} from "../customer.service";

@Component({
    standalone: true,
    selector: 'app-customer',
    providers: [CustomerService],
    templateUrl: './customer-edit-profile.component.html',
    imports: [
        FormsModule,
        NgOptimizedImage,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatDialogModule,
        FormFieldComponent,
        FormSelectComponent,
        MatCheckbox
    ],
    styleUrl: './customer-edit-profile.component.css'
})
export class CustomerEditProfileComponent {
    user: User;
    oldMobile: string;
    token: string;
    provinces: Observable<string[]>;
    userDocumentTypes: Observable<string[]> = of(Object.values(UserDocumentType));
    acceptsPromotions: boolean

    constructor(private readonly customerService: CustomerService, private readonly sharedUserService: SharedUserService,
                private readonly route: ActivatedRoute) {
        this.token = this.route.snapshot.paramMap.get("token");
        this.user = {mobile: this.route.snapshot.paramMap.get('mobile'), firstName: null}
        this.oldMobile = this.user.mobile;
        this.customerService.readWithToken(this.user.mobile, this.token)
            .subscribe(user => this.user = user);
        this.provinces = this.sharedUserService.findProvinces();
    }

    update(): void {
        this.customerService
            .updateWithToken(this.oldMobile, this.user, this.token).subscribe(user => this.user = user);
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}