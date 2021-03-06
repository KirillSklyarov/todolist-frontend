import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/api-response';
import {Token} from '../../entities/token';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, Type} from '../../entities/alert';
import {UserComponent} from '../user/user.component';
import {messages} from '../../messages';
import {InitService} from '../../services/init.service';
import {plainToClassFromExist} from 'class-transformer';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends UserComponent implements OnInit, OnDestroy {
  public requiredInit: boolean = false;

  constructor(activeModal: NgbActiveModal,
              userService: UserService,
              private initService: InitService) {
    super(activeModal, userService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  // TODO: implement search logins
  public register(): void {
    if (!this.processing) {
      this.alerts = [];
      this.processing = true;
      const subscription = this.userService.register(this.username, this.password)
        .subscribe((apiResponse: ApiResponse<Token>) => {
          const response = plainToClassFromExist(new ApiResponse<Token>(Token), apiResponse);
          this.processing = false;
          if (response.success) {
            this.activeModal.close();
          } else {
            this.alerts.push(new Alert(Type.danger, response.error.message));
          }
        }, response => {
          console.error(response);
          let message: string;
          this.processing = false;
          if (response.status > 0) {
            if (response.error.error && response.error.error.message) {
              message = response.error.error.message;
            } else {
              switch (response.status) {
                case 400:
                  message = messages.errors.input;
                  break;
                case 401:
                  message = messages.errors.token;
                  break;
                default:
                  message = messages.errors.server;
                  break;
              }
            }
          } else {
            message = messages.errors.connection;
          }
          this.alerts.push(new Alert(Type.danger, message));
          if (response.status === 401) {
            this.requiredInit = true;
            this.alerts.push(new Alert(Type.danger, 'Reinitialization is required'));
          }
        });

      this.subscriptions.add(subscription);
    }
  }

  public reinit(): void {
    this.requiredInit = false;
    this.initService.reinit();
    this.activeModal.close();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
