import {EventEmitter, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

import {Token} from '../entities/token';
import {ApiResponse} from '../entities/api-response';
import {TokenService} from './token.service';
import {State} from '../entities/state';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private static readonly createUserUri = environment.apiServer + 'api/v1/user/create';
  private readonly stateEvent: EventEmitter<State> = new EventEmitter<State>();


  // TODO: implement date check
  private static checkDate(token: Token) {
    return true;
  }

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService) {
  }

  public init(): void {
    this.stateEvent.emit(State.processing);
    let token: Token;
    try {
      token = <Token>JSON.parse(localStorage.getItem('token'));
    } catch (e) {
      // TODO: alert component
      console.error(e.message);
    }

    if (token && InitService.checkDate(token)) {
      this.tokenService.setToken(token);
      this.stateEvent.emit(State.true);
    } else {
      this.reinit();
    }
  }

  public reinit(): void {
    this.stateEvent.emit(State.processing);
    this.tokenService.setToken(null);
    this.httpClient
      .post<ApiResponse<Token>>(InitService.createUserUri, null)
      .subscribe(
        (response: ApiResponse<Token>) => {
          if (response.success) {
            this.tokenService.setToken(response.data);
            this.stateEvent.emit(State.true);
          } else {
            this.stateEvent.emit(State.false);
          }
        },
        (error: Error) => {
          this.stateEvent.emit(State.false);
        }
      );
  }

  public getStateEvent(): EventEmitter<State> {
    return this.stateEvent;
  }
}
