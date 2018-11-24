import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

// import {StorageService} from './storage.service';
import {Token} from '../entities/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiServer = environment.apiServer;
  private _token: Token;

  constructor() {

  }


  get token(): Token {
    return this._token;
  }

  set token(value: Token) {
    this._token = value;
  }
}
