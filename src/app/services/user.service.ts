import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {ApiResponse} from '../entities/api-response';
import {HelperService} from './helper.service';
import {User} from '../entities/user';
import {TokenService} from './token.service';
import {Token} from '../entities/token';
import {tap} from 'rxjs/operators';
import {ConnectionService} from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ConnectionService {
  private static readonly userUri = `${ConnectionService.apiPath}/user`;

  private static readonly registerUri = `${UserService.userUri}/register`;
  private static readonly loginUri = `${UserService.userUri}/login`;

  constructor(httpClient: HttpClient,
              tokenService: TokenService,
              ) {
    super(httpClient, tokenService);
  }

  public register(username: string, password: string): Observable<ApiResponse<Token>> {
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<Token>>(
      UserService.registerUri,
      userData,
      this.options).pipe(
      tap(response => {
        if (response.success) {
          this.tokenService.setToken(response.data);
        } else {
          console.error(response.error);
        }
      }))
      ;
  }

  public login(username: string, password: string): Observable<ApiResponse<Token>> {
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<Token>>(
      UserService.loginUri,
      userData,
      this.options).pipe(
      tap(data => {
        console.log(data);
      })
    )
      ;
  }
}
