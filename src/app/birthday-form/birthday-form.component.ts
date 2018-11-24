import { Component, OnInit } from '@angular/core';
import { NasaApiService } from '../nasa-api.service';
import { ConsoleReporter } from 'jasmine';

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
    this.nasaApiService.makeRequest(this.month, this.day, this.year).then((data) => {
      console.log('data in submit: ', typeof data)
      var converted  = data;
      return converted
    }, function(error) {
      console.log('error: ', error)
    }).then((birthdayData: string) => {
      console.log('birthdayData: ', JSON.parse(birthdayData))
      // get the image from the birthday
      birthdayData = JSON.parse(birthdayData)
      let imageName = birthdayData[0]['image']
      console.log('imageName: ', imageName)
      self.nasaApiService.imageRequest(imageName, self.day, self.month, self.year).then((imageUrl) => {
        // print the image to the screen 
        self.imageUrl = imageUrl.toString();
      })
    })
  }

  enterSite = () => {
    this.countDownOver = true;
  }
}
