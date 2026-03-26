import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {map, of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {IncomeCreationDialogComponent} from '../dialogs/income-creation-dialog.component';
import {IncomeService} from '../income.service';
import {Income} from '../models/income.model';

@Component({
    standalone: true,
    selector: 'app-incomes',
    imports: [CrudComponent],
    templateUrl: 'incomes.component.html'
})
export class IncomesComponent {
    title = 'Ingresos';
    incomes = of([] as Income[]);

    constructor(private readonly dialog: MatDialog, private readonly incomeService: IncomeService) {
    }

    search(): void {
        this.incomes = this.incomeService.search()
            .pipe(map(incomes => [...incomes].sort((a, b) => b.date.localeCompare(a.date))));
    }

    create(): void {
        this.dialog.open(IncomeCreationDialogComponent, {width: '600px'})
            .afterClosed();
    }
}
