import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {ApiResponse} from '../entities/api-response';
import {Item} from '../entities/item';
import {ItemsData} from '../entities/itemsData';
import {CreateData} from '../entities/createData';
import {HelperService} from './helper.service';
import {TokenService} from './token.service';
import {ConnectionService} from './connection.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends ConnectionService {
  private static readonly itemUri = `${ConnectionService.apiPath}/item`;

  private static readonly readItemsUri = `${ItemService.itemUri}/read`;
  private static readonly readItemsCountUrl = `${ItemService.itemUri}/count`;
  private static readonly createItemUrl = `${ItemService.itemUri}/create`;
  private static readonly deleteItemUrl = `${ItemService.itemUri}/delete`;

  private createEvent: EventEmitter<Item> = new EventEmitter();
  private deleteEvent: EventEmitter<Item> = new EventEmitter();

  constructor(httpClient: HttpClient,
              tokenService: TokenService,
              private helper: HelperService) {
    super(httpClient, tokenService);
  }

  public getCreateEvent(): EventEmitter<Item> {
    return this.createEvent;
  }

  public getDeleteEvent(): EventEmitter<Item> {
    return this.deleteEvent;
  }

  public getList(date: Date, page: number = 1, count: number = 10): Observable<ApiResponse<ItemsData>> {
    const formattedDate = this.helper.formatDate(date);

    return this.httpClient.get<ApiResponse<ItemsData>>(
      `${ItemService.readItemsUri}/${formattedDate}/${page}/${count}`,
      this.options);
  }

  public getCount(date: Date): Observable<ApiResponse<number>> {
    const formattedDate = this.helper.formatDate(date);

    return this.httpClient.get<ApiResponse<number>>(
      `${ItemService.readItemsCountUrl}/${formattedDate}`,
      this.options);
  }

  public create(item: Item): Observable<ApiResponse<CreateData>> {
    return this.httpClient.post<ApiResponse<CreateData>>(
      ItemService.createItemUrl, item, this.options)
      .pipe(
        tap((created: ApiResponse<CreateData>) => {
          this.createEvent.emit(item);
        })
      );
  }

  public delete(item: Item): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(
      `${ItemService.deleteItemUrl}/${item.uuid}`, null, this.options)
      .pipe(
        tap((created: ApiResponse<null>) => {
          this.deleteEvent.emit(item);
        })
      );
  }
}
