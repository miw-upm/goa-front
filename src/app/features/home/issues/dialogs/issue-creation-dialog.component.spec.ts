import {of, throwError} from 'rxjs';

import {IssueType} from '../issue.model';
import {IssueCreationDialogComponent} from './issue-creation-dialog.component';

describe('IssueCreationDialogComponent', () => {
    let issueServiceSpy: {
        create: jasmine.Spy;
    };
    let dialogSpy: {
        closeAll: jasmine.Spy;
    };

    beforeEach(() => {
        issueServiceSpy = {
            create: jasmine.createSpy('create').and.returnValue(of({}))
        };

        dialogSpy = {
            closeAll: jasmine.createSpy('closeAll')
        };
    });

    it('should initialize with correct default values', () => {
        const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);

        expect(component.title).toBe('Crear incidencia');
        expect(component.isSubmitting).toBeFalse();
        expect(component.apiErrorMessage).toBeUndefined();
        expect(component.issue.title).toBeUndefined();
        expect(component.issue.description).toBeUndefined();
        expect(component.issue.technicalContext).toBeUndefined();
        expect(component.issue.type).toBe(IssueType.BUG);
    });

    describe('isSubmitDisabled', () => {
        it('should return true when isSubmitting is true', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };
            component.isSubmitting = true;

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when title is missing', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: undefined,
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when title is empty string', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: '',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when title is whitespace only', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: '   ',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when description is missing', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: undefined,
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when description is empty string', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: '',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when description is whitespace only', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: '   ',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when technicalContext is missing', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: undefined,
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when technicalContext is empty string', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: '',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when technicalContext is whitespace only', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: '   ',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return true when type is missing', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: undefined
            };

            expect(component.isSubmitDisabled()).toBeTrue();
        });

        it('should return false when all required fields are filled', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            expect(component.isSubmitDisabled()).toBeFalse();
        });

        it('should return false when all required fields are filled and type is IMPROVEMENT', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.IMPROVEMENT
            };

            expect(component.isSubmitDisabled()).toBeFalse();
        });
    });

    describe('create', () => {
        it('should not submit when form is invalid', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: undefined,
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(issueServiceSpy.create).not.toHaveBeenCalled();
        });

        it('should set isSubmitting to true when creating', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.isSubmitting).toBeTrue();
        });

        it('should clear apiErrorMessage when creating', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.apiErrorMessage = 'Previous error';
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBeUndefined();
        });

        it('should call issueService.create with issue data', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            const issueData = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };
            component.issue = issueData;

            component.create();

            expect(issueServiceSpy.create).toHaveBeenCalledWith(issueData);
        });

        it('should close dialog on successful creation', () => {
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(dialogSpy.closeAll).toHaveBeenCalled();
        });

        it('should set isSubmitting to false on error', () => {
            const errorResponse = {message: 'Error message'};
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.isSubmitting).toBeFalse();
        });

        it('should set apiErrorMessage on error with message property', () => {
            const errorResponse = {message: 'Error message'};
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBe('Error message');
        });

        it('should not close dialog on error', () => {
            const errorResponse = {message: 'Error message'};
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(dialogSpy.closeAll).not.toHaveBeenCalled();
        });
    });

    describe('error message extraction', () => {
        it('should extract error message from response with error and message properties', () => {
            const errorResponse = {error: 'BadRequest', message: 'Invalid input'};
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBe('BadRequest: Invalid input');
        });

        it('should extract error message from response with message property only', () => {
            const errorResponse = {message: 'Something went wrong'};
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBe('Something went wrong');
        });

        it('should extract error message from nested error.message property', () => {
            const errorResponse = {error: {message: 'Nested error message'}};
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBe('Nested error message');
        });

        it('should return default message for unprocessable response', () => {
            const errorResponse = {code: 500};
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBe('No se pudo procesar la respuesta del servidor.');
        });

        it('should handle null error response', () => {
            issueServiceSpy.create.and.returnValue(throwError(() => null));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBe('Error inesperado al crear la incidencia.');
        });

        it('should handle string error response', () => {
            const errorResponse = 'Simple error string';
            issueServiceSpy.create.and.returnValue(throwError(() => errorResponse));
            const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);
            component.issue = {
                title: 'Title',
                description: 'Description',
                technicalContext: 'Context',
                type: IssueType.BUG
            };

            component.create();

            expect(component.apiErrorMessage).toBe('Simple error string');
        });
    });

    it('should provide issueTypes as observable of IssueType values', (done) => {
        const component = new IssueCreationDialogComponent(issueServiceSpy as any, dialogSpy as any);

        component.issueTypes.subscribe(types => {
            expect(types).toContain(IssueType.BUG);
            expect(types).toContain(IssueType.IMPROVEMENT);
            done();
        });
    });
});
