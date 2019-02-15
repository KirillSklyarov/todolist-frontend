import {OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {Alert} from '../../entities/alert';
import {Subscription} from 'rxjs';
import {ModalComponent} from './modal.component';

export abstract class ConfirmComponent extends ModalComponent
  implements OnInit, OnDestroy {
  protected readonly subscriptions: Subscription = new Subscription();
  public mainAlert: Alert = new Alert();

  constructor(activeModal: NgbActiveModal) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public abstract yes(): void;

  public no(): void {
    this.activeModal.close();
  }
}
