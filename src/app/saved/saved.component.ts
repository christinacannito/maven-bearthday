import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent implements OnInit {
  savedImages;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }

  ngOnInit() {
    this.pullSavedImages();
  }

  pullSavedImages = () => {
    this.savedImages = this.storage.get('savedImages');
    
    console.log('retrievedObject: ', this.savedImages)
    // this.savedImages = JSON.parse(this.savedImages)
    return this.savedImages;
  }

}
