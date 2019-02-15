import {OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {Alert} from '../../entities/alert';
import {Subscription} from 'rxjs';

export class ModalComponent implements OnInit, OnDestroy {
  protected readonly subscriptions: Subscription = new Subscription();

  public processing: boolean = false;
  public alerts: Alert[] = [];


  constructor(protected activeModal: NgbActiveModal) {
  }

  public ngOnInit(): void {
    document.body.style['padding-right'] = '0';
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
