import { OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {Alert} from '../../entities/alert';

export class ConnectionComponent implements OnInit {
  public processing: boolean = false;
  public alerts: Alert[] = [];

  constructor(protected activeModal: NgbActiveModal) {
    console.log('ConnectionComponent constructor');
  }

  public ngOnInit(): void {
  }

}
