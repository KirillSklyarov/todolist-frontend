import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserComponent} from '../user/user.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/api-response';
import {Token} from '../../entities/token';
import {Alert, Type} from '../../entities/alert';
import {TokenService} from '../../services/token.service';
import {ConfirmComponent} from '../modal/confirm.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends ConfirmComponent implements OnInit, OnDestroy {
  @Input() public token: Token;

  constructor(activeModal: NgbActiveModal,
              private userService: UserService,
              private tokenService: TokenService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.mainAlert.type = Type.danger;
    this.token = this.tokenService.getToken();
    if (this.token) {
      this.setMainAlert();
    }
  }

  public yes(): void {
    this.processing = true;
    const subscription = this.userService.logout()
      .subscribe((response: ApiResponse<Token>) => {
          this.processing = false;
          if (response.success) {

            this.activeModal.close();
          } else {
            this.alerts.push(new Alert(Type.danger, 'Error'));
          }
        },
        error => {
          this.alerts.push(new Alert(Type.danger, 'Error'));

          this.processing = false;
        });

    this.subscriptions.add(subscription);
  }

  private setMainAlert() {
    this.mainAlert.message = this.token && this.token.user.isPermanent ?
      'Are you sure to log out?' :
      'Are you sure to purge todolist';
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
