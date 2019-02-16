import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs/internal/Subscription';

import {Token} from '../entities/token';
import {Observable, Subject} from 'rxjs';
import {ApiResponse} from '../entities/api-response';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private static readonly createUserUri = environment.apiServer + 'api/v1/user/create';

  // TODO: implement date check
  private static checkDate(token: Token) {
    return true;
  }

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService) {
  }

  public init(): void {
    let token: Token;
    try {
      token = <Token>JSON.parse(localStorage.getItem('token'));
    } catch (e) {
      // TODO: alert component
      console.error(e.message);
    }

    if (token && InitService.checkDate(token)) {
      this.tokenService.setToken(token);
    } else {
      this.reinit();
    }
  }

  public reinit() {
    this.tokenService.setToken(null);
    this.httpClient
      .post<ApiResponse<Token>>(InitService.createUserUri, null)
      .subscribe(
        (response: ApiResponse<Token>) => {
          if (response.success) {
            this.tokenService.setToken(response.data);
          } else {
            // TODO Alert component
            console.error(response.error);
          }
        },
        (error: Error) => {
          // TODO Alert component
          console.error(error);
          // this.initEvent.emit(false);
        }
      );
  }
}
