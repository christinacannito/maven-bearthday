import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { NasaApiService } from '../nasa-api.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-birthday-form',
  templateUrl: './birthday-form.component.html',
  styleUrls: ['./birthday-form.component.scss']
})
export class BirthdayFormComponent implements OnInit {
  month: number;
  day: number;
  year: number;
  imageUrl: string;
  countDownOver: boolean = false;
  countDown: number = 3;
  count: number = 3;
  enter: boolean = false;
  monthError: string = '';
  dayError: string = '';
  yearError: string = '';
  errorMsg: string = '';
  imageReturned: boolean = false;
  savedImages: Array<string> = [];
  makeRequest: boolean = true;
  birthDayDate: string;
  stringDay: string;
  stringMonth: string;
  stringYear: string;

  constructor(private nasaApiService: NasaApiService, @Inject(SESSION_STORAGE) private storage: StorageService) { }

  ngOnInit(): void {
  }

  convertToDates = (date) => {
    // console.log('date: ', date)
    let dateString = date['date'];
    let dateArray = dateString.split('-')
    let dateConverted = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]), 0, 0, 0, 0 )
    return dateConverted;
  }

  findClosestDate = (dateEntered: any, datesAvailable) => {
    let toJsonDates = JSON.parse(datesAvailable)
    dateEntered = new Date(dateEntered[0], dateEntered[1], dateEntered[2], 0, 0, 0, 0 )
    let outputArray = toJsonDates.map(this.convertToDates)
    let closestDate = outputArray.sort((a, b) => {
      var distancea = Math.abs(dateEntered - a);
      var distanceb = Math.abs(dateEntered - b);
      return distancea - distanceb;
    })[0];
    console.log('closest date: ', closestDate)
    return closestDate;
  }

  errorMessages = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if(this.year > yyyy) {
      this.errorMsg = 'Date entered can not be in the future!'
    } else if (this.year === yyyy) {
      if (this.month <= mm && this.day <= dd){
        this.errorMsg = '';
      } else {
        this.errorMsg = 'Date entered can not be in the future!'

      }
    } else {
      this.errorMsg = '';
    }

    if(this.month > 12) {
      this.monthError = 'Month must be less than 13';
    } else if (this.month < 1) {
      this.monthError = 'Month must be greater than 0';
    } else {
      this.monthError = '';
    }

    if(this.day > 31) {
      this.dayError = 'Day you entered can not be over 31.';
    } else if (this.day < 1) {
      this.dayError = 'Day needs to be greater than 0.';
    } else {
      this.dayError = '';
    }

    if(this.year <= yyyy) {
      this.yearError = ''
    } else {
      this.yearError = 'Year you entered was not correct, please try again';
    }
  }

  checkIfNumberNeedsZero = (numberToCheck) => {
    let stringNumber: string = ''
    if(numberToCheck < 10) {
      stringNumber = '0' + numberToCheck.toString();
    } else {
      stringNumber = numberToCheck.toString();
    }
    return stringNumber;
  }

  submitBirthday = () => {
    let self = this;
    this.errorMessages();

    let stringDay = self.day.toString();;
    let stringMonth = self.month.toString();
    let stringYear = self.year.toString();
    stringDay = this.checkIfNumberNeedsZero(self.day)
    // console.log('stringDay top: ', stringDay)
    stringMonth = this.checkIfNumberNeedsZero(self.month)
    stringYear = this.checkIfNumberNeedsZero(self.year)
    if(this.monthError === '' && this.dayError === '' && this.yearError === '' && this.errorMsg === '') {
      this.nasaApiService.makeRequest(stringMonth, stringDay, this.year).then((data) => {
        return data;
      }, function(error) {
        console.log('error: ', error)
      }).then((birthdayData: string) => {
        birthdayData = JSON.parse(birthdayData)
        let imageName;
        if(birthdayData[0] === undefined) {
          let compiledYear = [self.year, self.month - 1, self.day]; // tried
          self.nasaApiService.getAllAvailableDates().then((data) => {
            return self.findClosestDate(compiledYear, data)
          }).then((foundDate) => {
            var foundDay = foundDate.getDate();
            var foundMonth = foundDate.getMonth()+1;
            var foundYear = foundDate.getFullYear();
            let foundDayString = foundDay.toString();
            let foundMonthString = foundMonth.toString();
            let foundYearString = foundYear.toString();

            foundDayString = self.checkIfNumberNeedsZero(foundDay)
            foundMonthString = self.checkIfNumberNeedsZero(foundMonth) 

            this.nasaApiService.makeRequest(foundMonthString, foundDayString, foundYear).then((birthdayData: string) => {
              birthdayData = JSON.parse(birthdayData)
              imageName = birthdayData[0]['image']
              self.nasaApiService.imageRequest(imageName, foundDayString, foundMonthString, foundYear).then((imageUrl) => {
                self.imageReturned = true;
                self.birthDayDate = "Your birthday wasn't found, but here is the image of the Earth from the closest date. Date is: " + foundMonthString + '/' + foundDayString + '/' + foundYearString;
                self.imageUrl = imageUrl.toString();
              })
            })
          })
        } else {
          imageName = birthdayData[0]['image']
          // console.log('stringday: ', stringDay)
          self.nasaApiService.imageRequest(imageName, stringDay, stringMonth, self.year).then((imageUrl) => {
            self.imageReturned = true;
            self.birthDayDate = "Your birthday was found! " + stringMonth + '/' +stringDay + '/' + stringYear;
            self.imageUrl = imageUrl.toString();
          })
        }
      })
    }
  }
  
  saveImage = () => {
    console.log('this.imageUrl was clicked: ', this.imageUrl)
    this.savedImages = this.storage.get('savedImages')
    this.savedImages.push(this.imageUrl);
    this.storage.set('savedImages', this.savedImages);
  } 
}
