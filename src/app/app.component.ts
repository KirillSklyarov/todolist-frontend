import {Component, OnInit, OnDestroy} from '@angular/core';
import {InitService} from './services/init.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public isInitialized = false;
  private subscriptions: Subscription = new Subscription();
  constructor(private initService: InitService) {

  }

  ngOnInit() {
    let subscription: Subscription;
    subscription = this.initService.getResult().subscribe((result: boolean) => {
      console.log(result);
      this.isInitialized = result;
    });
    this.subscriptions.add(subscription);
    this.initService.init();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
