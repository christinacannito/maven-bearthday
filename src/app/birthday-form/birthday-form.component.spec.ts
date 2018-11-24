import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayFormComponent } from './birthday-form.component';
import { FormsModule } from '@angular/forms';

import { of } from 'rxjs'

describe('BirthdayFormComponent', () => {
  let component: BirthdayFormComponent;
  let fixture: ComponentFixture<BirthdayFormComponent>;
  let month: number; 
  let day: number; 
  let year: number;
  let mockNasaService;
  let mockStorageService;
  let date;
  let composedDate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ BirthdayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    month = 2;
    day = 12;
    year = 2015;
    date =  {date: "2018-11-23"};
    // fixture = TestBed.createComponent(BirthdayFormComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();

    mockNasaService = jasmine.createSpyObj(['makeRequest', 'imageRequest'])
    mockStorageService = jasmine.createSpyObj(['get', 'set'])

    component = new BirthdayFormComponent(mockNasaService, mockStorageService)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('enter in birthday', () => {
  //   it('should only accept integers as date values', () => {
  //       mockNasaService.submitBirthday.and.returnValue(of(true))
  //       component.month = month;
  //       component.day = day;
  //       component.year = year;

  //       component.submitBirthday();
  //       expect(component.month).toBe(typeof component.month === 'number')
  //   })
  // })

  describe('should convert strings to dates', () => {
    it('should take in a hash and then that has should be parsed, returns a date object', () => {
      let result = component.convertToDates(date)
      composedDate = new Date(2018, 10, 23)
      expect(result.getTime()).toBe(composedDate.getTime())
    })
  })
});
