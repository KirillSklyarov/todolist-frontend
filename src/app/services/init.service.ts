import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

import {AuthService} from './auth.service';
import {Token} from '../entities/token';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private readonly apiServer = environment.apiServer;
  private readonly createUserUri = '/api/v1/user/create';
  private token: Token;

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  public init(): Subject<boolean> {
    const result = new Subject<boolean>();
    const initUri = this.apiServer + this.createUserUri;
    let savedToken: string;
    try {
      savedToken = localStorage.getItem('token');
      if (savedToken) {
        this.token = JSON.parse(savedToken);
      }
    } catch (e) {
      // TODO: alert component
      console.error(e.message);
    }
    // TODO: add date check
    if (this.token) {
      this.authService.token = this.token;
      result.next(true);
    } else {
      this.httpClient.post<Token>(initUri, null)
        .subscribe(
          (token: Token) => {
            this.token = token;
            this.authService.token = this.token;
            try {
              localStorage.setItem('token', JSON.stringify(this.token));
            } catch (e) {
              // TODO: alert component
              console.error(e.message);
            }
            result.next(true);
          },
          error => {
            console.log(error);
            result.next(false);
          }
        );
    }
    console.log(this.token);


    return result;
  }

}
