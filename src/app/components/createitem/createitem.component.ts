import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ItemService} from '../../services/item.service';
import {Item} from '../../entities/item';

@Component({
  selector: 'app-createitem',
  templateUrl: './createitem.component.html',
  styleUrls: ['./createitem.component.css']
})
export class CreateitemComponent implements OnInit {
  @Input() date;

  constructor(
    private itemService: ItemService,
    private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  create(title: string, description: string, date: string) {
    const item = new Item();
    item.title = title;
    item.description = description;
    item.date = date;
    // this.itemService.create(item)

    console.log(item);
    this.itemService.create(item).subscribe(
      result => {
        this.activeModal.close();
      },
      error => {
        console.log(error);
      }
    );
  }
}
