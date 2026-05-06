import pkg from '../../package.json';

const HOST = 'http://localhost:4200';
const API = 'http://localhost:8080/api';
const CHATBOT = 'http://localhost:8086';

export const environment = {
    production: false,
    HOSTING: 'localhost',
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: HOST,
    REST_USER: `${API}/goa-user`,
    REST_ENGAGEMENT: `${API}/goa-engagement`,
    REST_BILLING: `${API}/goa-billing`,
    REST_SUPPORT: `${API}/goa-support`,
    REST_DOCUMENT: `${API}/goa-document`,
    REST_CHATBOT: CHATBOT,
    REST_SANDBOX: `${API}/goa-sandbox`,
    SECURE_ROUTES: [API, CHATBOT],
};

