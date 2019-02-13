import { OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {Alert} from '../../entities/alert';

export class ModalComponent implements OnInit {
  public processing: boolean = false;
  public alerts: Alert[] = [];

  constructor(protected activeModal: NgbActiveModal) {
  }

  public ngOnInit(): void {
  }

}
