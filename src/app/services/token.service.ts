import { EventEmitter, Injectable } from '@angular/core';
import {Token} from '../entities/token';
import {Subject} from 'rxjs';
import {classToPlain} from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: Token|null;
  private readonly updateEvent: EventEmitter<Token> = new EventEmitter<Token>();

  constructor() {
  }

  public setToken(token: Token|null) {
    try {
      if (token) {
        localStorage.setItem('token', JSON.stringify(classToPlain(token)));
      } else {
        localStorage.removeItem('token');
      }
    } catch (e) {
      // TODO: alert component
      console.error(e.message);
    }
    this.token = token;
    this.updateEvent.emit(token);
  }

  public getToken(): Token|null {
    return this.token;
  }

  public getUpdateEvent() {
    return this.updateEvent;
  }
}
