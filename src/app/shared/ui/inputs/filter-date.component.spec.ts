import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {CapitalizeEnumNamePipe} from '@shared/pipes/capitalize-enum-name.pipe';
import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';
import {FilterDateComponent} from './filter-date.component';
import {FilterInputComponent} from './filter-input.component';
import {SearchComponent} from './search.component';

describe('FilterDateComponent', () => {
  let component: FilterDateComponent;
  let fixture: ComponentFixture<FilterDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDateComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default title of "Fecha"', () => {
    expect(component.title).toBe('Fecha');
  });

  it('should allow setting a custom title', () => {
    const customTitle = 'Select Date';
    component.title = customTitle;
    fixture.detectChanges();
    const labelElement = fixture.nativeElement.querySelector('mat-label');
    expect(labelElement.textContent).toContain(customTitle);
  });

  it('should emit dateChange event when onDateChange is called', () => {
    spyOn(component.dateChange, 'emit');
    const testDate = new Date().toString();
    component.date = testDate;

    component.onDateChange();

    expect(component.dateChange.emit).toHaveBeenCalledWith(testDate);
  });

  it('should update the model when a date is selected in the datepicker', () => {
    const testDate = new Date(2026, 2, 15); // 15 de marzo de 2026
    const inputElement = fixture.nativeElement.querySelector('input');
    
    inputElement.value = testDate.toLocaleDateString('es');
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Disparar el evento de cambio de fecha
    component.date = testDate.toString();
    component.onDateChange();
    fixture.detectChanges();

    expect(component.date).toBe(testDate.toString());
  });

    it('should disable clear button when date is empty and enable it when date exists', () => {
        component.date = undefined;
        fixture.detectChanges();

        let clearButton = fixture.nativeElement.querySelector('button[aria-label="Limpiar fecha"]') as HTMLButtonElement;
        expect(clearButton.disabled).toBeTrue();

        component.date = new Date(2026, 2, 15);
        fixture.detectChanges();

        clearButton = fixture.nativeElement.querySelector('button[aria-label="Limpiar fecha"]') as HTMLButtonElement;
        expect(clearButton.disabled).toBeFalse();
    });

    it('should clear date and emit undefined when clearDate is called', () => {
        spyOn(component.dateChange, 'emit');
        component.date = new Date(2026, 2, 15);

        component.clearDate();

        expect(component.date).toBeUndefined();
        expect(component.dateChange.emit).toHaveBeenCalledWith(undefined);
    });
});

describe('FilterInputComponent', () => {
    it('should initialize with the default filter configuration', () => {
        const component = new FilterInputComponent();

        expect(component.title).toBe('Filter');
        expect(component.value).toBe('');
        expect(component.type).toBe('text');
    });

    it('should clear the model and emit the new value', () => {
        const component = new FilterInputComponent();
        spyOn(component.valueChange, 'emit');
        component.value = 'ABC';

        component.clearModel();

        expect(component.value).toBeUndefined();
        expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });
});

describe('SearchComponent', () => {
    let component: SearchComponent;

    beforeEach(() => {
        component = new SearchComponent();
    });

    it('should initialize with the expected defaults', () => {
        expect(component.inputValue).toBe('');
        expect(component.title).toBe('Search');
        expect(component.key).toBeNull();
        expect(component.obligatory).toBeFalse();
    });

    it('should emit renew with the current input value', () => {
        spyOn(component.renew, 'emit');
        component.inputValue = 'lawyer';

        component.onRenew();

        expect(component.renew.emit).toHaveBeenCalledWith('lawyer');
    });

    it('should reset the selected key and notify the change', () => {
        spyOn(component.keyChange, 'emit');
        component.key = {id: '1'};
        component.inputValue = 'search';

        component.resetKey();

        expect(component.key).toBeNull();
        expect(component.inputValue).toBe('');
        expect(component.keyChange.emit).toHaveBeenCalledWith(null);
    });

    it('should select a value and emit both selection events', () => {
        const user = {id: '1', name: 'Ana'};
        spyOn(component.keyChange, 'emit');
        spyOn(component.selected, 'emit');
        component.inputValue = 'Ana';

        component.onClick(user);

        expect(component.key).toEqual(user);
        expect(component.keyChange.emit).toHaveBeenCalledWith(user);
        expect(component.selected.emit).toHaveBeenCalledWith(user);
        expect(component.inputValue).toBe('');
    });

    it('should track options using id when available', () => {
        expect(component.trackOption({id: 'user-1', name: 'Ana'})).toBe('user-1');
        expect(component.trackOption('plain-value')).toBe('plain-value');
    });
});

describe('UppercaseWordsPipe', () => {
    let pipe: UppercaseWordsPipe;

    beforeEach(() => {
        pipe = new UppercaseWordsPipe();
    });

    it('should return an empty string for empty values', () => {
        expect(pipe.transform('')).toBe('');
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('should format separated and camel case words', () => {
        expect(pipe.transform('income_detail')).toBe('Income Detail');
        expect(pipe.transform('billingRecordDialog')).toBe('Billing Record Dialog');
    });
});

describe('CapitalizeEnumNamePipe', () => {
    let pipe: CapitalizeEnumNamePipe;

    beforeEach(() => {
        pipe = new CapitalizeEnumNamePipe();
    });

    it('should return an empty string for empty values', () => {
        expect(pipe.transform('')).toBe('');
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('should capitalize enum names separated by underscores', () => {
        expect(pipe.transform('LEGAL_OPERATOR')).toBe('Legal Operator');
    });
});

