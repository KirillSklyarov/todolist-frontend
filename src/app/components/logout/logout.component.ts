import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../entities/api-response';
import {Token} from '../../entities/token';
import {Type} from '../../entities/alert';
import {TokenService} from '../../services/token.service';
import {ConfirmComponent} from '../modal/confirm.component';
import {InitService} from '../../services/init.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends ConfirmComponent implements OnInit, OnDestroy {
  @Input() public token: Token;
  public isLogoutError: boolean = false;

  constructor(activeModal: NgbActiveModal,
              private userService: UserService,
              private tokenService: TokenService,
              private initService: InitService) {
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
    super.yes();
    if (this.isLogoutError) {
      this.initService.reinit();
      this.activeModal.close();
    } else {
      this.processing = true;
      const subscription = this.userService.logout()
        .subscribe((response: ApiResponse<Token>) => {
          this.processing = false;
          if (response.success) {
            this.initService.reinit();
            this.activeModal.close();
          } else {
            this.setError();
          }
        }, response => {
          this.processing = false;
          if (response.status === 401) {
            this.initService.reinit();
            this.activeModal.close();
            return;
          }

          this.setError();
        });

      this.subscriptions.add(subscription);
    }
    this.isLogoutError = false;
  }

  public no(): void {
    this.isLogoutError = false;
    super.no();
  }

  private setMainAlert(): void {
    this.mainAlert.message = this.token && this.token.user.isPermanent ?
      'Are you sure to log out?' :
      'Are you sure to purge todolist';
  }

  private setError(): void {
    this.isLogoutError = true;
    this.mainAlert.message = 'Server error. Clear data only in browser?';
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
