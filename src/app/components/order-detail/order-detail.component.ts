import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OrderDetailService} from "../../services/order-detail.service";
import {OrderDetail, OrderDetailExtend} from "../../models/OrderDetail.model";
import {CartOperationService} from "../../services/cartOperation.service";
import Item from "../../models/item.model";


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements  OnInit {
  id: string | null | undefined;
  orderDetails: OrderDetailExtend[] | null | undefined;
  dataitems: Item[] | undefined;
  details: OrderDetail[];

  constructor(private router: ActivatedRoute,
              private service: OrderDetailService,
              private cartOP: CartOperationService) {
    this.dataitems = this.cartOP.getItemList();
    this.details = [];
  }

  ngOnInit(): void {
    this.orderDetails = undefined;

    // Get ID from URL
    this.id = this.router.snapshot.paramMap.get('id');

    if ( this.id != null && this.id != undefined) {
      this.selectByOrderId(+this.id);
    }
  }

  public async selectByOrderId(orderId: number) {

    this.details = await this.service.selectByOrderIdPromise(orderId);

    this.orderDetails = [];

    for (const detail of this.details) {
      let newOne : OrderDetailExtend = new OrderDetailExtend();
      let itm = this.getItem(detail.itemId);

      //get from details
      // @ts-ignore
      newOne.itemId = itm?.itemId;
      // @ts-ignore
      newOne.description = itm?.description;
      // @ts-ignore
      newOne.name = itm?.name;
      // @ts-ignore
      newOne.price = itm?.price;
      // @ts-ignore
      newOne.imageSrc = itm?.imageSrc;
      // @ts-ignore
      newOne.quantity = detail.quantity;

      this.orderDetails.push(newOne);
    }
    // after function, the old data is stored yet.
    for (const item of this.details) {
      console.info(`Detail 3: ${item.detailId}, ${item.orderId}, ${item.itemId}, ${item.price}, ${item.quantity}`);
    }
  }

  /**
   * get Item inforamton.
   * @param id
   * @private
   */
  private getItem(id: number): Item | undefined {
    let item : Item | undefined;

    for (const i of this.cartOP.getItemList()) {
      if (i.itemId == id) {
        return i;
      }
    }

    return undefined;
  }

}
