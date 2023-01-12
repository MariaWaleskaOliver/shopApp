import {Injectable, OnInit} from '@angular/core';
import {DatabaseService} from "./database.service";
import {Orders} from "../models/Orders.model";
import {OrderDetail, OrderDetailExtend} from "../models/OrderDetail.model";
import {OrderService} from "./order.service";
import {OrderDetailService} from "./order-detail.service";
import {Item} from "../models/item.model";
import {ItemService} from "./item.service";
import {CartOperationService} from "./cartOperation.service";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService implements OnInit {
  order: Orders | null;
  itemList: Item[] | null;
  total: number;

  ngOnInit(): void {
  }

  constructor(private db: DatabaseService,
              private orderService: OrderService,
              private detailService: OrderDetailService,
              private itemService: ItemService,
              private cartOP: CartOperationService) {
    this.order = null;
    this.itemList = null;
    this.total = 0;
  }

  /**
   * Calculate order and insert order into order and orderDetail table.
   * The data of Cart table will copy to OrderDetail and be DELETED.
   *
   * @param order
   */
  public checkout(order: Orders, items: Item[]): void {
    let menuCounter: Map<number, OrderDetail>;
    let i: number;

    console.info("# CHECKING OUT ...");
    this.total = 0;
    this.order = order;
    this.order.orderId = this.orderService.genOrderId(this.order);

    console.info("Order Id = " + this.order.orderId);

    //
    // Make description
    //
    for (i = 0; i < items.length && i < 2; i++) {

      if (this.order.description === "") {
        this.order.description = items[i].name;
      } else {
        this.order.description += ", " + items[i].name;
      }
    }

    if (items.length > i) {
      this.order.description += ", more.."
    }

    //
    // Calculate
    //
    menuCounter = new Map<number, OrderDetail>();
    for (let cartItem of items) {
      this.total += cartItem.price;

      // item.itemId is not a real ID. It's a cart ID.
      // So I use item.name for key.
      var dbItem: Item = new Item();
      for (let i of this.cartOP.getItemList()) {
        if (i.name === cartItem.name) {
          dbItem = i;
          break;
        }
      }

      //let dbItem = this.itemService.select(cartItem.name);
      let object: OrderDetail | undefined = menuCounter.get(dbItem.itemId);

      // make OrderDetail data.
      if (object == undefined) {
        let newOne: OrderDetail = new OrderDetail();
        newOne.orderId = order.orderId;
        newOne.itemId = dbItem.itemId;
        newOne.price = dbItem.price;
        newOne.quantity = 1;

        menuCounter.set(dbItem.itemId, newOne);
      } else {
        object.quantity++;
        menuCounter.set(dbItem.itemId, object);
      }
    }

    // Calucate tax
    order.amount = this.total;
    order.tax = this.total * 0.15;
    order.total = order.amount + order.tax;

    console.info("Total = " + order.total);

    // save order information
    if (this.orderService.insert(order) == true) {

      // save order detail information
      for (let key of menuCounter) {
        this.detailService.insert(key[1]);
      }

      this.db.emptyCart()
      alert("Place an order successfully.");
    } else {
      alert("Fail to place an order.");
    }
  }
}
