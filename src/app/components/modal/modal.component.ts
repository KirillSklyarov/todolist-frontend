import {OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {Alert, Type} from '../../entities/alert';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

export class ModalComponent implements OnInit, OnDestroy {
  protected readonly subscriptions: Subscription = new Subscription();

  public processing: boolean = false;
  public alerts: Alert[] = [];

  constructor(protected activeModal: NgbActiveModal) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
