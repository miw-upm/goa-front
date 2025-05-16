import {Role} from "@core/models/role.model";

export interface User {
    mobile: string;
    firstName: string;
    familyName?: string;
    email?: string;
    documentType?: string;
    identity?: string;
    address?: string;
    password?: string;
    role?: Role;
    registrationDate?: Date;
    active?: boolean;
}