import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const monthNumber = date.getMonth() + 1;
    const dayNumber = date.getDate();
    const month = monthNumber < 10 ? '0' + monthNumber : monthNumber;
    const day = dayNumber < 10 ? '0' + dayNumber : dayNumber;

    return `${year}-${month}-${day}`;
  }
}
