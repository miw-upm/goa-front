import pkg from '../../package.json';

const HOST = window.location.origin;
const API = `${HOST}/api`;

export const environment = {
    production: true,
    HOSTING: 'AWS',
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: HOST,
    REST_USER: `${API}/goa-user`,
    REST_ENGAGEMENT: `${API}/goa-engagement`,
    REST_BILLING: `${API}/goa-billing`,
    REST_SUPPORT: `${API}/goa-support`,
    REST_DOCUMENT: `${API}/goa-document`,
    REST_CHATBOT: `${API}/goa-chatbot`,
    REST_SANDBOX: `${API}/goa-sandbox`,
    SECURE_ROUTES: [API, `${API}/goa-chatbot`]
};
