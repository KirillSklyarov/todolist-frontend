import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {ApiResponse} from '../../entities/api-response';
import {ItemsData} from '../../entities/itemsData';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CreateitemComponent} from '../createitem/createitem.component';
import {EventService} from '../../services/event.service';

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
  private countPerPage: number;
  public items: Item[] = [];
  public activeItem: Item = null;
  private count: number;
  
  public previousDate: string;
  public nextDate: string;

  constructor(private itemService: ItemService,
              private eventService: EventService,
              private modalService: NgbModal) {
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
          this.count = response.data.count;
          this.items = response.data.items;

          if (this.page > 1) {
            if (this.count > 0) {
              if (this.page * this.countPerPage - this.count >= this.countPerPage) {
                const lastPage = this.getLastPage();
              }
            } else {
            }
          }

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
    this.activeItem = null;
  }

  public openCreate() {
    const modalRef = this.modalService.open(CreateitemComponent);
    console.log(this.date);
    modalRef.componentInstance.date = this.date;
  }

  public getLastPage(): number {
    return Math.ceil(this.count / this.countPerPage);
  }


  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
