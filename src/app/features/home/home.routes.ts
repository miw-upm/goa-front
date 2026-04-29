import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home.component";
import {UsersComponent} from "./users/pages/users.component";
import {RoleGuard} from "@core/auth/role.guard";
import {Role} from "@core/auth/models/role.model";
import {UserService} from "./users/user.service";
import {AccessLinkComponent} from "./access-links/pages/access-link.component";
import {AccessLinkService} from "./access-links/access-link.service";
import {LegalTasksComponent} from "./legal-tasks/pages/legal-tasks.component";
import {LegalTaskService} from "./legal-tasks/legal-task.service";
import {LegalProcedureTemplatesComponent} from "./legal-procedure-templates/pages/legal-procedure-templates.component";
import {LegalProcedureTemplateService} from "./legal-procedure-templates/legal-procedure-template.service";
import {EngagementLettersComponent} from "./engagement-letter/pages/engagement-letters.component";
import {EngagementLetterService} from "./engagement-letter/engagement-letter.service";
import {InvoicesComponent} from "./billing/pages/invoices.component";
import {IncomesComponent} from "./billing/pages/incomes.component";
import {ExpensesComponent} from "./billing/pages/expenses.component";
import {InvoiceService} from "./billing/invoice.service";
import {IncomeService} from "./billing/income.service";
import {ExpenseService} from "./billing/expense.service";
import {ChatbotComponent} from "./chatbot/pages/chatbot.component";
import {ChatbotHistoryComponent} from "./chatbot/pages/chatbot-history.component";
import {EngagementLetterFormComponent} from "./engagement-letter/pages/engagement-letter-form.component";
import {ConsentsComponent} from "./consents/pages/consents.component";
import {ConsentService} from "./consents/consent.service";
import {CustomerFileDownloadComponent} from "./customer-file-download/pages/customer-file-download.component";
import {CustomerFileDownloadService} from "./customer-file-download/customer-file-download.service";

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
                component: AccessLinkComponent,
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
                path: 'incomes',
                component: IncomesComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [IncomeService],
            },
            {
                path: 'expenses',
                component: ExpensesComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [ExpenseService],
            },
            {
                path: 'chatbot/history',
                component: ChatbotHistoryComponent,
                canActivate: [RoleGuard],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR, Role.CUSTOMER]},
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
