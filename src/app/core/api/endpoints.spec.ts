import {environment} from '@env';
import {ENDPOINTS} from './endpoints';

describe('ENDPOINTS', () => {
    it('should build engagement-letters routes', () => {
        const id = 'eng/01';
        expect(ENDPOINTS.engagementLetters.root).toBe(`${environment.REST_ENGAGEMENT}/engagement-letters`);
        expect(ENDPOINTS.engagementLetters.byId(id)).toBe(
            `${environment.REST_ENGAGEMENT}/engagement-letters/${encodeURIComponent(id)}`
        );
    });

    it('should build complaints root and byId endpoint', () => {
        const id = 'complaint/01';

        expect(ENDPOINTS.complaints.root).toBe(`${environment.REST_SANDBOX}/complaints`);
        expect(ENDPOINTS.complaints.byId(id)).toBe(
            `${environment.REST_SANDBOX}/complaints/${encodeURIComponent(id)}`
        );
    });
});