import {Routes} from '@angular/router';

import {LoginCallbackComponent} from "../auth/pages/LoginCallbackComponent";
import {RoleGuardService} from "@core/auth/role-guard.service";
import {Role} from "@core/auth/models/role.model";

import {HomeComponent} from "../home/home.component";
import {UsersComponent} from "../home/users/pages/users.component";
import {CustomerComponent} from "../customer/pages/customer.component";
import {AccessLinkComponent} from "../home/access-links/pages/access-link.component";
import {LegalTasksComponent} from "../home/legal-taks/pages/legal-tasks.component";
import {
    LegalProcedureTemplatesComponent
} from "../home/legal-procedure-templates/pages/legal-procedure-templates.component";
import {LegalTaskService} from "../home/legal-taks/legal-task.service";
import {
    LegalProcedureTemplateService
} from "../home/legal-procedure-templates/legal-procedure-template.service";
import {AccessLinkService} from "../home/access-links/access-link.service";
import {UserService} from "../home/users/user.service";
import {EngagementLetterService} from "../home/engagement-letter/engagement-letter.service";
import {EngagementLettersComponent} from "../home/engagement-letter/pages/engagement-letters.component";

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'callback', component: LoginCallbackComponent},
    {
        path: 'home', component: HomeComponent,
        children: [
            {
                path: 'users', component: UsersComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [UserService]
            },
            {
                path: 'access-links', component: AccessLinkComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [AccessLinkService]
            },
            {
                path: 'legal-tasks', component: LegalTasksComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [LegalTaskService]
            },
            {
                path: 'legal-procedures',
                component: LegalProcedureTemplatesComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [LegalProcedureTemplateService]
            },
            {
                path: 'engagement-letters',
                component: EngagementLettersComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService]
            },
        ]
    },
    {path: 'customer/edit-profile/:mobile/:token', component: CustomerComponent}
];
