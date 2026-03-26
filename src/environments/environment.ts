import pkg from '../../package.json';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: 'http://localhost:4200',
    REST_USER: 'http://localhost:8080/api/goa-user',
    REST_ENGAGEMENT: 'http://localhost:8080/api/goa-engagement',
    REST_BILLING: 'http://localhost:8080/api/goa-billing',
    REST_SUPPORT: 'http://localhost:8080/api/goa-support',
    REST_DOCUMENT: 'http://localhost:8080/api/goa-document',
    SECURE_ROUTES: ['http://localhost:8080'],
};

