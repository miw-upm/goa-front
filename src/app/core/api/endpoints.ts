import {environment} from "@env";

const USERS_ROOT = `${environment.REST_USER}/users`;
const ACCESS_LINK_ROOT = `${environment.REST_USER}/access-link`;
const CONSENTS_ROOT = `${environment.REST_USER}/consents`;
const ENGAGEMENT_LETTER_ROOT = `${environment.REST_ENGAGEMENT}/engagement-letters`;
const LEGAL_PROCEDURE_TEMPLATE_ROOT = `${environment.REST_ENGAGEMENT}/legal-procedure-templates`;
const LEGAL_TASK_ROOT = `${environment.REST_ENGAGEMENT}/legal-tasks`;
const ISSUE_ROOT = `${environment.REST_SUPPORT}/issues`;
const EXPENSE_ROOT = `${environment.REST_BILLING}/expenses`;
const INCOME_ROOT = `${environment.REST_BILLING}/incomes`;
const INVOICE_ROOT = `${environment.REST_BILLING}/invoices`;
const CHATBOT_ROOT = `${environment.REST_CHATBOT}/chatbot`;

const enc = encodeURIComponent;

export const ENDPOINTS = {
    users: {
        root: USERS_ROOT,
        byMobile: (mobile: string) => `${USERS_ROOT}/${enc(mobile)}`,
        byMobileAndToken: (mobile: string, token: string) => `${ENDPOINTS.users.byMobile(mobile)}/${enc(token)}`,
        provinces: () => `${USERS_ROOT}/provinces`,
    },
    consents: {
        root: CONSENTS_ROOT,
        byId: (id: string) => `${CONSENTS_ROOT}/${enc(id)}`,
    },

    accessLink: {
        root: ACCESS_LINK_ROOT,
        byId: (id: string) => `${ACCESS_LINK_ROOT}/${enc(id)}`,
    },

    engagementLetters: {
        root: ENGAGEMENT_LETTER_ROOT,
        byId: (id: string) => `${ENGAGEMENT_LETTER_ROOT}/${enc(id)}`,
        pendingSigners: (id: string) => `${ENGAGEMENT_LETTER_ROOT}/${enc(id)}/pending-signers`,
        view: (id: string) => `${ENGAGEMENT_LETTER_ROOT}/${enc(id)}/view`,
        documentView: (mobile: string, token: string) => `${ENGAGEMENT_LETTER_ROOT}/view/${enc(mobile)}/${enc(token)}`,
        signerDocument: (path: string, mobile: string, token: string) => `${ENGAGEMENT_LETTER_ROOT}/${path}/${enc(mobile)}/${enc(token)}`,
    },

    legalProcedureTemplates: {
        root: LEGAL_PROCEDURE_TEMPLATE_ROOT,
        byId: (id: string) => `${LEGAL_PROCEDURE_TEMPLATE_ROOT}/${enc(id)}`,
    },

    legalTasks: {
        root: LEGAL_TASK_ROOT,
        byId: (id: string) => `${LEGAL_TASK_ROOT}/${enc(id)}`,
    },

    issues: {
        root: ISSUE_ROOT,
        byId: (id: string) => `${ISSUE_ROOT}/${enc(id)}`,
        syncById: (id: string) => `${ISSUE_ROOT}/${enc(id)}/sync`,
    },

    expenses: {
        root: EXPENSE_ROOT,
        byId: (id: string) => `${EXPENSE_ROOT}/${enc(id)}`,
    },

    incomes: {
        root: INCOME_ROOT,
        byId: (id: string) => `${INCOME_ROOT}/${enc(id)}`,
    },

    invoices: {
        root: INVOICE_ROOT,
        byId: (id: string) => `${INVOICE_ROOT}/${enc(id)}`,
        breakdown: (id: string) => `${INVOICE_ROOT}/${enc(id)}/breakdown`,
    },

    chatbot: {
        root: CHATBOT_ROOT,
        contextualConversation: () => `${CHATBOT_ROOT}/conversations/contextual`,
        generalConversation: () => `${CHATBOT_ROOT}/conversations/general`,
        closeConversation: (conversationId: string) =>
            `${CHATBOT_ROOT}/conversations/${enc(conversationId)}/close`,
        messages: () => `${CHATBOT_ROOT}/messages`,
    },
} as const;
