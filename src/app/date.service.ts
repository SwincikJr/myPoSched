import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  today(main: Boolean = true): string {
    
    let todayString = (new Date).toLocaleDateString();
    let todayArray = todayString.split('/');

    return !main ? todayString : todayArray[2] + '-' + todayArray[1] + '-' + todayArray[0]

  }

  convert(date: string, main: Boolean = true): string {

    let dateArray;

    if(main) {

      dateArray = date.split('/');
      return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
    
    } else {

      dateArray = date.split('-');
      return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];

    }

  }
}
