import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home.component";
import {UsersComponent} from "./users/pages/users.component";
import {RoleGuardService} from "@core/auth/role-guard.service";
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
import {IssueDetailComponent} from "./issues/pages/issue-detail.component";
import {IssuesComponent} from "./issues/pages/issues.component";
import {IssueService} from "./issues/issue.service";
import {InvoicesComponent} from "./billing/pages/invoices.component";
import {IncomesComponent} from "./billing/pages/incomes.component";
import {ExpensesComponent} from "./billing/pages/expenses.component";
import {InvoiceService} from "./billing/invoice.service";
import {IncomeService} from "./billing/income.service";
import {ExpenseService} from "./billing/expense.service";
import {ChatbotComponent} from "./chatbot/pages/chatbot.component";
import {EventsComponent} from "./events/pages/events.component";
import {EventService} from "./events/event.service";
import {AlertsComponent} from "./alerts/pages/alerts.component";
import {AlertService} from "./alerts/alert.service";
import {TimelinePageComponent } from './timeline/pages/timeline-page.component';
import {TimelineService} from "./timeline/services/timeline.service";
import {EngagementLetterFormComponent} from "./engagement-letter/pages/engagement-letter-form.component";
import { DocumentAiComponent } from './document-ai/pages/document-ai.component';
import { DocumentAiService } from './document-ai/document-ai.service';

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
                pathMatch: 'full',
            },
            {
                path: 'engagement-letters/new',
                component: EngagementLetterFormComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService],
            },
            {
                path: 'engagement-letters/:id/edit',
                component: EngagementLetterFormComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EngagementLetterService],
            },
            {
                path: 'engagement-letters/:id/events',
                component: EventsComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [EventService],
            },
            {
                path: 'engagement-letters/:id/alerts',
                component: AlertsComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [AlertService],
            },
            {
                path: 'issues',
                component: IssuesComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [IssueService],
            },
            {
                path: 'issues/:id',
                component: IssueDetailComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [IssueService],
            },
            {
                path: 'invoices',
                component: InvoicesComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [InvoiceService],
            },
            {
                path: 'incomes',
                component: IncomesComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [IncomeService],
            },
            {
                path: 'expenses',
                component: ExpensesComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [ExpenseService],
            },
            {
                path: 'chatbot',
                component: ChatbotComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR, Role.CUSTOMER]},
            },
            {
                path: 'engagement-letters/:id/timeline',
                component: TimelinePageComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR, Role.CUSTOMER]},
                providers: [TimelineService]
            },
            {
                path: 'document-ai',
                component: DocumentAiComponent,
                canActivate: [RoleGuardService],
                data: { roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR] },
                providers: [DocumentAiService],
            },

        ],
    },
];
