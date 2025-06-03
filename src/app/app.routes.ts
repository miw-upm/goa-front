import {Routes} from '@angular/router';
import {LoginCallbackComponent} from "@common/components/auth/LoginCallbackComponent";
import {HomeComponent} from "./features/home/home.component";
import {UsersComponent} from "./features/home/users/pages/users.component";
import {RoleGuardService} from "@common/components/auth/role-guard.service";
import {Role} from "@common/components/auth/models/role.model";
import {CustomerComponent} from "./features/customer/pages/customer.component";
import {AccessLinkComponent} from "./features/home/access-links/pages/access-link.component";
import {LegalTasksComponent} from "./features/home/tareas-legales/pages/legal-tasks.component";
import {LegalProceduresComponent} from "./features/home/procedimientos-legales/pages/legal-procedures.component";
import {LegalTaskService} from "./features/home/tareas-legales/legal-task.service";
import {LegalProcedureTemplateService} from "./features/home/procedimientos-legales/legal-procedure-template.service";
import {AccessLinkService} from "./features/home/access-links/access-link.service";
import {UserService} from "./features/home/users/user.service";
import {EngagementLetterService} from "./features/home/engagement-letter/engagement-letter.service";

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
                component: LegalProceduresComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [LegalProcedureTemplateService]
            },
            {
                path: 'engagement-letters',
                component: LegalProceduresComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService]
            },
        ]
    },
    {path: 'customer/edit-profile/:mobile/:token', component: CustomerComponent}
];
