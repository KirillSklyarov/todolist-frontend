import { OnInit } from '@angular/core';
import {ConnectionComponent} from '../connection/connection.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';

export class UserComponent extends ConnectionComponent implements OnInit {
  public username: string = '';
  public password: string = '';

  constructor(activeModal: NgbActiveModal,
              protected userService: UserService) {
    super(activeModal);
  }

  public ngOnInit(): void {
  }

}
