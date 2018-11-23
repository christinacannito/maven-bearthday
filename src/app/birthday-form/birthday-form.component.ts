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
      console.log('data: ', typeof(data))
      // make the request for the image
      var converted = JSON.parse(data)
      return converted
    }, function(error) {
      console.log('error: ', error)
    }).then((birthdayData) => {
      console.log('birthdayData: ', birthdayData)
      // get the image from the birthday
      // birthdayData = JSON.parse(birthdayData)
      let imageName = birthdayData[0]['image']
      console.log('imageName: ', typeof(birthdayData))
      self.nasaApiService.imageRequest(imageName, self.day, self.month, self.year).then((imageUrl) => {
        // console.log('imageUrl typeof: ', typeof(imageUrl))
        // print the image to the screen 
        self.imageUrl = imageUrl.toString();
      })
    })
  }
}
