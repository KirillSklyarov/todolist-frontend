import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private createEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  public setCreate(success: boolean) {
    this.createEvent.emit(success);
  }

  public getCreateEvent(): EventEmitter<boolean> {
    return this.createEvent;
  }
}
