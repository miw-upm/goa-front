import pkg from '../../package.json';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST_USER: 'http://localhost:8080/api/goa-user',
    FRONT_END: 'http://localhost:4200',
    SECURE_ROUTES: ['http://localhost:8080'],
};

