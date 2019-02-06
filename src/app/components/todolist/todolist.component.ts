import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {ApiResponse} from '../../entities/api-response';
import {ItemsData} from '../../entities/itemsData';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {Paginator} from '../../models/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CreateitemComponent} from '../createitem/createitem.component';
import {EventService} from '../../services/event.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit, OnDestroy {
  private static readonly dateFormat = 'YYYY-MM-DD';
  private static readonly defaultPaginator: Paginator[] = [
    {
      page: 1,
      name: '<',
      enabled: false,
      active: false
    },
    {
      page: null,
      name: '_',
      enabled: false,
      active: false
    },
    {
      page: null,
      name: '_',
      enabled: false,
      active: false
    },
    {
      page: 1,
      name: '1',
      enabled: true,
      active: true
    },
    {
      page: null,
      name: '_',
      enabled: false,
      active: false
    },
    {
      page: null,
      name: '_',
      enabled: false,
      active: false
    },
    {
      page: 1,
      name: '>',
      enabled: false,
      active: false
    }
  ];
  private readonly subscriptions: Subscription = new Subscription();
  private listSubscription: Subscription;

  public date: string;
  private page: number = 1;
  public items: Item[];
  public paginators: Paginator[];
  private count: number;
  
  public previousDate: string;
  public nextDate: string;

  public description: string;

  private validateDate(date: string): boolean {
    return date.search(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')) > -1 &&
      !isNaN((new Date(date)).getMilliseconds());
  }


  private validatePage(page: string): boolean {
    return page.search(new RegExp('^[1-9]\\d*$')) > -1;
  }

  private validateCount(count: string): boolean {
    return count.search(new RegExp('^[1-9]\\d*$')) > -1 &&
      Number(count) <= environment.maxCountPerPage;
  }

  private getDate(date: string): string {
    if (date === undefined) {
      const today = new Date();
      const year = today.getFullYear().toString();
      let month = (today.getMonth() + 1).toString();
      if (month.length === 1) {
        month = '0' + month;
      }
      let day = (today.getDate()).toString();
      if (day.length === 1) {
        day = '0' + day;
      }
      return `${year}-${month}-${day}`;
    } else if (this.validateDate(date)) {
      return date;
    }

    throw new Error();
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
              private location: Location,
              private itemService: ItemService,
              private eventService: EventService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.eventService.createEvent.subscribe((success: boolean) => {
      if (success) {
        this.loadItems();
      }
    });
    const parameterSub = this.route.params.subscribe(params => {
      try {
        this.paginators = null;
        this.date = this.getDate(params['date']);
        this.previousDate = moment(this.date, TodolistComponent.dateFormat)
          .subtract(1, 'days').format(TodolistComponent.dateFormat);
        this.nextDate = moment(this.date, TodolistComponent.dateFormat)
          .add(1, 'days').format(TodolistComponent.dateFormat);
      } catch (e) {
        this.router.navigate(['']);
        return;
      }

      try {
        this.page = this.getPage(params['page']);
        this.loadItems();
      } catch (e) {
        this.router.navigate([this.date]);
        return;
      }
    });
    this.subscriptions.add(parameterSub);
  }

  private loadItems() {
    if (this.listSubscription) {
      this.listSubscription.unsubscribe();
    }
    this.listSubscription = this.itemService.getList(this.date, this.page, environment.defaultCountPerPage)
      .subscribe((response: ApiResponse<ItemsData>) => {
        if (response.success) {
          this.count = response.data.count;
          this.items = response.data.items;
          this.generatePaginator();

          // TODO generate paginator
          if (this.page > 1) {
            if (this.count > 0) {
              if (this.page * environment.defaultCountPerPage - this.count >= environment.defaultCountPerPage) {
                const lastPage = this.getLastPage();
                this.router.navigate([`${this.date}/${lastPage}`]);
              }
            } else {
              this.router.navigate([`${this.date}`]);
            }
          }

          this.generatePaginator();
        } else {
          // TODO Handle error
        }
      },
        err => {
          // TODO Handle error
        });

    this.subscriptions.add(this.listSubscription);
  }

  public toDate(date: string) {
    this.description = null;
    this.router.navigate([date]);
  }

  public openCreate() {
    const modalRef = this.modalService.open(CreateitemComponent);
    console.log(this.date);
    modalRef.componentInstance.date = this.date;
  }

  private generatePaginator() {
    const paginator: Paginator[] = TodolistComponent.defaultPaginator;

    if (this.count > 0) {
      const lastPage = this.getLastPage();

      if (this.page > 1) {
        paginator[0].enabled = true;
      }

      if (this.page > 2) {
        paginator[1].page = this.page - 2;
        paginator[1].name = (this.page - 2).toString();
        paginator[1].enabled = true;
      }

      if (this.page > 1) {
        paginator[2].page = this.page - 1;
        paginator[2].name = (this.page - 1).toString();
        paginator[2].enabled = true;
      }

      paginator[3].page = this.page;
      paginator[3].name = (this.page).toString();
      paginator[3].active = true;

      if (this.page <= lastPage - 1) {
        paginator[4].page = this.page + 1;
        paginator[4].name = (this.page + 1).toString();
        paginator[4].enabled = true;
      }

      if (this.page <= lastPage - 2) {
        paginator[5].page = this.page + 2;
        paginator[5].name = (this.page + 2).toString();
        paginator[5].enabled = true;
      }

      if (this.page < lastPage) {
        paginator[6].page = this.page;
        paginator[6].enabled = true;
      }

      this.paginators = paginator;
    } else {
      this.paginators = null;
    }

  }

  private getLastPage(): number {
    return Math.ceil(this.count / environment.defaultCountPerPage);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
