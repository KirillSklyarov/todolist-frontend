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
  private readonly result: Subject<boolean> = new Subject<boolean>();
  private readonly createUserUri = '/api/v1/user/create';
  private token: Token;

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  public getResult(): Subject<boolean> {
    return this.result;
  }

  public init(): void {
    // const result = new Subject<boolean>();
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
      this.result.next(true);
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
            this.result.next(true);
          },
          error => {
            console.log(error);
            this.result.next(false);
          }
        );
    }
    console.log(this.token);
  }

}
