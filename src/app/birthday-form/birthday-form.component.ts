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
      if (this.month >= mm && this.day >= dd){
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
    if(this.monthError === '' && this.dayError === '' && this.yearError === '' && this.errorMsg === '') {
      this.nasaApiService.makeRequest(this.month, this.day, this.year).then((data) => {
        // console.log('data in submit: ', typeof data)
        var converted  = data;
        return converted
      }, function(error) {
        console.log('error: ', error)
      }).then((birthdayData: string) => {
        // console.log('birthdayData: ', JSON.parse(birthdayData))
        // get the image from the birthday
        birthdayData = JSON.parse(birthdayData)
        let imageName = birthdayData[0]['image']
        // console.log('imageName: ', imageName)
        self.nasaApiService.imageRequest(imageName, self.day, self.month, self.year).then((imageUrl) => {
          // print the image to the screen 
          self.imageReturned = true;
          self.imageUrl = imageUrl.toString();
        })
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
