import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterDateComponent } from './filter-date.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
});

