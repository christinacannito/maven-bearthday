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
  let datesAvailable;

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
    datesAvailable = [
      {"date":"2018-11-19"},
      {"date":"2018-11-18"},
      {"date":"2018-11-17"},
      {"date":"2018-11-16"},
      {"date":"2018-11-15"},
      {"date":"2018-11-14"},
      {"date":"2018-11-13"},
      {"date":"2018-11-12"},
      {"date":"2018-11-08"}
    ]

    mockNasaService = jasmine.createSpyObj(['makeRequest', 'imageRequest'])
    mockStorageService = jasmine.createSpyObj(['get', 'set'])

    component = new BirthdayFormComponent(mockNasaService, mockStorageService)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should convert strings to dates', () => {
    it('should take in a hash and then that has should be parsed, returns a date object', () => {
      let result = component.convertToDates(date)
      composedDate = new Date(2018, 10, 23)
      expect(result.getTime()).toBe(composedDate.getTime())
    })
  })

  describe('should be able to find the closest date if date entered was not found', () => {
    let compiledYear = [2018, 11, 9];
    // closest date: 
    component.findClosestDate(compiledYear, datesAvailable);
  })
});
