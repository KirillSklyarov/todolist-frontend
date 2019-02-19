import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {Token} from '../entities/token';

export class ConnectionService {
  protected static readonly apiPath: string = `${environment.apiServer}api/v1`;
  protected options = {
    headers: {
      'X-AUTH-TOKEN': ''
    }
  };

  constructor(protected httpClient: HttpClient,
              protected tokenService: TokenService
              ) {
    this.options.headers['X-AUTH-TOKEN'] = this.tokenService.getToken().uuid;
    this.tokenService.getUpdateEvent()
      .subscribe((token: Token) => {
        if (token) {
          this.options.headers['X-AUTH-TOKEN'] = token.uuid;
        }
      });
  }
}
