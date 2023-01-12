import {Injectable, OnInit} from '@angular/core';
import {DatabaseService} from "./database.service";
import {Orders} from "../models/Orders.model";
import {Timestamp} from "rxjs";

/**
 * Javascript functions
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit {
  public static DDL:string =
    "CREATE TABLE IF NOT EXISTS Orders (\n" +
    "orderId INTEGER NOT NULL PRIMARY KEY,\n" +
    "state TEXT,\n" +
    "orderDateTime TEXT,\n" +
    "amount REAL,\n" +
    "tax REAL,\n" +
    "total REAL,\n" +
    "userName TEXT,\n" +
    "phoneNo TEXT,\n" +
    "email TEXT,\n" +
    "street TEXT,\n" +
    "city TEXT,\n" +
    "province TEXT,\n" +
    "description TEXT, \n" +
    "cancelDateTime TEXT );"

  private orders: Orders[] = [];
  private orderId: number;
  private isSuccess: boolean;

  constructor(private db: DatabaseService) {
    this.orderId = -1;
    this.isSuccess = false;
  }

  ngOnInit(): void {
  }

  /**
   * Insert order into Orders table.
   * @param order Order object. You do not have to set id and cancelDateTime fields.
   */
  public insert(order: Orders): boolean {
    let sql =
      "INSERT OR REPLACE INTO Orders (orderId, state, orderDateTime, amount, tax, total, " +
      "userName, phoneNo, email, street, city, province, description) VALUES " +
      "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    this.isSuccess = true;

    // DB connection might be disconnected by web browser.
    //this.db.initDB();

    // set order ID when order ID is not set yet.
    if (order.orderId == 0 || order.orderId == null) {
      order.orderId = this.genOrderId(order);
    }

    let options: any[] = [order.orderId, order.status, this.formatDate(order.orderDateTime),
      order.amount, order.tax, order.total,
      order.userName, order.phoneNo, order.email, "", "", "", order.description];

    this.db.executeSQL(sql, options, DatabaseService.txHandler, error => {
      console.error("Fail to store Order: " + error);
      this.isSuccess = false;
    });

    return this.isSuccess;
  }

  /**
   * Generate unique order ID.
   * @param order
   */
  public genOrderId(order: Orders): number
  {
    let id: number = Date.now();   // get timestamp
    let array = new Uint32Array(1);
    crypto.getRandomValues(array); // get random number

    id += order.total;
    id += order.amount;
    id += array[0];

    return Math.round(id);
  }


  // Format using reusable function
  private padTo2Digits(num: number):string {
    return num.toString().padStart(2, '0');
  }

  /**
   * Get formatted date and time. Format: YYYY-MM-DD hh:mm:ss
   * This is for WebSQL to save DateTime data
   * @param date
   */
  public formatDate(date: Date): string {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  /**
   * Get the last order list;
   */
  public getLastOrders(): Orders[] {
    return this.orders;
  }

  /**
   * Retrieve all order list.
   */
  public selectAll() : Orders[] {
    let sql = "SELECT * FROM Orders ORDER BY orderDateTime DESC";

    this.orders = [];

    // DB connection might be disconnected by web browser.
    this.db.initDB();

    this.db.executeSelectSQL(sql, [], (results: any) => {
      let dataset = results;
      console.info("# of orders: " + results.rows.length);

      for (let i = 0; i < dataset.rows.length; i++) {
        let row = dataset.rows[i];
        let order: Orders = new Orders();
        order.orderId = row['orderId'];
        order.status = row['state'];
        order.orderDateTime = new Date(row['orderDateTime']);
        order.amount = row['amount'];
        order.tax = row['tax'];
        order.total = row['total'];
        order.userName = row['userName'];
        order.phoneNo = row['phoneNo'];
        order.email = row['email'];
        order.street = row['street'];
        order.city = row['city'];
        order.province = row['province'];
        order.description = row['description'];
        order.cancelDate = row['cancelDate'];

        this.orders.push(order);
      }
    });

    return this.orders;
  }
}
