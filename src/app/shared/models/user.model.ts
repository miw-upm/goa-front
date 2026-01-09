import {Role} from "@core/auth/models/role.model";

export interface User {
    mobile: string;
    firstName: string;
    familyName?: string;
    email?: string;
    documentType?: string;
    identity?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    password?: string;
    role?: Role;
    registrationDate?: Date;
    active?: boolean;
}