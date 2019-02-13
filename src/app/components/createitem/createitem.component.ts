import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {EventService} from '../../services/event.service';
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
              private itemService: ItemService,
              private eventService: EventService) {
    super(activeModal);
  }

  public ngOnInit() {
  }

  public create(title: string, description: string, date: string) {
    const item = new Item();
    item.title = title;
    item.description = description;
    item.date = date;

    this.alerts = [];
    this.processing = true;
    this.itemService.create(item).subscribe(
      (response: ApiResponse<CreateData>) => {
        this.processing = false;

        // TODO refactor
        if (response.success) {
          this.alerts.push(new Alert(Type.primary, 'Success creating!'));
          setTimeout(() => {
            this.activeModal.close();
          }, 2500);
          this.eventService.setCreate(response.success);
        }

      },
      error => {
        this.processing = false;
        this.eventService.setCreate(false);
        console.log(error);
      }
    );
  }
}
