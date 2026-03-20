import {environment} from '@env';

import {ENDPOINTS} from './endpoints';

describe('ENDPOINTS', () => {
    it('should build users root and dynamic routes', () => {
        const mobile = '612 34/56?';
        const token = 'token with spaces';

        expect(ENDPOINTS.users.root).toBe(`${environment.REST_USER}/users`);
        expect(ENDPOINTS.users.byMobile(mobile)).toBe(
            `${environment.REST_USER}/users/${encodeURIComponent(mobile)}`
        );
        expect(ENDPOINTS.users.byMobileAndToken(mobile, token)).toBe(
            `${environment.REST_USER}/users/${encodeURIComponent(mobile)}/${encodeURIComponent(token)}`
        );
        expect(ENDPOINTS.users.provinces()).toBe(`${environment.REST_USER}/users/provinces`);
    });

    it('should build access-link routes', () => {
        const id = 'acc id/01';

        expect(ENDPOINTS.accessLink.root).toBe(`${environment.REST_USER}/access-link`);
        expect(ENDPOINTS.accessLink.byId(id)).toBe(
            `${environment.REST_USER}/access-link/${encodeURIComponent(id)}`
        );
    });

    it('should build engagement-letters routes', () => {
        const id = 'eng id/01';

        expect(ENDPOINTS.engagementLetters.root).toBe(`${environment.REST_ENGAGEMENT}/engagement-letters`);
        expect(ENDPOINTS.engagementLetters.byId(id)).toBe(
            `${environment.REST_ENGAGEMENT}/engagement-letters/${encodeURIComponent(id)}`
        );
    });

    it('should build legal-procedure-template routes', () => {
        const id = 'lp id/01';

        expect(ENDPOINTS.legalProcedureTemplates.root).toBe(
            `${environment.REST_ENGAGEMENT}/legal-procedure-templates`
        );
        expect(ENDPOINTS.legalProcedureTemplates.byId(id)).toBe(
            `${environment.REST_ENGAGEMENT}/legal-procedure-templates/${encodeURIComponent(id)}`
        );
    });

    it('should build legal-task routes', () => {
        const id = 'lt id/01';

        expect(ENDPOINTS.legalTasks.root).toBe(`${environment.REST_ENGAGEMENT}/legal-tasks`);
        expect(ENDPOINTS.legalTasks.byId(id)).toBe(
            `${environment.REST_ENGAGEMENT}/legal-tasks/${encodeURIComponent(id)}`
        );
    });

    it('should build issues routes', () => {
        const id = 'issue id/01';

        expect(ENDPOINTS.issues.root).toBe(`${environment.REST_SUPPORT}/issues`);
        expect(ENDPOINTS.issues.byId(id)).toBe(
            `${environment.REST_SUPPORT}/issues/${encodeURIComponent(id)}`
        );
        expect(ENDPOINTS.issues.syncById(id)).toBe(
            `${environment.REST_SUPPORT}/issues/${encodeURIComponent(id)}/sync`
        );
    });

    it('should build expenses root and byId endpoint', () => {
        const id = 'expense id/with special?chars';

        expect(ENDPOINTS.expenses.root).toBe(`${environment.REST_BILLING}/expenses`);
        expect(ENDPOINTS.expenses.byId(id)).toBe(
            `${environment.REST_BILLING}/expenses/${encodeURIComponent(id)}`
        );
    });
});
