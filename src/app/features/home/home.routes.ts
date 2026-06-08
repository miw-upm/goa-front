import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home.component";
import {UsersComponent} from "./users/users/pages/users.component";
import {RoleGuard} from "@core/auth/role.guard";
import {Role} from "@core/auth/models/role.model";
import {UserService} from "./users/users/user.service";
import {AccessLinksComponent} from "./users/access-links/pages/access-links.component";
import {AccessLinkService} from "./users/access-links/access-link.service";
import {LegalTasksComponent} from "./engagement-letter/legal-tasks/pages/legal-tasks.component";
import {LegalTaskService} from "./engagement-letter/legal-tasks/legal-task.service";
import {
    LegalProcedureTemplatesComponent
} from "./engagement-letter/legal-procedure-templates/pages/legal-procedure-templates.component";
import {
    LegalProcedureTemplateService
} from "./engagement-letter/legal-procedure-templates/legal-procedure-template.service";
import {
    AuthorizationPurposeTemplatesComponent
} from "./authorization-purpose-templates/pages/authorization-purpose-templates.component";
import {
    AuthorizationPurposeTemplateService
} from "./authorization-purpose-templates/authorization-purpose-template.service";
import {EngagementLettersComponent} from "./engagement-letter/engagement-letter/pages/engagement-letters.component";
import {EngagementLetterService} from "./engagement-letter/engagement-letter/engagement-letter.service";
import {
    AdministrativeAuthorizationsComponent
} from "./administrative-authorization/pages/administrative-authorizations.component";
import {AdministrativeAuthorizationService} from "./administrative-authorization/administrative-authorization.service";
import {ExpensesComponent} from "./billing/expenses/pages/expenses.component";
import {ExpenseService} from "./billing/expenses/expense.service";
import {PaymentsComponent} from "./billing/payments/pages/payments.component";
import {PaymentService} from "./billing/payments/payment.service";
import {InvoicesComponent} from "./billing/invoices/pages/invoices.component";
import {InvoiceService} from "./billing/invoices/invoice.service";
import {
    EngagementLetterFormComponent
} from "./engagement-letter/engagement-letter/pages/engagement-letter-form.component";
import {ConsentsComponent} from "./users/consents/pages/consents.component";
import {ConsentService} from "./users/consents/consent.service";
import {CustomerFileDownloadComponent} from "./customer-file-download/pages/customer-file-download.component";
import {CustomerFileDownloadService} from "./customer-file-download/customer-file-download.service";
import {ChatbotComponent} from "./chatbot/pages/chatbot.component";

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [UserService],
            },
            {
                path: 'consents',
                component: ConsentsComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [ConsentService],
            },
            {
                path: 'access-links',
                component: AccessLinksComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [AccessLinkService],
            },
            {
                path: 'legal-tasks',
                component: LegalTasksComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [LegalTaskService],
            },
            {
                path: 'legal-procedures',
                component: LegalProcedureTemplatesComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [LegalProcedureTemplateService],
            },
            {
                path: 'authorization-purpose-templates',
                component: AuthorizationPurposeTemplatesComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [AuthorizationPurposeTemplateService],
            },
            {
                path: 'engagement-letters',
                component: EngagementLettersComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService],
                pathMatch: 'full',
            },
            {
                path: 'engagement-letters/new',
                component: EngagementLetterFormComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService],
            },
            {
                path: 'engagement-letters/:id/edit',
                component: EngagementLetterFormComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService],
            },
            {
                path: 'administrative-authorizations',
                component: AdministrativeAuthorizationsComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [AdministrativeAuthorizationService],
            },
            {
                path: 'customer-file-downloads',
                component: CustomerFileDownloadComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [CustomerFileDownloadService],
            },

            {
                path: 'invoices',
                component: InvoicesComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [InvoiceService],
            },
            {
                path: 'expenses',
                component: ExpensesComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [ExpenseService],
            },
            {
                path: 'payments',
                component: PaymentsComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [PaymentService],
            },
            {
                path: 'chatbot',
                component: ChatbotComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR, Role.CUSTOMER]},
            },
        ],
    },
];
