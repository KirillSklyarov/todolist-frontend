import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  private date: string;

  public parametersValid = false;

  private static validateDate(date: string): boolean {
    return date.search(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')) > -1 &&
      !isNaN((new Date(date)).getMilliseconds());
  }

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
              private router: Router) {
  }

  ngOnInit() {
    const parameterSub = this.route.params.subscribe(params => {
      try {
        this.date = TodolistComponent.getDate(params['date']);
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
