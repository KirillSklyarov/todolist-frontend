import { Injectable, OnDestroy } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {ApiResponse} from '../entities/api-response';
import {AuthService} from './auth.service';
import {HelperService} from './helper.service';
import {User} from '../entities/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static readonly registerUri = environment.apiServer + '/api/v1/user/register';
  private static readonly loginUri = environment.apiServer + '/api/v1/user/login';

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private helper: HelperService) {
  }

  public register(username: string, password: string): Observable<ApiResponse<User>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<User>>(
      UserService.registerUri,
      userData,
      options);
  }

  public login(username: string, password: string): Observable<ApiResponse<User>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<User>>(
      UserService.loginUri,
      userData,
      options);
  }
}
