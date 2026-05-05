import pkg from '../../package.json';

const HOST = window.location.origin;
const API = `${HOST}/api`;
const AI_DOCUMENT = 'https://x9dmu3rkbu.eu-west-1.awsapprunner.com'

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
    REST_AI_DOCUMENT: AI_DOCUMENT,
    SECURE_ROUTES: [API, `${API}/goa-chatbot`, AI_DOCUMENT]
};
