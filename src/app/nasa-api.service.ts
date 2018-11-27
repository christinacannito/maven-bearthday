import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {
  url:string = "https://api.nasa.gov/EPIC/api/enhanced/date/";
  key: string = "9JJprXB7NZaXke1ZjIyFwOOh5s6G0zXCIq79fZZ7";
  imageUrl: string = "https://epic.gsfc.nasa.gov/archive/enhanced/";
  allAvailableDatesUrl = 'https://api.nasa.gov/EPIC/api/enhanced/all?api_key=';

  constructor() {}

  makeRequest = (month, day, year) => {
    let self = this;
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      let compiledUrl = self.url + year + '-' + month + '-' + day + '?api_key=' + self.key
      console.log('compiled url for the image name: ', compiledUrl)
      req.open('GET', compiledUrl);
      req.onload = function() {
        if (req.status == 200) {
          console.log('req.response: ', JSON.parse(req.response)) // here is could be empty
          resolve(req.response);
        }
        else {
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

  getAllAvailableDates = () => {
    let self = this;
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      let allImagesUrl = self.allAvailableDatesUrl + self.key
      
      req.open('GET', allImagesUrl);
      req.onload = function() {

        if (req.status == 200) {

          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }

  imageRequest = (imageName, day, month, year) => {
    let self = this;
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      let imageDateUrl = self.imageUrl + year + '/' + month + '/' + day + '/png/' + imageName + '.png?api_key=' + self.key
      console.log('compiled url: ', imageDateUrl)
      
      req.open('GET', imageDateUrl);
      req.onload = function() {
        if (req.status == 200) {
          resolve(imageDateUrl);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }
}
