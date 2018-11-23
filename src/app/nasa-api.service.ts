import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {
  url:string = "https://api.nasa.gov/EPIC/api/enhanced/date/";
  key: string = "9JJprXB7NZaXke1ZjIyFwOOh5s6G0zXCIq79fZZ7";
  // imageUrl: string = "https://epic.gsfc.nasa.gov/archive/enhanced/2015/11/22/png/epic_RGB_20151122001751.png";
  imageUrl: string = "https://epic.gsfc.nasa.gov/archive/enhanced/"
  // the url above is to get the actual image that you will find when you get the data back from the first request

  constructor() {}

  makeRequest = (month, day, year) => {
    let self = this;
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      // console.log('month: ', month, 'day: ', day, 'year: ', year)
      let compiledUrl = self.url + year + '-' + month + '-' + day + '?api_key=' + self.key
      console.log('compiled url: ', compiledUrl)
      req.open('GET', compiledUrl);
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          // console.log('req.response: ', req.response)
          resolve(req.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };
      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      // Make the request
      req.send();
    });
  }

  imageRequest = (imageName, day, month, year) => {
    let self = this;
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      // console.log('month: ', month, 'day: ', day, 'year: ', year)
      //2015/11/22/png/epic_RGB_20151122001751.png
      let imageDateUrl = self.imageUrl + year + '/' + month + '/' + day + '/png/' + imageName + '.png?api_key=' + self.key
      console.log('compiled url: ', imageDateUrl)
      
      req.open('GET', imageDateUrl);
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          // console.log('req.response: ', req.response)
          resolve(imageDateUrl);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };
      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      // Make the request
      req.send();
    });
  }
}
