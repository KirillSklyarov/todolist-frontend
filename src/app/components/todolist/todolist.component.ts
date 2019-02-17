import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApiResponse} from '../../entities/api-response';
import {ItemsData} from '../../entities/itemsData';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {NgbCalendar, NgbDate, NgbDatepicker, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateitemComponent} from '../createitem/createitem.component';
import {HelperService} from '../../services/helper.service';
import {TokenService} from '../../services/token.service';
import {Token} from '../../entities/token';
import {DeleteComponent} from '../delete/delete.component';
import {TodolistState} from '../../entities/todolistState';
import {InitService} from '../../services/init.service';
import {AppState} from '../../entities/appState';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();

  @ViewChild('dp') public dp: NgbDatepicker;
  private countPerPage: number = 10;
  private count: number = 0;
  private token: Token;

  public date: Date = new Date();
  public page: number = 1;
  public items: Item[] = [];
  public activeItem: Item = null;
  public TodolistState;
  public state: TodolistState = TodolistState.processing;
  ngbDate: NgbDateStruct;

  constructor(private itemService: ItemService,
              private modalService: NgbModal,
              private tokenService: TokenService,
              private initService: InitService,
              private helper: HelperService,
              private calendar: NgbCalendar) {
    this.TodolistState = TodolistState;

  }

  public ngOnInit(): void {
    this.state = TodolistState.processing;
    this.ngbDate = {
      day: this.date.getDate(),
      month: this.date.getMonth() + 1,
      year: this.date.getFullYear(),
    };

    this.countPerPage = environment.defaultCountPerPage;
    this.token = this.tokenService.getToken();
    const tokenSubscription = this.tokenService.getUpdateEvent()
      .subscribe((token: Token) => {
        if (token) {
          if (this.token.user.uuid !== token.user.uuid) {
            // TODO Update items
            this.loadItems();
          }
          this.token = token;
        }
      });

    const createSubscription = this.itemService.getCreateEvent()
      .subscribe((item: Item) => {
        this.loadItems();
      });
    const deleteSubscription = this.itemService.getDeleteEvent()
      .subscribe((item: Item) => {
        this.loadItems();
      });
    this.subscriptions.add(tokenSubscription);
    this.subscriptions.add(createSubscription);
    this.subscriptions.add(deleteSubscription);
    this.loadItems();
  }

  public loadItems() {
    this.state = TodolistState.processing;
    this.activeItem = null;
    const listSubscription = this.itemService.getList(this.date, this.page, this.countPerPage)
      .subscribe((response: ApiResponse<ItemsData>) => {
          if (response.success) {
            this.state = TodolistState.success;
            this.count = response.data.count;
            this.items = response.data.items;
          } else {
            this.state = TodolistState.serverError;
            // TODO Handle error
            console.log(response);
          }
        },
        response => {
          if (response.status === 401) {
            this.state = TodolistState.authError;
          } else {
            this.state = TodolistState.serverError;
          }
        });

    this.subscriptions.add(listSubscription);
  }

  public reinit(): void {
    this.initService.reinit();
  }

  public toPage(page): void {
    this.page = page;
    this.loadItems();
  }

  public stepDate(days: number): void {
    this.date.setDate(this.date.getDate() + days);
    this.page = 1;
    this.navigateTo(this.date);
    this.loadItems();
  }

  private setDate(date: Date): void {
    this.date = date;
  }

  private navigateTo(date: Date): void {
    this.ngbDate = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };

    this.dp.navigateTo({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }

  public selectDate(date: NgbDate): void {
    this.date.setDate(date.day);
    this.date.setMonth(date.month - 1);
    this.date.setFullYear(date.year);
    this.page = 1;
    this.loadItems();
  }

  public openCreate(): void {
    const modalRef = this.modalService.open(CreateitemComponent);
    modalRef.componentInstance.date = this.helper.formatDate(this.date);
  }

  public selectItem(item: Item, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'LI') {
      this.activeItem = item;
    }
  }

  public openDelete(item: Item): void {
    const modalRef = this.modalService.open(DeleteComponent);
    modalRef.componentInstance.item = item;
  }

  public getLastPage(): number {
    return Math.ceil(this.count / this.countPerPage);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
