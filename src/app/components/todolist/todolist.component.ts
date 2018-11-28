import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  public date: string;
  public previousDate: string;
  public nextDate: string;


  private validateDate(date: string): boolean {
    return date.search(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')) > -1 &&
      !isNaN((new Date(date)).getMilliseconds());
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    const parameterSub = this.route.params.subscribe(params => {
      try {
        this.date = this.getDate(params['date']);
      } catch (e) {
        this.router.navigate(['']);
        return;
      }
    });
    this.subscriptions.add(parameterSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
