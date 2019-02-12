import { Injectable } from '@angular/core';
import {Token} from '../entities/token';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: Token;
  private readonly updatedToken: Subject<Token> = new Subject<Token>();

  constructor() {
    try {
      const savedToken = localStorage.getItem('token');
      // if (savedToken) {
      this.token = <Token>JSON.parse(savedToken);
      // }
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
    this.updatedToken.next(token);
  }

  public getToken(): Token|null {
    return this.token;
  }

  public getUpdatedToken() {
    return this.updatedToken;
  }
}
