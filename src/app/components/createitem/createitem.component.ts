import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';
import {EventService} from '../../services/event.service';

@Component({
  selector: 'app-createitem',
  templateUrl: './createitem.component.html',
  styleUrls: ['./createitem.component.css']
})
export class CreateitemComponent implements OnInit {
  @Input() formattedDate: string;

  constructor(
    private itemService: ItemService,
    private eventService: EventService,
    private activeModal: NgbActiveModal) { }

  public ngOnInit() {
  }

  public create(title: string, description: string, date: string) {
    const item = new Item();
    item.title = title;
    item.description = description;
    item.date = date;

    this.itemService.create(item).subscribe(
      result => {
        console.log(result);
        this.eventService.setCreate(result.success);
        this.activeModal.close();
      },
      error => {
        this.eventService.setCreate(false);
        console.log(error);
      }
    );
  }
}
