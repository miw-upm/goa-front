import pkg from '../../package.json';

const HOST = 'http://localhost:4200';
const API = `${HOST}/api`;
const CHATBOT = 'http://localhost:8086';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: HOST,
    REST_USER: `${API}/goa-user`,
    REST_ENGAGEMENT:`${API}/goa-engagement`,
    REST_BILLING: `${API}/goa-billing`,
    REST_SUPPORT: `${API}/goa-support`,
    REST_DOCUMENT: `${API}/goa-document`,
    REST_CHATBOT: CHATBOT,
    SECURE_ROUTES: [API, CHATBOT],
};

