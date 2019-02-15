import {Component, OnInit} from '@angular/core';
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
export class LoginComponent extends UserComponent implements OnInit {
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
          console.log(response);
          this.processing = false;
          if (response.success) {
            this.alerts.push(new Alert(Type.primary, 'Success log in!'));
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
}
