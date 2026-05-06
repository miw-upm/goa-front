import {environment} from "@env";

const USERS_ROOT = `${environment.REST_USER}/users`;
const ACCESS_LINK_ROOT = `${environment.REST_USER}/access-link`;
const ENGAGEMENT_LETTER_ROOT = `${environment.REST_ENGAGEMENT}/engagement-letters`;
const PUBLIC_ENGAGEMENT_LETTER_ROOT = `${environment.REST_ENGAGEMENT}/public/engagement-letters`;
const LEGAL_PROCEDURE_TEMPLATE_ROOT = `${environment.REST_ENGAGEMENT}/legal-procedure-templates`;
const LEGAL_TASK_ROOT = `${environment.REST_ENGAGEMENT}/legal-tasks`;
const EVENT_ROOT = `${environment.REST_ENGAGEMENT}/events`;
const ALERT_ROOT = `${environment.REST_ENGAGEMENT}/alerts`;
const ALERT_NOTIFICATION_ROOT = `${environment.REST_ENGAGEMENT}/alert-notifications`;
const ISSUE_ROOT = `${environment.REST_SUPPORT}/issues`;
const EXPENSE_ROOT = `${environment.REST_BILLING}/expenses`;
const INCOME_ROOT = `${environment.REST_BILLING}/incomes`;
const INVOICE_ROOT = `${environment.REST_BILLING}/invoices`;
const CHATBOT_ROOT = `${environment.REST_CHATBOT}/chatbot`;
const DOCUMENT_AI_ROOT = `${environment.REST_AI_DOCUMENT}/document-ai`;

const enc = encodeURIComponent;

export const ENDPOINTS = {
    users: {
        root: USERS_ROOT,
        byMobile: (mobile: string) =>
            `${USERS_ROOT}/${enc(mobile)}`,
        byMobileAndToken: (mobile: string, token: string) =>
            `${ENDPOINTS.users.byMobile(mobile)}/${enc(token)}`,
        provinces: () =>
            `${USERS_ROOT}/provinces`,
    },

    accessLink: {
        root: ACCESS_LINK_ROOT,
        byId: (id: string) =>
            `${ACCESS_LINK_ROOT}/${enc(id)}`,
    },

    engagementLetters: {
        root: ENGAGEMENT_LETTER_ROOT,
        byId: (id: string) =>
            `${ENGAGEMENT_LETTER_ROOT}/${enc(id)}`,
        publicAccessToken: (id: string) =>
            `${ENGAGEMENT_LETTER_ROOT}/${enc(id)}/public-access-token`,
        print: (id: string) =>
            `${ENGAGEMENT_LETTER_ROOT}/${enc(id)}/print-view`,
    },

    publicEngagementLetters: {
        root: PUBLIC_ENGAGEMENT_LETTER_ROOT,
        access: () =>
            `${PUBLIC_ENGAGEMENT_LETTER_ROOT}/access`,
        accept: () =>
            `${PUBLIC_ENGAGEMENT_LETTER_ROOT}/accept`,
    },

    legalProcedureTemplates: {
        root: LEGAL_PROCEDURE_TEMPLATE_ROOT,
        byId: (id: string) =>
            `${LEGAL_PROCEDURE_TEMPLATE_ROOT}/${enc(id)}`,
    },

    legalTasks: {
        root: LEGAL_TASK_ROOT,
        byId: (id: string) =>
            `${LEGAL_TASK_ROOT}/${enc(id)}`,
    },

    events: {
        root: EVENT_ROOT,
        byId: (id: string) =>
            `${EVENT_ROOT}/${enc(id)}`,
        byEngagementLetterId: (engagementLetterId: string) =>
            `${EVENT_ROOT}/engagement-letter/${enc(engagementLetterId)}`,
        commentsByEventId: (eventId: string) =>
            `${EVENT_ROOT}/${enc(eventId)}/comments`,
        timelineByEngagementLetterId: (engagementLetterId: string) =>
            `${EVENT_ROOT}/engagement-letter/${enc(engagementLetterId)}/timeline-events`,

    },

    alerts: {
        root: ALERT_ROOT,
        byId: (id: string) =>
            `${ALERT_ROOT}/${enc(id)}`,
        byEngagementLetterId: (engagementLetterId: string) =>
            `${ALERT_ROOT}?engagementLetterId=${enc(engagementLetterId)}`,
        notifications: (id: string) =>
            `${ALERT_ROOT}/${enc(id)}/notifications`,
        cancel: (alertId: string ) =>
            `${ALERT_ROOT}/${enc(alertId)}/cancel`,
    },

    alertNotifications: {
        root: ALERT_NOTIFICATION_ROOT,
        pending: () =>
            `${ALERT_NOTIFICATION_ROOT}/pending`,
        shown: (notificationId: string) =>
            `${ALERT_NOTIFICATION_ROOT}/${enc(notificationId)}/shown`,
    },

    issues: {
        root: ISSUE_ROOT,
        byId: (id: string) =>
            `${ISSUE_ROOT}/${enc(id)}`,
        syncById: (id: string) =>
            `${ISSUE_ROOT}/${enc(id)}/sync`,
    },

    expenses: {
        root: EXPENSE_ROOT,
        byId: (id: string) =>
            `${EXPENSE_ROOT}/${enc(id)}`,
    },

    incomes: {
        root: INCOME_ROOT,
        byId: (id: string) =>
            `${INCOME_ROOT}/${enc(id)}`,
    },

    invoices: {
        root: INVOICE_ROOT,
        byId: (id: string) =>
            `${INVOICE_ROOT}/${enc(id)}`,
        breakdown: (id: string) =>
            `${INVOICE_ROOT}/${enc(id)}/breakdown`,
    },

    chatbot: {
        root: CHATBOT_ROOT,
        contextualConversation: () =>
            `${CHATBOT_ROOT}/conversations/contextual`,
        generalConversation: () =>
            `${CHATBOT_ROOT}/conversations/general`,
        closeConversation: (conversationId: string) =>
            `${CHATBOT_ROOT}/conversations/${enc(conversationId)}/close`,
        messages: () =>
            `${CHATBOT_ROOT}/messages`,
    },

    documentAi: {
        root: DOCUMENT_AI_ROOT,
        documents: () =>
            `${DOCUMENT_AI_ROOT}/documents`,
        summary: (id: string) =>
            `${DOCUMENT_AI_ROOT}/documents/${enc(id)}/summary`,
    },
} as const;
