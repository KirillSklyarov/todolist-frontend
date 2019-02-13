import { EventEmitter, Injectable } from '@angular/core';
import {Token} from '../entities/token';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: Token;
  private readonly updateEvent: EventEmitter<Token> = new EventEmitter<Token>();

  constructor() {
    try {
      this.token = <Token>JSON.parse(localStorage.getItem('token'));
    } catch (e) {
      // TODO: alert component
      console.error(e.message);
    }
  }

  public setToken(token: Token) {
    try {
      localStorage.setItem('token', JSON.stringify(token));
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
