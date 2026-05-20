import {AdministrativeAuthorizationSignature} from './administrative-authorization-signature.model';
import {User} from "@features/shared/models/user.model";

export interface AdministrativeAuthorization {
    id?: string;
    lastUpdatedDate?: Date | string;
    authorizingCustomers?: User[];
    authorizedRepresentatives?: User[];
    purpose?: string;
    signatures?: AdministrativeAuthorizationSignature[];
}
