import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {ApiResponse} from '../../entities/api-response';
import {CreateData} from '../../entities/createData';
import {ModalComponent} from '../modal/modal.component';
import {Alert, Type} from '../../entities/alert';

@Component({
  selector: 'app-createitem',
  templateUrl: './createitem.component.html',
  styleUrls: ['./createitem.component.css']
})
export class CreateitemComponent extends ModalComponent implements OnInit {
  @Input() public date: string;
  public title: string;
  public description: string;
  constructor(activeModal: NgbActiveModal,
              private itemService: ItemService) {
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
            this.alerts.push(new Alert(Type.danger, 'Error'));

          }

        },
        error => {
          this.alerts.push(new Alert(Type.danger, 'Error'));

          this.processing = false;
          console.log(error);
        }
      );

      this.subscriptions.add(subscription);
    }
  }

  public onDescriptionEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.create();
    }
  }
}
