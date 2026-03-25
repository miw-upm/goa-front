import {of} from 'rxjs';

import {IncomeCreationDialogComponent} from './income-creation-dialog.component';

describe('IncomeCreationDialogComponent', () => {
    let incomeServiceSpy: {
        create: jasmine.Spy;
    };

    let engagementLetterServiceSpy: {
        search: jasmine.Spy;
    };

    let sharedUserServiceSpy: {
        searchUsers: jasmine.Spy;
    };

    let dialogSpy: {
        closeAll: jasmine.Spy;
    };

    beforeEach(() => {
        incomeServiceSpy = {
            create: jasmine.createSpy('create').and.returnValue(of({}))
        };

        engagementLetterServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([
                {id: 'eng-1'},
                {id: undefined},
                {id: 'eng-2'}
            ]))
        };

        sharedUserServiceSpy = {
            searchUsers: jasmine.createSpy('searchUsers').and.returnValue(of([
                {id: 'user-id-1', mobile: '600000001'},
                {id: undefined, mobile: '600000002'},
                {id: null, mobile: ''}
            ]))
        };

        dialogSpy = {
            closeAll: jasmine.createSpy('closeAll')
        };
    });

    it('should load engagement ids from search and filter undefined ids', (done) => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );

        component.engagementIds.subscribe(ids => {
            expect(engagementLetterServiceSpy.search).toHaveBeenCalledWith({
                opened: true,
                owner: '',
                legalProcedureTitle: ''
            });
            expect(ids).toEqual(['eng-1', 'eng-2']);
            done();
        });
    });

    it('should load user ids from users search using id fallback to mobile', (done) => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );

        component.userIds.subscribe(ids => {
            expect(sharedUserServiceSpy.searchUsers).toHaveBeenCalledWith('');
            expect(ids).toEqual(['user-id-1', '600000002']);
            done();
        });
    });

    it('should return false in canCreate when engagementId is empty', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: undefined,
            userId: 'user-1',
            amount: 10,
            date: '2026-03-24'
        } as any;

        expect(component.canCreate()).toBeFalse();
    });

    it('should return false in canCreate when amount is zero', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 0,
            date: '2026-03-24'
        };

        expect(component.canCreate()).toBeFalse();
    });

    it('should return false in canCreate when userId is empty', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: 'eng-1',
            userId: '   ',
            amount: 1,
            date: '2026-03-24'
        };

        expect(component.canCreate()).toBeFalse();
    });

    it('should return false in canCreate when date is missing', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 1,
            date: undefined
        } as any;

        expect(component.canCreate()).toBeFalse();
    });

    it('should return false in canCreate when date is invalid', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 1,
            date: 'not-a-date'
        };

        expect(component.canCreate()).toBeFalse();
    });

    it('should return true in canCreate when all fields are valid', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 10,
            date: '2026-03-24'
        };

        expect(component.canCreate()).toBeTrue();
    });

    it('should not call create service when form data is invalid', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 0,
            date: '2026-03-24'
        };

        component.create();

        expect(incomeServiceSpy.create).not.toHaveBeenCalled();
        expect(dialogSpy.closeAll).not.toHaveBeenCalled();
    });

    it('should call create service and close dialog when data is valid', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );
        component.income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 9.99,
            date: '2026-03-24'
        };

        component.create();

        expect(incomeServiceSpy.create).toHaveBeenCalledWith(component.income);
        expect(dialogSpy.closeAll).toHaveBeenCalled();
    });

    it('should return false when all controls are valid in formInvalid', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );

        const validControl = {invalid: false, dirty: false, touched: false} as any;

        expect(component.formInvalid(validControl)).toBeFalse();
    });

    it('should return true when at least one control is invalid and touched', () => {
        const component = new IncomeCreationDialogComponent(
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            sharedUserServiceSpy as any,
            dialogSpy as any
        );

        const validControl = {invalid: false, dirty: false, touched: false} as any;
        const invalidTouchedControl = {invalid: true, dirty: false, touched: true} as any;

        expect(component.formInvalid(validControl, invalidTouchedControl)).toBeTrue();
    });
});

