import {Component, OnInit, OnChanges, OnDestroy, Input} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {Item} from '../../entities/item';
import {ItemService} from '../../services/item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {ApiResponse} from '../../entities/api-response';
import {ItemsData} from '../../entities/itemsData';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {
  private static readonly dateFormat = 'YYYY-MM-DD';
  private readonly subscriptions: Subscription = new Subscription();
  private _date: string;
  private page: number = 1;
  private items: Item[];
  private count: number;

  public previousDate: string;
  public nextDate: string;

  @Input() set date(date: string) {
    this._date = date;
  }

  private validatePage(page: string): boolean {
    return page.search(new RegExp('^[1-9]\\d*$')) > -1;
  }

  private validateCount(count: string): boolean {
    return count.search(new RegExp('^[1-9]\\d*$')) > -1 &&
      Number(count) <= environment.maxCountPerPage;
  }

  private getPage(page: string): number {
    if (page === undefined) {
      return 1;
    } else if (this.validatePage(page)) {
      return Number(page);
    }

    throw new Error();
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService,
              private authService: AuthService) {
  }

  ngOnInit() {
    const parameterSub = this.route.params.subscribe(params => {
      try {
        this.page = this.getPage(params['page']);
      } catch (e) {
        this.router.navigate([this._date]);
        return;
      }
    });
    this.subscriptions.add(parameterSub);
  }

  ngOnChanges() {
    const listSubscription = this.itemService.getList(this._date, this.page)
      .subscribe((response: ApiResponse<ItemsData>) => {
        if (response.success) {
          this.count = response.data.count;
          this.items = response.data.items;
          // TODO generate paginator
          if (this.page > 1) {
            if (this.count > 0) {
              if (this.page * environment.defaultCountPerPage - this.count < environment.defaultCountPerPage) {

              } else {
                const lastPage = Math.ceil(this.count / environment.defaultCountPerPage);
                this.router.navigate([`${this._date}/${lastPage}`]);
              }
            } else {
              this.router.navigate([`${this._date}`]);
            }
          }
        } else {
          // TODO Handle error
        }
      });


    this.previousDate = moment(this._date, ListComponent.dateFormat)
      .subtract(1, 'days').format(ListComponent.dateFormat);
    this.nextDate = moment(this._date, ListComponent.dateFormat)
      .add(1, 'days').format(ListComponent.dateFormat);

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public toDate(date: string) {
    this.router.navigate([date]);
  }
}
