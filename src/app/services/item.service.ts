import { Injectable, OnDestroy } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs/internal/Subscription';

import {environment} from '../../environments/environment';
import {ApiResponse} from '../entities/api-response';
import {Item} from '../entities/item';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {ItemsData} from '../entities/itemsData';
import {CreateData} from '../entities/createData';

@Injectable({
  providedIn: 'root'
})
export class ItemService implements OnDestroy {
  private readonly readItemsUri = environment.apiServer + '/api/v1/item/read';
  private readonly readItemsCountUrl = environment.apiServer + '/api/v1/item/count';
  private readonly createItemUrl = environment.apiServer + '/api/v1/item/create';

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

  getList(date: string, page: number = 1, count: number = 10): Observable<ApiResponse<ItemsData>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };

    return this.httpClient.get<ApiResponse<ItemsData>>(
      `${this.readItemsUri}/${date}/${page}/${count}`,
      options);
  }

  getCount(date: string): Observable<ApiResponse<number>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };

    return this.httpClient.get<ApiResponse<number>>(
      `${this.readItemsCountUrl}/${date}`,
      options);
  }

  create(item: Item): Observable<ApiResponse<CreateData>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };

    return this.httpClient.post<ApiResponse<CreateData>>(
      this.createItemUrl,
      item,
      options
    );
  }
  ngOnDestroy() {
    // this.subscriptions.unsubscribe();
  }
}
