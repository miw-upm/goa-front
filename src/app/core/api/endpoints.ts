import {environment} from "@env";

const USERS_ROOT = `${environment.REST_USER}/users`;
const ACCESS_LINK_ROOT = `${environment.REST_USER}/access-links`;
const CONSENTS_ROOT = `${environment.REST_USER}/consents`;
const ENGAGEMENT_LETTER_ROOT = `${environment.REST_ENGAGEMENT}/engagement-letters`;
const LEGAL_PROCEDURE_TEMPLATE_ROOT = `${environment.REST_ENGAGEMENT}/legal-procedure-templates`;
const LEGAL_TASK_ROOT = `${environment.REST_ENGAGEMENT}/legal-tasks`;
const ISSUE_ROOT = `${environment.REST_SUPPORT}/issues`;
const EXPENSE_ROOT = `${environment.REST_BILLING}/expenses`;
const INCOME_ROOT = `${environment.REST_BILLING}/incomes`;
const INVOICE_ROOT = `${environment.REST_BILLING}/invoices`;
const CHATBOT_ROOT = `${environment.REST_CHATBOT}/chatbot`;
const CUSTOMER_FILE_DOWNLOAD_ROOT = `${environment.REST_ENGAGEMENT}/customer-file-downloads`;

const enc = encodeURIComponent;

export const ENDPOINTS = {
    users: {
        root: USERS_ROOT,
        byMobile: (mobile: string) => `${USERS_ROOT}/${enc(mobile)}`,
        byToken: (scope:string, urlId: string, token: string) => `${USERS_ROOT}/${enc(scope)}/${enc(urlId)}/${enc(token)}`,
        provinces: () => `${USERS_ROOT}/provinces`,
        findAllJson: () => `${USERS_ROOT}/full`,
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
        readDocument: (scope: string, urlId: string, token: string) => `${ENGAGEMENT_LETTER_ROOT}/${enc(scope)}/${enc(urlId)}/${enc(token)}`,
        signerDocument: (scope: string, urlId: string, token: string) => `${ENGAGEMENT_LETTER_ROOT}/${enc(scope)}/${enc(urlId)}/${enc(token)}`,
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

    customerFileDownload: {
        root: CUSTOMER_FILE_DOWNLOAD_ROOT,
        byId: (id: string) => `${CUSTOMER_FILE_DOWNLOAD_ROOT}/${enc(id)}`,
    },

    chatbot: {
        root: CHATBOT_ROOT,
        conversations: () => `${CHATBOT_ROOT}/conversations`,
        deleteConversation: (conversationId: string) => `${CHATBOT_ROOT}/conversations/${enc(conversationId)}`,
        generalConversation: () => `${CHATBOT_ROOT}/conversations/general`,
        contextualConversation: () => `${CHATBOT_ROOT}/conversations/contextual`,
        closeConversation: (conversationId: string) => `${CHATBOT_ROOT}/conversations/${enc(conversationId)}/close`,
        escalateConversation: (conversationId: string) => `${CHATBOT_ROOT}/conversations/${enc(conversationId)}/escalate`,
        history: (conversationId: string) => `${CHATBOT_ROOT}/conversations/${enc(conversationId)}/messages`,
        reopenConversation: (conversationId: string) => `${CHATBOT_ROOT}/conversations/${enc(conversationId)}/reopen`,
        configurationStatus: () => `${CHATBOT_ROOT}/configuration/status`,
        messages: () => `${CHATBOT_ROOT}/messages`,
    },
} as const;
