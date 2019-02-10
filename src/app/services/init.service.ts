import {Injectable, OnDestroy} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs/internal/Subscription';

import {AuthService} from './auth.service';
import {Token} from '../entities/token';
import {Observable, Subject} from 'rxjs';
import {ApiResponse} from '../entities/api-response';

@Injectable({
  providedIn: 'root'
})
export class InitService implements OnDestroy {
  private static readonly createUserUri = environment.apiServer + '/api/v1/user/create';

  // private readonly apiServer = environment.apiServer;
  private readonly result: Subject<boolean> = new Subject<boolean>();
  private readonly subscriptions: Subscription = new Subscription();
  private token: Token;

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  public getResult(): Subject<boolean> {
    return this.result;
  }

  public init(): void {
    const result = new Subject<boolean>();
    // let savedToken: string;
    try {
      const savedToken = localStorage.getItem('token');
      // if (savedToken) {
      this.token = <Token>JSON.parse(savedToken);
      // }
    } catch (e) {
      // TODO: alert component
      console.error(e.message);
    }
    // TODO: add date check
    if (this.token) {
      this.authService.token = this.token;
      this.result.next(true);
    } else {
      const subscription = this.httpClient.post<ApiResponse<Token>>(InitService.createUserUri, null)
        .subscribe(
          (apiResponse: ApiResponse<Token>) => {
            this.token = apiResponse.data;
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
            // TODO Alert component
            console.log(error);
            this.result.next(false);
          }
        );

      this.subscriptions.add(subscription);
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
