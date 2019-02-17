import {EventEmitter, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

import {Token} from '../entities/token';
import {ApiResponse} from '../entities/api-response';
import {TokenService} from './token.service';
import {AppState} from '../entities/appState';
import {classToPlain, plainToClass, plainToClassFromExist} from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private static readonly createUserUri = environment.apiServer + 'api/v1/user/create';
  private readonly stateEvent: EventEmitter<AppState> = new EventEmitter<AppState>();


  // TODO: implement date check
  private static checkDate(token: Token) {
    return true;
  }

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService) {
  }

  public init(): void {
    this.stateEvent.emit(AppState.processing);
    let token: Token;
    try {
      token = plainToClass(Token, JSON.parse(localStorage.getItem('token')) as Token);
    } catch (e) {
      console.error(e.message);
    }

    if (token && InitService.checkDate(token)) {
      this.tokenService.setToken(token);
      this.stateEvent.emit(AppState.true);
    } else {
      this.reinit();
    }
  }

  public reinit(): void {
    this.stateEvent.emit(AppState.processing);
    this.tokenService.setToken(null);
    this.httpClient
      .post<ApiResponse<Token>>(InitService.createUserUri, null)
      .subscribe((apiResponse: ApiResponse<Token>) => {
        const response = plainToClassFromExist(new ApiResponse<Token>(Token), apiResponse);
        if (response.success) {
            this.tokenService.setToken(response.data);
            this.stateEvent.emit(AppState.true);
          } else {
            this.stateEvent.emit(AppState.false);
          }
        }, (error: Error) => {
          this.stateEvent.emit(AppState.false);
        }
      );
  }

  public getStateEvent(): EventEmitter<AppState> {
    return this.stateEvent;
  }
}
