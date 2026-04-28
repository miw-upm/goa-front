import {User} from '@features/shared/models/user.model';

export interface CustomerFileDownload {
    id?: string;
    downloadedAt?: string;
    customer?: User;
    documentType?: string;
    documentId?: string;
    downloadToken?: string;
}