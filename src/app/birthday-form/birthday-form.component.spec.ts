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
  let datesAvailable: string;

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
    datesAvailable = '[{"date":"2015-08-31"},{"date":"2015-08-27"},{"date":"2015-08-26"},{"date":"2015-08-25"},{"date":"2015-08-24"},{"date":"2015-08-23"},{"date":"2015-08-20"},{"date":"2015-08-18"},{"date":"2015-08-17"},{"date":"2015-08-12"},{"date":"2015-08-11"},{"date":"2015-08-10"},{"date":"2015-08-09"},{"date":"2015-08-08"},{"date":"2015-08-07"},{"date":"2015-08-06"},{"date":"2015-08-04"},{"date":"2015-08-03"},{"date":"2015-06-27"},{"date":"2015-06-17"}]'

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
    it('should get the closest date', () => {
      let compiledDate = ['2015', '06', '17'];
      let closestDate = component.findClosestDate(compiledDate, datesAvailable);
      let expectedDate = new Date('Mon Aug 03 2015 00:00:00 GMT-0400 (Eastern Daylight Time)')
      expect(closestDate.getTime()).toBe(expectedDate.getTime())
    })
  })

  
});
