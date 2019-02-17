import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Item} from '../../entities/item';
import {ConfirmComponent} from '../modal/confirm.component';
import {ItemService} from '../../services/item.service';
import {Alert, Type} from '../../entities/alert';
import {ApiResponse} from '../../entities/api-response';
import {CreateData} from '../../entities/createData';
import {plainToClassFromExist} from 'class-transformer';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent extends ConfirmComponent implements OnInit, OnDestroy {
  @Input() public item: Item;

  constructor(activeModal: NgbActiveModal,
              private itemService: ItemService) {
    super(activeModal);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public yes(): void {
    super.yes();
    this.processing = true;
    const subscription = this.itemService.delete(this.item).subscribe(
      (apiResponse: ApiResponse<null>) => {
        const response = plainToClassFromExist(new ApiResponse<null>(null), apiResponse);
        this.processing = false;
        // TODO implement handling errors
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

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
