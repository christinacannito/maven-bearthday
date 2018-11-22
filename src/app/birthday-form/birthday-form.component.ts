import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-birthday-form',
  templateUrl: './birthday-form.component.html',
  styleUrls: ['./birthday-form.component.scss']
})
export class BirthdayFormComponent implements OnInit {
  month: number;
  day: number;
  year: number;

  constructor() { }

  ngOnInit = () => {
  }

  submitBirthday = (monthInput, dayInput, yearInput) => {
    this.month = monthInput;
    this.day = dayInput;
    this.year = yearInput
  }
}
