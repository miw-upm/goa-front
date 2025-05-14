import pkg from '../../package.json';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST_USER: 'http://localhost:8080/tpv-user',
    REST_ARTICLE: 'http://localhost:8080/tpv-article',
    REST_TICKET: 'http://localhost:8080/tpv-ticket'
};

