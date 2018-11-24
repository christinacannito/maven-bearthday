import { Component, OnInit } from '@angular/core';
import { NasaApiService } from '../nasa-api.service';
// import { ConsoleReporter } from 'jasmine';

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
  imageReturned: boolean = false;

  constructor(private nasaApiService: NasaApiService) { }

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

    if(this.month < 13 && this.month > 0) {
      console.log('month is correct')
    } else {
      console.log('MONTH IS NOT CORRECT')
      this.monthError = 'Month you entered was not correct, please try again.'
    }

    if(this.day < 31 && this.day > 0) {
      console.log('DAY IS CORRECT')
    } else {
      console.log('DAY NOT CORRECT')
      this.dayError = 'Day you entered was not correct, please try again.'

    }

    if(this.year <= yyyy) {
      console.log('year is correct')
    } else {
      this.yearError = 'Year you entered was not correct, please try again'
    }

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

  enterSite = () => {
    this.countDownOver = true;
  }
}
