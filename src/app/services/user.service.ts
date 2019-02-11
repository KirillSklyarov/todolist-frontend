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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static readonly registerUri = environment.apiServer + '/api/v1/user/register';
  private static readonly loginUri = environment.apiServer + '/api/v1/user/login';

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService,
              ) {
  }

  public register(username: string, password: string): Observable<ApiResponse<Token>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.tokenService.getToken().uuid
      }
    };
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<Token>>(
      UserService.registerUri,
      userData,
      options).pipe(
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
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.tokenService.getToken().uuid
      }
    };
    const userData = {
      username: username,
      password: password
    };

    return this.httpClient.post<ApiResponse<Token>>(
      UserService.loginUri,
      userData,
      options).pipe(
      tap(data => {
        console.log(data);
      })
    )
      ;
  }
}
