import {Component, OnInit} from '@angular/core';
import {DemodataService} from "./services/demodata.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent implements OnInit{
  title = 'MobileShopping';

  ngOnInit(): void {
    // Generate demo data.
    let demoData: DemodataService = new DemodataService();
    demoData.generateData()
  }
}

