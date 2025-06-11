import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST_USER: 'https://gestion.ocanabogados.es/api/goa-user',
    REST_ENGAGEMENT: 'https://gestion.ocanabogados.es/api/goa-engagement',
    FRONT_END: 'https://gestion.ocanabogados.es',
    SECURE_ROUTES: ['https://gestion.ocanabogados.es/api']
};
