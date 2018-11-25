import {Component, OnInit, OnDestroy} from '@angular/core';
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
export class ListComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  private items: Item[];
  private date: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService,
              private authService: AuthService) {
  }

  ngOnInit() {



    // const subscription = this.itemService.getList()
    //     .subscribe((items: Item[]) => {
    //
    //     });

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
