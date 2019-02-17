import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {ApiResponse} from '../../entities/api-response';
import {CreateData} from '../../entities/createData';
import {ModalComponent} from '../modal/modal.component';
import {Alert, Type} from '../../entities/alert';
import {environment} from '../../../environments/environment';
import {InitService} from '../../services/init.service';

@Component({
  selector: 'app-createitem',
  templateUrl: './createitem.component.html',
  styleUrls: ['./createitem.component.css']
})
export class CreateitemComponent extends ModalComponent implements OnInit {
  @Input() public date: string;
  public title: string;
  public description: string;
  public requiredInit: boolean = false;

  constructor(activeModal: NgbActiveModal,
              private itemService: ItemService,
              private initService: InitService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public create() {
    if (!this.processing) {
      this.processing = true;
      this.alerts = [];

      const item = new Item();
      item.title = this.title;
      item.description = this.description;
      item.date = this.date;

      const subscription = this.itemService.create(item).subscribe(
        (response: ApiResponse<CreateData>) => {
          this.processing = false;
          // TODO refactor
          if (response.success) {
            this.activeModal.close();


          } else {
            this.processing = false;
            this.alerts.push(new Alert(Type.danger, response.error.message));
          }

        },
        response => {
          console.error(response);
          let message: string;
          this.processing = false;
          if (response.status > 0) {
            if (response.error.error && response.error.error.message) {
              message = response.error.error.message;
            } else {
              switch (response.status) {
                case 400:
                  message = environment.errors.input;
                  break;
                case 401:
                  message = environment.errors.token;
                  break;
                default:
                  message = environment.errors.server;
                  break;
              }
            }
          } else {
            message = environment.errors.connection;
          }
          this.alerts.push(new Alert(Type.danger, message));
          if (response.status === 401) {
            this.requiredInit = true;
            this.alerts.push(new Alert(Type.danger, 'Reinitialization is required'));
          }
        }
      );

      this.subscriptions.add(subscription);
    }
  }

  public reinit(): void {
    this.requiredInit = false;
    this.initService.reinit();
    this.activeModal.close();
  }

  public onDescriptionEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.create();
    }
  }
}
