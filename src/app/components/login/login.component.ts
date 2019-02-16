import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/api-response';
import {Token} from '../../entities/token';
import {TokenService} from '../../services/token.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, Type} from '../../entities/alert';
import {UserComponent} from '../user/user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends UserComponent implements OnInit, OnDestroy {
  private static readonly connectionError = 'Connection error. Try again later';
  private static readonly authError = 'Wrong login or password';
  private static readonly serverError = 'Server error. Try again later';
  @ViewChild('button') public button: ElementRef;

  constructor(activeModal: NgbActiveModal,
              userService: UserService) {
    super(activeModal, userService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public login(): void {
    this.alerts = [];
    this.processing = true;
    const subscription = this.userService.login(this.username, this.password)
      .subscribe((response: ApiResponse<Token>) => {
        this.processing = false;
        if (response.success) {
          this.activeModal.close();
        } else {
          this.alerts.push(new Alert(Type.danger, LoginComponent.serverError));
        }
      }, (error) => {
        console.log(error);
        this.processing = false;
        switch (error.status) {
          case 0:
            this.alerts.push(new Alert(Type.danger, LoginComponent.connectionError));
            break;
          case 401:
            this.alerts.push(new Alert(Type.danger, LoginComponent.authError));
            break;
          default:
            this.alerts.push(new Alert(Type.danger, LoginComponent.serverError));
            break;
        }
      });

    this.subscriptions.add(subscription);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
