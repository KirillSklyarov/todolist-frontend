import {Component, Input, OnInit} from '@angular/core';
import {UserComponent} from '../user/user.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/api-response';
import {Token} from '../../entities/token';
import {Alert, Type} from '../../entities/alert';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends UserComponent implements OnInit {
  @Input() public token: Token;
  public mainAlert: Alert = new Alert();

  constructor(activeModal: NgbActiveModal,
              userService: UserService,
              private tokenService: TokenService) {
    super(activeModal, userService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.token = this.tokenService.getToken();
    if (this.token) {
      this.setMainAlert();
    }
  }

  public yes() {
    const subscription = this.userService.logout()
      .subscribe((response: ApiResponse<Token>) => {
          console.log(response);
          this.processing = false;
          if (response.success) {
            this.alerts.push(new Alert(Type.primary, 'Success log out!'));
            setTimeout(() => {
              this.activeModal.close();
            }, 2500);
          } else {

          }
        },
        error => {
          this.processing = false;
          console.error(error);
        });

    this.subscriptions.add(subscription);
  }

  public no() {
    this.activeModal.close();
  }

  private setMainAlert() {
    this.mainAlert.message = this.token && this.token.user.isPermanent ?
      'Are you sure to log out?' :
      'Are you sure to purge todolist';
  }
}
