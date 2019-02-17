import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/api-response';
import {Token} from '../../entities/token';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, Type} from '../../entities/alert';
import {UserComponent} from '../user/user.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends UserComponent implements OnInit, OnDestroy {
  @ViewChild('button') public button: ElementRef;

  constructor(activeModal: NgbActiveModal,
              userService: UserService) {
    super(activeModal, userService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public login(): void {
    if (!this.processing) {
      this.processing = true;
      this.alerts = [];
      const subscription = this.userService.login(this.username, this.password)
        .subscribe((response: ApiResponse<Token>) => {
          this.processing = false;
          if (response.success) {
            this.activeModal.close();
          } else {
            this.alerts.push(new Alert(Type.danger, response.error.message));
          }
        }, (response) => {
          console.log(response);
          this.processing = false;
          let message: string;
          if (response.status > 0) {
            if (response.error.error && response.error.error.message) {
              message = response.error.error.message;
            } else {
              switch (response.status) {
                case 400:
                  message = environment.errors.input;
                  break;
                case 401:
                  message = environment.errors.auth;
                  break;
                default:
                  message = environment.errors.server;
                  break;
              }
            }
          } else {
            message = environment.errors.connection;
          }
          this.alerts.push(new Alert(Type.danger, message));
        });

      this.subscriptions.add(subscription);
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
