import {Injectable, OnInit} from '@angular/core';
import {CartOperationService} from "./cartOperation.service";
import {Item} from "../models/item.model";
import {ItemService} from "./item.service";
import {DatabaseService} from "./database.service";
import {OrderService} from "./order.service";
import {Orders} from "../models/Orders.model";
import {OrderDetail} from "../models/OrderDetail.model";
import {OrderDetailService} from "./order-detail.service";
import {Settings} from "../models/Settings.mode";
import {SettingsService} from "./settings.service";
import {getLocaleFirstDayOfWeek} from "@angular/common";

@Injectable({
  providedIn: 'root'
})

export class DemodataService {

  public generateData() {
    var db: DatabaseService = new DatabaseService();
    db.initDB();

    console.info("Generating Test data...");
    this.dataForItems(db)
    //this.dataForOrders(db);
    //this.dataForSettings(db);
  }

  /**
   * Generate Item data for menu items
   * @param db
   * @private
   */
  private dataForItems(db: DatabaseService) {
    let itemData: CartOperationService = new CartOperationService();
    let service: ItemService = new ItemService(db);

    let itemList: Item[];

    itemList = itemData.getItemList()

    // Generate Item data for Item table.
    for (let item of itemList) {
      service.insertOrUpdate(item);
    }
  }

  private dataForOrders(db: DatabaseService) {
    var orderService: OrderService = new OrderService(db);
    var detailService: OrderDetailService = new OrderDetailService(db);

    var order: Orders = new Orders();

    order.orderId = 111111111;
    order.status = "Preparing";
    order.orderDateTime = new Date();
    order.amount = 100;
    order.tax = order.amount * 0.15;
    order.total = order.amount + order.tax;
    order.userName = "Ben";
    order.phoneNo = "122-334-5523";
    order.email = "ben@company.com";
    order.street = "112 Oxford St.";
    order.city = "Toronto";
    order.province = "Ontario";
    order.amount = 55;
    order.tax = order.amount * 0.15;
    order.total = order.amount + order.tax;

    console.info("Creating demo data");
    orderService.insert(order);

    let detailO: OrderDetail = new OrderDetail();
    detailO.orderId = order.orderId;
    detailO.itemId = 1;
    detailO.quantity = 10;
    detailO.price = 100;

    detailService.insert(detailO);
  }

  private dataForSettings(db: DatabaseService) {
    var service:SettingsService = new SettingsService(db);

    var settins: Settings = new Settings();

    settins.userName = "Demo User Name";
    settins.name = "Demo user"
    settins.email = "user@sample.com";
    settins.phoneNo = "549 -333-5973"
    settins.aditionalInfo ="310 kingswood drive Wateerloo"
    service.insertOrUpdate(settins);
  }
}
