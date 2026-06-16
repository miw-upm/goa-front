import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BillingPeriodService {
    currentQuarterStartDate(reference = new Date()): Date {
        const quarterStartMonth = Math.floor(reference.getMonth() / 3) * 3;
        return new Date(reference.getFullYear(), quarterStartMonth, 1);
    }

    formatDateValue(value: Date | string | undefined): string | undefined {
        if (!value) {
            return undefined;
        }
        if (typeof value === 'string') {
            return value;
        }
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
