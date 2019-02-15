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
  @Input() formattedDate: string;

  constructor(activeModal: NgbActiveModal,
              private itemService: ItemService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public create(title: string, description: string, date: string) {
    const item = new Item();
    item.title = title;
    item.description = description;
    item.date = date;

    this.alerts = [];
    this.processing = true;
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
