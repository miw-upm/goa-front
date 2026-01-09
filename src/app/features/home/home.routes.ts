import {Routes} from '@angular/router';
import {HomeComponent} from "./home.component";
import {UsersComponent} from "./users/pages/users.component";
import {RoleGuardService} from "@core/auth/role-guard.service";
import {Role} from "@core/auth/models/role.model";
import {UserService} from "./users/user.service";
import {AccessLinkComponent} from "./access-links/pages/access-link.component";
import {AccessLinkService} from "./access-links/access-link.service";
import {LegalTasksComponent} from "./legal-taks/pages/legal-tasks.component";
import {LegalTaskService} from "./legal-taks/legal-task.service";
import {LegalProcedureTemplatesComponent} from "./legal-procedure-templates/pages/legal-procedure-templates.component";
import {LegalProcedureTemplateService} from "./legal-procedure-templates/legal-procedure-template.service";
import {EngagementLettersComponent} from "./engagement-letter/pages/engagement-letters.component";
import {EngagementLetterService} from "./engagement-letter/engagement-letter.service";

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [UserService],
            },
            {
                path: 'access-links',
                component: AccessLinkComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [AccessLinkService],
            },
            {
                path: 'legal-tasks',
                component: LegalTasksComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [LegalTaskService],
            },
            {
                path: 'legal-procedures',
                component: LegalProcedureTemplatesComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [LegalProcedureTemplateService],
            },
            {
                path: 'engagement-letters',
                component: EngagementLettersComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService],
            },
        ],
    },
];