import {Component} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {FormsModule, NgModel} from "@angular/forms";
import {Observable} from "rxjs";
import {MatCardModule} from "@angular/material/card";
import {MatOptionModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ActivatedRoute} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";

import {FormFieldComponent} from "@shared/ui/inputs/forms/form-field.component";
import {FormSelectComponent} from "@shared/ui/inputs/forms/form-select.component";
import {User} from "@features/shared/models/user.model";
import {SharedUserService} from "@features/shared/services/shared-user.service";
import {CustomerService} from "../customer.service";
import {DataProcessingConsentCreation} from "../processing-consent-creation.model";
import {FormSubmitComponent} from "@shared/ui/inputs/forms/form-submit.component";
import {HttpErrorResponse} from "@angular/common/http";
import {BackendError} from "@core/http/backend-error";

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
        MatCheckbox,
        FormSubmitComponent
    ],
    styleUrl: './customer-edit-profile.component.css'
})
export class CustomerEditProfileComponent {
    user: User;
    dataProcessingConsentCreation: DataProcessingConsentCreation;
    oldMobile: string;
    scope: string;
    urlId: string;
    token: string;
    provinces: Observable<string[]>;

    constructor(private readonly customerService: CustomerService, private readonly sharedUserService: SharedUserService,
                private readonly route: ActivatedRoute) {
        this.scope =  this.route.snapshot.url[1]?.path;
        this.urlId = this.route.snapshot.paramMap.get('urlId');
        this.token = this.route.snapshot.paramMap.get("token");
        this.dataProcessingConsentCreation = {dataProcessingAccepted: false, promotionsAccepted: false}
        this.customerService.readWithToken(this.scope, this.urlId, this.token)
            .subscribe(user => {
                this.user = user;
                this.oldMobile = this.user.mobile;
            });
        this.provinces = this.sharedUserService.findProvinces();
    }

    update(submitBtn: FormSubmitComponent): void {
        this.customerService
            .updateWithToken(this.scope, this.urlId, this.token, this.user, this.dataProcessingConsentCreation)
            .subscribe({
                next: user => {
                    this.user = user;
                    submitBtn.markSuccess('Tu perfil ha sido actualizado adecuadamente.');
                },
                error: (error: BackendError) => {
                    if (error.error === 'BadGatewayException') {
                        submitBtn.markWarning(
                            'Sus datos se han guardado, pero ' + error.message,
                        );
                    } else {
                        submitBtn.markError(error.message);
                    }
                }
            });
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid);
    }
}