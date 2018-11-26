import {Component, OnInit, OnChanges, OnDestroy, Input} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {Item} from '../../entities/item';
import {ItemService} from '../../services/item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  private items: Item[];
  private _date: string;
  @Input() set date(date: string) {
    this._date = date;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('--------------------');
    console.log('ListComponent');
    console.log(this._date);
    console.log('--------------------');
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
