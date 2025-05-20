import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST_USER: 'https://gestion.ocanabogados.es/api/goa-user',
    FRONT_END: 'https://gestion.ocanabogados.es',
    SECURE_ROUTES: ['https://gestion.ocanabogados.es/api'],
    EDIT_PROFILE_LINK: 'https://gestion.ocanabogados.es/customer/edit-profile'
};
