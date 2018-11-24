import { Component, OnInit } from '@angular/core';
import { NasaApiService } from '../nasa-api.service';

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

  constructor(private nasaApiService: NasaApiService) { }

  ngOnInit = () => {

  }

  submitBirthday = () => {
    // here you can make the call to the service 
    let self = this;
    this.nasaApiService.makeRequest(this.month, this.day, this.year).then((data) => {
      console.log('data in submit: ', typeof data)
      // make the request for the image
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
        // console.log('imageUrl typeof: ', typeof(imageUrl))
        // print the image to the screen 
        self.imageUrl = imageUrl.toString();
      })
    })
  }
}
