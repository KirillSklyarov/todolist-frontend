import { Injectable, OnDestroy } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs/internal/Subscription';

import {environment} from '../../environments/environment';
import {ApiResponse} from '../entities/api-response';
import {Item} from '../entities/item';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService implements OnDestroy {
  // private readonly subscriptions: Subscription = new Subscription();
  private readonly readItemsUri = environment.apiServer + '/api/v1/item/read';

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

  getList(date: string, page: number = 1, count: number = 10): Observable<ApiResponse<Item[]>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };

    return this.httpClient.get<ApiResponse<Item[]>>(this.readItemsUri, options);
  }

  ngOnDestroy() {
    // this.subscriptions.unsubscribe();
  }
}
