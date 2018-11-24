import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { NasaApiService } from '../nasa-api.service';
// import { ConsoleReporter } from 'jasmine';
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

  constructor(private nasaApiService: NasaApiService, @Inject(SESSION_STORAGE) private storage: StorageService) { }

  ngOnInit(): void {
    this.startCountDown();
  }

  startCountDown = () => {
    let seconds_left = 3;
    let self = this;
    
    // console.log('countCounter: ', countContainer)
    const interval = setInterval(function() {
        seconds_left--
        console.log('seconds left: ', seconds_left)
        self.count = seconds_left;

        if (seconds_left < 0) {
          self.count = 0
          clearInterval(interval);
          let countContainer = document.getElementById('countDown');
          countContainer.classList.remove('active');
          self.enter = true;
        }
    }, 1000);
  }

  convertToDates = (date) => {
    console.log('date: ', date)
    let dateString = date['date'];
    let dateArray = dateString.split('-')
    let dateConverted = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]))
    return dateConverted;
  }

  findClosestDate = (dateEntered: any, datesAvailable) => {
    console.log('testing converting date: ', new Date(dateEntered[0], dateEntered[1], dateEntered[2]))
    // you want to compare the date they entered with the dates that are available
    console.log('datesAvailable: ', typeof datesAvailable)
    let toJsonDates = JSON.parse(datesAvailable)
    console.log('toJsonDates: ', toJsonDates)
    // you should convert the closestDate array first an array of dates 
    dateEntered = new Date(dateEntered[0], dateEntered[1], dateEntered[2])
    let outputArray = toJsonDates.map(this.convertToDates)
    let closestDate = outputArray.sort((a, b) => {
      // console.log('a: ', a)

      var distancea = Math.abs(dateEntered - a);
      var distanceb = Math.abs(dateEntered - b);
      return distancea - distanceb;
    })[0]
    console.log('closest date is...', closestDate)
    return closestDate;
  }

  submitBirthday = () => {
    let self = this;
    // first you have to make sure that the inputs are correct
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    console.log('day: ', dd, ' mm: ', mm, ' yyyy: ', yyyy)
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
      console.log('DAY IS CORRECT')
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

    // only if there are no errors should the request be made
    let stringDay = self.day.toString();;
    let stringMonth = self.month.toString();
    if(self.day < 10) {
      stringDay = '0' + stringDay;
    }

    if(self.month < 10) {
      stringMonth = '0' + stringMonth;
    }
    if(this.monthError === '' && this.dayError === '' && this.yearError === '' && this.errorMsg === '') {
      this.nasaApiService.makeRequest(stringMonth, stringDay, this.year).then((data) => {
        var converted  = data;
        console.log('data: ', typeof data)
        return converted
      }, function(error) {
        console.log('error: ', error)
      }).then((birthdayData: string) => {
        // console.log('birthdayData: ', JSON.parse(birthdayData))
        // get the image from the birthday
        birthdayData = JSON.parse(birthdayData)
        let imageName;
        // console.log('imageName: ', imageName)
        let stringDay = self.day.toString();;
        let stringMonth = self.month.toString();

        if(birthdayData[0] === undefined) {
          // let stringYear = this.year.toString()
          let compiledYear = [self.year, self.month - 1, self.day];
          self.nasaApiService.getAllAvailableDates().then((data) => {
            console.log('data in all images: ', data)
            return self.findClosestDate(compiledYear, data)
          }).then((foundDate) => {
            // now that you have the response back you can make the request for the closet date found
            // setImage name here
            // imageName = ? 
            // Mon Nov 12 2018 00:00:00 GMT-0500 (Eastern Standard Time) // date is returned like this
            var foundDay = foundDate.getDate();
            var foundMonth = foundDate.getMonth()+1; //January is 0!
            var foundYear = foundDate.getFullYear();
            console.log('closest date in the then statement, day: ', foundDay, ' month: ', foundMonth, ' year: ', foundYear)
            // you then need to get the image name for that date you found 
            let foundDayString = foundDay.toString();
            let foundMonthString = foundMonth.toString();
            this.nasaApiService.makeRequest(foundMonthString, foundDayString, foundYear).then((birthdayData: string) => {
              console.log('birthdayData: ', birthdayData)
              birthdayData = JSON.parse(birthdayData)
              imageName = birthdayData[0]['image']
              console.log('birthdayData[0]: ', birthdayData[0])
              console.log('imageName when cant find: ', imageName)
              self.nasaApiService.imageRequest(imageName, foundDayString, foundMonthString, foundYear).then((imageUrl) => {
                // print the image to the screen 
                self.imageReturned = true;
                self.imageUrl = imageUrl.toString();
              })
            })
          })
        } else {
          imageName = birthdayData[0]['image']
          if(self.day < 10) {
            stringDay = '0' + stringDay;
          }
  
          if(self.month < 10) {
            stringMonth = '0' + stringMonth;
          }
          self.nasaApiService.imageRequest(imageName, stringDay, stringMonth, self.year).then((imageUrl) => {
            // print the image to the screen 
            self.imageReturned = true;
            self.imageUrl = imageUrl.toString();
          })
        }
        
       
      })
    }
  }

  enterSite = () => {
    this.countDownOver = true;
  }

  saveImage = () => {
    console.log('this.imageUrl was clicked: ', this.imageUrl)
    // const earthImages = this.storage.get('savedImages') || [];
    // this.savedImages.push(this.imageUrl);
    // this.storage.set('savedImages', earthImages);
    this.savedImages = this.storage.get('savedImages')
    this.savedImages.push(this.imageUrl);
    this.storage.set('savedImages', this.savedImages);
    // localStorage.setItem('savedImagesObj', JSON.stringify(this.savedImages));
  } 
}
