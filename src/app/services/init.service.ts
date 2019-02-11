import {Injectable, OnDestroy} from '@angular/core';
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
export class InitService implements OnDestroy {
  private static readonly createUserUri = environment.apiServer + '/api/v1/user/create';

  private readonly result: Subject<boolean> = new Subject<boolean>();
  private readonly subscriptions: Subscription = new Subscription();

  // TODO: implement date check
  private static checkDate(token: Token) {
    return true;
  }

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService) {
  }

  public getResult(): Subject<boolean> {
    return this.result;
  }

  public init(): void {
    const token = this.tokenService.getToken();
    if (token && InitService.checkDate(token)) {
      this.result.next(true);
    } else {
      const subscription = this.httpClient.post<ApiResponse<Token>>(InitService.createUserUri, null)
        .subscribe(
          (response: ApiResponse<Token>) => {
            if (response.success) {
              this.tokenService.setToken(response.data);
              this.result.next(true);
            } else {
              // TODO Alert component
              console.error(response.error);
            }
          },
          error => {
            // TODO Alert component
            console.error(error);
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
