import {Component, OnInit} from '@angular/core';
import {DemodataService} from "../../services/demodata.service";
import {DatabaseService} from "../../services/database.service";
import {OrderService} from "../../services/order.service";
import {Orders} from "../../models/Orders.model";
import {Router} from "@angular/router";


/**
 * Order page
 */
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit{
  orders: Orders[] | undefined;
  html: string = "";


  ngOnInit(): void {
    // Retrieve all order list and display them.
    // Displaying has been done by jQuery in selectAll() method,
    // but it'd be better to use Promise object later.
    this.orders = this.orderService.selectAll();
    console.info("Order count: " + this.orders.length);
  }

  constructor(private db:DatabaseService,
              private orderService: OrderService,
              private router: Router) {
  }

  /**
   * Click the button and forward to the detail page.
   * @param orderId Order ID
   */
  btnDetail_Click(orderId: number) {
    this.router.navigate(['/detail', orderId]);
  }
}
