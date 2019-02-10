import { Injectable, OnDestroy } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {ApiResponse} from '../entities/api-response';
import {Item} from '../entities/item';
import {AuthService} from './auth.service';
import {ItemsData} from '../entities/itemsData';
import {CreateData} from '../entities/createData';
import {HelperService} from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService implements OnDestroy {
  private static readonly readItemsUri = environment.apiServer + '/api/v1/item/read';
  private static readonly readItemsCountUrl = environment.apiServer + '/api/v1/item/count';
  private static readonly createItemUrl = environment.apiServer + '/api/v1/item/create';

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private helper: HelperService) {
  }

  public getList(date: Date, page: number = 1, count: number = 10): Observable<ApiResponse<ItemsData>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };
    const formattedDate = this.helper.formatDate(date);

    return this.httpClient.get<ApiResponse<ItemsData>>(
      `${ItemService.readItemsUri}/${formattedDate}/${page}/${count}`,
      options);
  }

  public getCount(date: Date): Observable<ApiResponse<number>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };
    const formattedDate = this.helper.formatDate(date);

    return this.httpClient.get<ApiResponse<number>>(
      `${ItemService.readItemsCountUrl}/${formattedDate}`,
      options);
  }

  public create(item: Item): Observable<ApiResponse<CreateData>> {
    const options = {
      headers: {
        'X-AUTH-TOKEN': this.authService.token.uuid
      }
    };

    return this.httpClient.post<ApiResponse<CreateData>>(
      ItemService.createItemUrl,
      item,
      options
    );
  }

  public ngOnDestroy() {
    // this.subscriptions.unsubscribe();
  }
}
