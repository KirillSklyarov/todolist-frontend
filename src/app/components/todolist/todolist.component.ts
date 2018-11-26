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
  private static readonly dateFormat = 'YYYY-MM-DD';
  private readonly subscriptions: Subscription = new Subscription();
  public previousDate: string;
  public date: string;
  public nextDate: string;


  private static validateDate(date: string): boolean {
    return date.search(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')) > -1 &&
      !isNaN((new Date(date)).getMilliseconds());
  }

  // TODO Move to ListComponent
  private static validateCount(count: string): boolean {
    return count.search(new RegExp('^[1-9]\\d*$')) > -1 &&
      Number(count) <= environment.maxCount;
  }

  private static getDate(date: string): string {
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
    } else if (TodolistComponent.validateDate(date)) {
      return date;
    } else {
      throw new Error();
    }
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    const parameterSub = this.route.params.subscribe(params => {
      try {
        this.date = TodolistComponent.getDate(params['date']);
        this.previousDate = moment(this.date, TodolistComponent.dateFormat)
          .subtract(1, 'days').format(TodolistComponent.dateFormat);
        this.nextDate = moment(this.date, TodolistComponent.dateFormat)
          .add(1, 'days').format(TodolistComponent.dateFormat);

        // console.log('=========================');
        // console.log(this.previousDate);
        // console.log('[' + this.date + ']');
        // console.log(this.nextDate);

      } catch (e) {
        this.router.navigate(['']);
        return;
      }
    });
    this.subscriptions.add(parameterSub);
  }

  public toDate(date: string) {
    // const url = this
    //   .router
    //   .createUrlTree([{date: date}])
    //   .toString();
    this.router.navigate([date]);
    // this.location.go(url);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
