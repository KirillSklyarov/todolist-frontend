import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  createEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  setCreate(success: boolean) {
    this.createEvent.emit(success);
  }
}
