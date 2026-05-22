import {PaymentMethod} from './payment-method.model';

export interface EngagementSnapshot {
    id?: string;
}

export interface UserSnapshot {
    id?: string;
    mobile?: string;
    firstName?: string;
    familyName?: string;
}

export interface Payment {
    id?: string;
    date: string;
    engagement?: EngagementSnapshot;
    user: UserSnapshot;
    amount: number;
    method: PaymentMethod;
}
