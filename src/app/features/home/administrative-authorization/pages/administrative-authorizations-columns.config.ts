import {CrudColumnConfig} from '@shared/ui/crud/crud-column.config';

export const ADMINISTRATIVE_AUTHORIZATIONS_COLUMNS: CrudColumnConfig[] = [
    {key: 'authorizingCustomers', label: 'CLIENTES AUTORIZANTES', arrayField: 'firstName'},
    {key: 'authorizedRepresentatives', label: 'REPRESENTANTES AUTORIZADOS', arrayField: 'firstName'},
    {key: 'purpose', label: 'PROPOSITO'},
    {key: 'signatures', label: 'FIRMANTES', arrayField: 'signerFullName'},
    {key: 'signed', label: 'ACEPTDO Y FIRMADO'},
    {key: 'lastUpdatedDate', label: 'ÚLTIMA ACTUALIZACIÓN'},
];
