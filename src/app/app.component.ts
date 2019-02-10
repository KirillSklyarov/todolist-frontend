import {Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterContentInit, AfterViewInit} from '@angular/core';
import {InitService} from './services/init.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {CreateitemComponent} from './components/createitem/createitem.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from './components/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public isInitialized = false;

  @ViewChild('panel') public panel: ElementRef;
  @ViewChild('tabsetWrapper') public tabsetWrapper: ElementRef;

  constructor(private initService: InitService,
              private modalService: NgbModal,
  ) {

  }

  public ngOnInit(): void {
    const initServiceSubscription = this.initService.getResult().subscribe((result: boolean) => {
      this.isInitialized = result;

    });

    this.subscriptions.add(initServiceSubscription);
    this.initService.init();
  }

  public ngAfterViewInit(): void {
    const ulTablist = this.tabsetWrapper.nativeElement.firstChild.firstChild;
    ulTablist.appendChild(this.panel.nativeElement);
    this.panel.nativeElement.classList.remove('hidden');
  }


  public openRegister() {
    const modalRef = this.modalService.open(RegisterComponent);

    console.log('Open register');
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
