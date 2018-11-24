import {Component, OnInit} from '@angular/core';
import {InitService} from './services/init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  public isInitialized = false;

  constructor(private initService: InitService) {

  }

  ngOnInit() {
    this.initService.getResult().subscribe((result: boolean) => {
      console.log(result);
      this.isInitialized = result;
    });
    this.initService.init();
  }

}
