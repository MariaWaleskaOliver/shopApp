import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";
import {Orders} from "../models/Orders.model";
import {OrderDetail, OrderDetailExtend} from "../models/OrderDetail.model";
import {CartOperationService} from "./cartOperation.service";
import {Item} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  public static DDL:string =
    "CREATE TABLE IF NOT EXISTS OrderDetail (\n" +
    "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\n" +
    "orderId INTEGER,\n" +
    "itemId INTEGER,\n" +
    "price REAL,\n" +
    "quantity INTEGER )";

  // Array for OrderDetail data.
  private detailExtend: OrderDetailExtend[];
  private details: OrderDetail[];


  constructor(private db: DatabaseService) {
    this.detailExtend = [];
    this.details = [];
  }

  ngOnInit(): void {
  }

  /**
   * Insert order detail information into OrderDetail table.
   * @param detail
   */
  public insert(detail: OrderDetail): void {
    let sql =
      "INSERT INTO OrderDetail (orderId, itemId, price, quantity) VALUES " +
      "(?, ?, ?, ?)";

    // DB connection might be disconnected by web browser.
    this.db.initDB();

    let options: any[] = [detail.orderId, detail.itemId, detail.price, detail.quantity];
    this.db.executeSQL(sql, options);
  }

  /**
   *
   */
  public async selectByOrderId(orderId: number): Promise<OrderDetail[]> {

    this.details = await this.selectByOrderIdPromise(orderId);

    // after function, the old data is stored yet.
    for (const item of this.details) {
      console.info(`Detail 3: ${item.detailId}, ${item.orderId}, ${item.itemId}, ${item.price}, ${item.quantity}`);
    }

    return this.details;
  }

  public selectByOrderIdPromise(orderId: number) : Promise<any> {
    let options = [orderId];
    let details: OrderDetail[] = [];

    return new Promise((resolve, reject) => {

      function txFunc(tx: any) {
        let sql = "SELECT * FROM OrderDetail WHERE orderId = ?";

        tx.executeSql(sql, options, (tx: any, results: { rows: string | any[]; }) => {
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              let row = results.rows[i];
              let item: OrderDetail = new OrderDetail();

              item.detailId = row['id'];
              item.orderId = row['orderId']
              item.itemId = row['itemId']
              item.price = row['price']
              item.quantity = row['quantity']
              details.push(item);
            }
            resolve(details);
          } else {
            reject("No data found");
          }
        }, DatabaseService.errorHandler);
      }

      this.db.getDBObject().transaction(txFunc, DatabaseService.errorHandler, () => {
        console.info("Success");
      })
    });
  }

  /**
   * Retrieve order list with extend fields.
   */
  public selectExtendByOrderId(orderId: number) : OrderDetailExtend[] {
    let sql =
      "SELECT Id, O.itemId, O.price, O.quantity, " +
      "       I.name, I.description, I.imageSrc " +
      "FROM OrderDetail O JOIN Item I ON (O.itemId = I.itemId) " +
      "WHERE orderId = ?";
    let options:any = [orderId];

    // DB connection might be disconnected by web browser.
    this.db.initDB();

    this.db.executeSelectSQL(sql, options, (results: any) => {
      this.detailExtend = [];
      let dataset = results;
      console.info(`${results.rows.length}' of order detail for ${orderId}`);

      for (let i = 0; i < dataset.rows.length; i++) {
        let row = dataset.rows[i];
        let item: OrderDetailExtend = new OrderDetailExtend();
        item.detailId = row['id'];
        item.orderId = row['orderId']
        item.itemId = row['itemId']
        item.price = row['price']
        item.quantity = row['quantity']
        item.name = row['name']
        item.description = row['description']
        item.imageSrc = row['imageSrc']

        console.info(`Detail: ${item.detailId}, ${item.orderId}, ${item.itemId},
        ${item.name}, ${item.description}, ${item.price}, ${item.quantity}`);

        this.detailExtend.push(item);
      }
    },
    err => {
      console.error(err);
    });

    return this.detailExtend;
  }
}
