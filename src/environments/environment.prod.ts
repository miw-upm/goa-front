import pkg from '../../package.json';

const HOST = 'https://goa.miwupm.es';
const API = `${HOST}/api`;

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: HOST,
    REST_USER: `${API}/goa-user`,
    REST_ENGAGEMENT: `${API}/goa-engagement`,
    REST_BILLING: `${API}/goa-billing`,
    REST_SUPPORT: `${API}/goa-support`,
    REST_DOCUMENT: `${API}/goa-document`,
    REST_CHATBOT: `${API}/goa-chatbot`,
    SECURE_ROUTES: [API]
};
