import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
    standalone: true,
    selector: 'app-issues',
    imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: 'issues.component.html',
    styleUrls: ['issues.component.css']
})
export class IssuesComponent {
    issueId = '';

    constructor(private readonly router: Router) {
    }

    goToDetail(): void {
        const normalizedId = this.issueId?.trim();
        if (!normalizedId) {
            return;
        }
        void this.router.navigate(['/home/issues', normalizedId]);
    }
}
