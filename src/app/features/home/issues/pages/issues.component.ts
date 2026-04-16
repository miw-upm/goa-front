import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {IssueResponse, IssueStatus, IssueType} from '../issue.model';
import {IssueSearch} from '../issue-search.model';
import {IssueService} from '../issue.service';

@Component({
    standalone: true,
    selector: 'app-issues',
    imports: [CrudComponent, FormsModule, MatFormFieldModule, MatSelectModule, CommonModule],
    templateUrl: 'issues.component.html',
    styleUrls: ['issues.component.css']
})
export class IssuesComponent {
    title = 'Incidencias';
    issues = of([] as IssueResponse[]);
    issue: Observable<IssueResponse>;
    criteria: IssueSearch = {};
    issueTypes = Object.values(IssueType);
    issueStatus = Object.values(IssueStatus)

    private static readonly SNACK_SUCCESS_DURATION = 3000;

    constructor(
        private readonly router: Router,
        private readonly snackBar: MatSnackBar,
        private readonly issueService: IssueService
    ) {
    }

    search(): void {
        if (this.criteria.issueId && !this.isValidUuid(this.criteria.issueId)) {
            this.snackBar.open('El ID de búsqueda no es un UUID válido.', '', {
                duration: IssuesComponent.SNACK_SUCCESS_DURATION
            });
            return;
        }
        this.issues = this.issueService.search(this.criteria);
    }

    read(issue: IssueResponse): void {
        this.issue = this.issueService.read(issue.id!);
    }

    goToDetail(issue: IssueResponse): void {
        const normalizedId = issue.id?.trim();
        if (!normalizedId) {
            return;
        }
        void this.router.navigate(['/home/issues', normalizedId]);
    }

    private isValidUuid(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}
