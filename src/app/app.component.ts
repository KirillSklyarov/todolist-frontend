import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {InitService} from './services/init.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from './components/register/register.component';
import {TokenService} from './services/token.service';
import {Token} from './entities/token';
import {LoginComponent} from './components/login/login.component';
import {LogoutComponent} from './components/logout/logout.component';
import {AppState} from './entities/appState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public state: AppState = AppState.false;
  public token: Token;
  public initError: boolean = false;
  public State;

  @ViewChild('panel') public panel: ElementRef;
  @ViewChild('tabsetWrapper') public tabsetWrapper: ElementRef;

  constructor(private initService: InitService,
              private tokenService: TokenService,
              private modalService: NgbModal) {
    this.State = AppState;
  }

  public ngOnInit(): void {
    const tokenSubscription = this.tokenService.getUpdateEvent()
      .subscribe((token: Token) => {
        this.token = token;
      });

    const initSubscription = this.initService.getStateEvent()
      .subscribe((state: AppState) => {
        this.state = state;
      });
    this.subscriptions.add(tokenSubscription);
    this.subscriptions.add(initSubscription);
    this.initService.init();
  }

  public ngAfterViewInit(): void {
    const ulTablist = this.tabsetWrapper.nativeElement.firstChild.firstChild;
    ulTablist.appendChild(this.panel.nativeElement);
    this.panel.nativeElement.classList.remove('hidden');
  }

  public openRegister(): void {
    const modalRef = this.modalService.open(RegisterComponent);
  }

  public openLogin(): void {
    const modalRef = this.modalService.open(LoginComponent);
  }

  public openLogout(): void {
    const modalRef = this.modalService.open(LogoutComponent);
    modalRef.componentInstance.token = this.token;
  }

  public reinit(): void {
    this.initError = false;
    this.initService.reinit();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
