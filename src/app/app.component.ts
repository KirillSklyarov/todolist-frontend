import {Component, OnInit, OnDestroy, ViewChild, ElementRef,
  AfterViewInit, ViewEncapsulation } from '@angular/core';
import {InitService} from './services/init.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {CreateitemComponent} from './components/createitem/createitem.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from './components/register/register.component';
import {TokenService} from './services/token.service';
import {Token} from './entities/token';
import {LoginComponent} from './components/login/login.component';
import {LogoutComponent} from './components/logout/logout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public token: Token;

  @ViewChild('panel') public panel: ElementRef;
  @ViewChild('tabsetWrapper') public tabsetWrapper: ElementRef;

  constructor(private initService: InitService,
              private tokenService: TokenService,
              private modalService: NgbModal) {
  }

  public ngOnInit(): void {
    const tokenSubscription = this.tokenService.getUpdateEvent()
      .subscribe((token: Token) => {
        this.token = token;
      });

    this.subscriptions.add(tokenSubscription);
    this.initService.init();
  }

  public ngAfterViewInit(): void {
    const ulTablist = this.tabsetWrapper.nativeElement.firstChild.firstChild;
    ulTablist.appendChild(this.panel.nativeElement);
    this.panel.nativeElement.classList.remove('hidden');
  }

  public openRegister() {
    const modalRef = this.modalService.open(RegisterComponent);
  }

  public openLogin() {
    const modalRef = this.modalService.open(LoginComponent);
  }

  public openLogout() {
    const modalRef = this.modalService.open(LogoutComponent);
    modalRef.componentInstance.token = this.token;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
