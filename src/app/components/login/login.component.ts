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
          console.log(response);
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
          console.error(error);
        });

    this.subscriptions.add(subscription);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
