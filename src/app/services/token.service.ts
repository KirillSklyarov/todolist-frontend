import { Injectable } from '@angular/core';
import {Token} from '../entities/token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: Token;

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
  }

  public getToken(): Token|null {
    return this.token;
  }

}
