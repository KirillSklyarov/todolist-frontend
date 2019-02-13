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

  private readonly initEvent: EventEmitter<boolean> = new EventEmitter();

  // TODO: implement date check
  private static checkDate(token: Token) {
    return true;
  }

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService) {
  }

  public getInitEvent(): EventEmitter<boolean> {
    return this.initEvent;
  }

  public init(): void {
    let token: Token;

    token = this.tokenService.getToken();
    if (token && InitService.checkDate(token)) {
      this.tokenService.getUpdateEvent().emit(token);
      this.initEvent.emit(true);
    } else {
      this.httpClient
        .post<ApiResponse<Token>>(InitService.createUserUri, null)
        .subscribe(
          (response: ApiResponse<Token>) => {
            if (response.success) {
              this.tokenService.setToken(response.data);
              this.initEvent.emit(true);
            } else {
              // TODO Alert component
              console.error(response.error);
              this.initEvent.emit(false);
            }
          },
          (error: Error) => {
            // TODO Alert component
            console.error(error);
            this.initEvent.emit(false);
          }
        );
    }
  }
}
