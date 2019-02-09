import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {InitService} from './services/init.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public isInitialized = false;
  public activeRoute: string;

  // @ViewChild('tabset') public tabset: NgbTabset;

  constructor(private initService: InitService) {

  }

  ngOnInit() {
    const initServiceSubscription = this.initService.getResult().subscribe((result: boolean) => {
      this.isInitialized = result;
    });

    this.subscriptions.add(initServiceSubscription);
    this.initService.init();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateTo(path: string) {
    console.log('path: ' + path);
  }

  tabClick() {
    console.log('tab click');
  }
}
