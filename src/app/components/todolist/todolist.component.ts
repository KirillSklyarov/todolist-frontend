import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApiResponse} from '../../entities/api-response';
import {ItemsData} from '../../entities/itemsData';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateitemComponent} from '../createitem/createitem.component';
import {EventService} from '../../services/event.service';
import {HelperService} from '../../services/helper.service';
import {TokenService} from '../../services/token.service';
import {Token} from '../../entities/token';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();

  public date: Date = new Date();
  public page: number = 1;
  public items: Item[] = [];
  public activeItem: Item = null;

  private countPerPage: number = 10;
  private count: number = 0;
  private token: Token;

  constructor(private itemService: ItemService,
              private eventService: EventService,
              private modalService: NgbModal,
              private tokenService: TokenService,
              private helper: HelperService) {
  }

  public ngOnInit(): void {
    this.countPerPage = environment.defaultCountPerPage;
    this.token = this.tokenService.getToken();
    const tokenSubscription = this.tokenService.getUpdateEvent()
      .subscribe((token: Token) => {
        if (this.token.user.uuid !== token.user.uuid) {
          // TODO Update items
          this.loadItems(this.date, 1, this.countPerPage);
        }
        this.token = token;
      });
    const eventSubscription = this.eventService.getCreateEvent()
      .subscribe((success: boolean) => {
      if (success) {
        console.log('event!');
        this.loadItems(this.date, this.page, this.countPerPage);
      }
    });

    this.subscriptions.add(tokenSubscription);
    this.subscriptions.add(eventSubscription);
    this.loadItems(this.date, this.page, this.countPerPage);

  }

  private loadItems(date: Date, page: number, countPerPage: number) {
    const listSubscription = this.itemService.getList(this.date, this.page, this.countPerPage)
      .subscribe((response: ApiResponse<ItemsData>) => {
          if (response.success) {
            this.activeItem = null;
            this.count = response.data.count;
            this.items = response.data.items;
            this.page = page;
          } else {
            // TODO Handle error
          }
        },
        err => {
          // TODO Handle error
        });

    this.subscriptions.add(listSubscription);
  }

  public toPage(page) {
    this.loadItems(this.date, page, this.countPerPage);
  }

  public stepDate(days: number) {
    this.date.setDate(this.date.getDate() + days);
    this.loadItems(this.date, 1, this.countPerPage);
    // console.log(this.date);
  }

  public openCreate() {
    const modalRef = this.modalService.open(CreateitemComponent);
    modalRef.componentInstance.formattedDate = this.helper.formatDate(this.date);
  }

  public getLastPage(): number {
    return Math.ceil(this.count / this.countPerPage);
  }


  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
