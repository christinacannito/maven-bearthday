import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayFormComponent } from './birthday-form.component';

import { of } from 'rxjs'

describe('BirthdayFormComponent', () => {
  let component: BirthdayFormComponent;
  let fixture: ComponentFixture<BirthdayFormComponent>;
  let month: number; 
  let day: number; 
  let year: number;
  let mockNasaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    month = 2;
    day = 12;
    year = 2015;
    // fixture = TestBed.createComponent(BirthdayFormComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();

    mockNasaService = jasmine.createSpyObj(['makeRequest', 'imageRequest'])

    component = new BirthdayFormComponent(mockNasaService)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('enter in birthday', () => {
    it('should only accept integers as date values', () => {
        mockNasaService.submitBirthday.and.returnValue(of(true))
        component.month = month;
        component.day = day;
        component.year = year;

        component.submitBirthday();
        // expect(component.)
    })
  })
});
