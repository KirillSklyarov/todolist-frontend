import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {ApiResponse} from '../../entities/api-response';
import {ItemsData} from '../../entities/itemsData';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateitemComponent} from '../createitem/createitem.component';
import {EventService} from '../../services/event.service';
import {HelperService} from '../../services/helper.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  private listSubscription: Subscription;

  public date: Date = new Date();
  public page: number = 1;
  private countPerPage: number = 10;
  public items: Item[] = [];
  public activeItem: Item = null;
  private count: number = 0;

  constructor(private itemService: ItemService,
              private eventService: EventService,
              private modalService: NgbModal,
              private helper: HelperService) {
  }

  ngOnInit() {
    this.countPerPage = environment.defaultCountPerPage;
    this.eventService.createEvent.subscribe((success: boolean) => {
      if (success) {
        this.loadItems();
      }
    });

    this.loadItems();

  }

  private loadItems() {
    if (this.listSubscription) {
      this.listSubscription.unsubscribe();
    }
    this.listSubscription = this.itemService.getList(this.date, this.page, this.countPerPage)
      .subscribe((response: ApiResponse<ItemsData>) => {
          if (response.success) {
            this.activeItem = null;
            this.count = response.data.count;
            this.items = response.data.items;
            console.log(response.data);

          } else {
            // TODO Handle error
          }
        },
        err => {
          // TODO Handle error
        });

    this.subscriptions.add(this.listSubscription);
  }

  public toPage(page) {
    this.page = page;
    this.loadItems();
  }

  public stepDate(days: number) {
    this.date.setDate(this.date.getDate() + days);
    this.page = 1;
    this.loadItems();
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
