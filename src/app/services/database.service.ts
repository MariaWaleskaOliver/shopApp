import {Injectable} from '@angular/core';
import {Item} from "../models/item.model";
import {OrderService} from "./order.service";
import {OrderDetailService} from "./order-detail.service";
import {ItemService} from "./item.service";
import {SettingsService} from "./settings.service";

/*
 * Declaration for JavaScript
 */

declare function openDatabase(shortName: string, version: string, displayName: string, bdSize: number, dbCreateSuccess: () => void): any;

@Injectable({
  providedIn: 'root'
})

/**
 * Open database and create tables
 */
export class DatabaseService {
  // database object.
  private db: any = null;

  constructor() {
  }

  /**
   * Default error handler
   * @param error error message from database.
   * @public
   */
  public static errorHandler(error: any): any {
    console.error(error);
  }

  /**
   * Default callback handler for success.
   */
  public static defaultHandler(): any {
    console.info("SQL executed successfully")
  }

  /**
   * Default transaction handler.
   * @public
   */
  public static txHandler(tx: any = null, results: any = null): any {
    console.info("SQL exeucuted successfully.");
  }

  /**
   * Open database. The database object 'db' is created.
   * @private
   */
  private createDatabase(): void {
    let shortName = "MobileShoppingDB";
    let version = "1.0";
    let dispalyName = "DB for MobileShopping";
    let dbSize = 2 * 1024 * 1024;

    try {
      this.db = openDatabase(shortName, version, dispalyName, dbSize, () => {
        console.log("db created sucessfully")
      });
    } catch(e) {
      // try again with version number ''
      console.info("Try to reconnect..");
      version = "";
      this.db = openDatabase(shortName, version, dispalyName, dbSize, () => {
        console.log("db created sucessfully")
      });
    }
  }

  public getDBObject(): any {
    return this.db;
  }
  /**
   * Execute the given SQL. This function is for the convenience of SQL execution.
   * Example: this.executeSQL("CREATE TABLE test (id: INTEGER)");
   *
   * @param sql SQL to execute
   * @param options SQL options. Default is [].
   * @param txCallback Callback function for transaction processing. Default is DatabaseService.txHandler().
   * @param errorCallback Error callback function. Default handler is DatabaseService.errorHandler()
   */
  public executeSQL(
    sql: string,
    options: any[] = [],
    txCallback = DatabaseService.txHandler,
    errorCallback = DatabaseService.errorHandler): void {

    this.db.transaction((tx: any) => {
      tx.executeSql(sql, options, txCallback, errorCallback);
    });
  }

  /**
   * Execute SELECT statement synchronously.
   * The usage is similar to executeSQL(), but callback function has only results parameter.
   *
   * @param sql SELECT statement
   * @param options Options for sql parameters
   * @param callback Handler to get results from DB. Signature: callback(results:any) : any.
   *                 Actually this is a Promise's then() handler.
   * @param errorHandler Error handler with error param.
   */
  public executeSelectSQL(
    sql: string,
    options: any[] = [],
    callback = (results:any): any => {},
    errorHandler = (err:any) => {console.error(err)}): void {

    var promise = new Promise((resolve, reject) => {
      this.executeSQL(
        sql,
        options,
        (tx, results:any ): any => {
          // pass the results to a callback function of then()'s parameter.
          resolve(results);
        }
      );
    });

    promise.then(callback).catch(errorHandler);
  }

  /**
   * Create tables. You can add your table here.
   * @private
   */
  private createTables(): void {
    var sqls: string[] = [
        ItemService.DDL,
        "CREATE TABLE IF NOT EXISTS cart(" +
        "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
        "name TEXT NOT NULL," +
        "desc TEXT," +
        "itemId INTEGER," +
        "price INTEGER);",
        OrderService.DDL,
        OrderDetailService.DDL,
        SettingsService.DDL
      ];

    for (let i=0; i < sqls.length; i++) {
      this.executeSQL(sqls[i]);
    }
  }

    /**
   * init db, called on onInit in homecomponet
   */
  public initDB(): void {
    if (this.db == null) {
      try {
        this.createDatabase();
        this.createTables();
      } catch (e) {
        console.error("error in initDB" + e);
      }
    }
  }

  // adding to database
  public insert(item: Item, callback: any) {
    function txFunction(tx: any) {
      var sql: string = "INSERT INTO cart(name,desc,itemId,price) VALUES(?,?,?,?);";
      var options = [item.name, item.description, item.itemId, item.price];
      console.log(options)
      tx.executeSql(sql, options, () => {
        console.info("INSERT SUCCESSFUL")
      }, DatabaseService.errorHandler);
    }

    try {
      this.db.transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("INSERT TRANSACTION SUCCESSFUL");
      });
    } catch (e) {
      console.log(e)
    }

  }


  // add delete function for checkout page
  //public delete(id: number, callback: any) {
    public delete(item: Item, callback: any) {
    function txFunction(tx: any) {
      var sql: string = 'DELETE FROM cart WHERE id=?;';
      var options = [item.itemId];
      tx.executeSql(sql,options, callback, DatabaseService.errorHandler)
    }

    this.db.transaction(txFunction, DatabaseService.errorHandler, () =>
    {
      console.log('Sucess: delete transaction sucessful');
    });
  }

  public select(id: number): Promise<any> {
    let options = [id];
    let product: Item;
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = "SELECT * FROM cart WHERE id=?;";
        tx.executeSql(sql, options, (tx: any, results: { rows: string | any[]; }) => {
          if (results.rows.length > 0) {
            let row = results.rows[0];
            product = new Item();
            product.itemId = row['id'],product.name = row['name'], product.description = row['description']
            product.imageSrc = row['imageSrc'], product.price = row['price'];

            resolve(product);
          }
          else {
            reject("No product found");
          }
        }, DatabaseService.errorHandler);
      }
      this.db.transaction(txFunction, DatabaseService.errorHandler, () => {
        console.log('Success: select transaction successful ');
      });
    });
  }

  public selectAll(): Promise<any> {
    let options: string[] = [];
    let items: Item[] = [];
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = "SELECT * FROM cart;";
        tx.executeSql(sql, options, (tx: any, results: { rows: string | any[]; }) => {
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              let row = results.rows[i];
              let pdt = new Item();
              pdt.itemId = row['id'],pdt.name = row['name'], pdt.description = row['description']
              pdt.imageSrc = row['imageSrc'], pdt.price = row['price'];
              items.push(pdt);
            }
            resolve(items);
          }
          else {
            reject("No items found");
          }
        }, DatabaseService.errorHandler);
      }
      this.db.transaction(txFunction, DatabaseService.errorHandler, () => {
        console.log('Success: selectAll transaction successful');
      });
    });
  }

  public selectCartAll() : Item[] {
    let sql = "SELECT * FROM cart";
    let items: Item[] = [];

    // DB connection might be disconnected by web browser.
    //this.db.initDB();

    this.executeSelectSQL(sql, [], (results: any) => {
      let dataset = results;
      console.info("# of items: " + results.rows.length);

      for (let i = 0; i < dataset.rows.length; i++) {
        let row = dataset.rows[i];
        let item: Item = new Item();

        item.itemId = row['id'];
        item.name = row['name'];
        item.description = row['description'];
        item.imageSrc = row['imageSrc'];
        item.price = row['price'];

        items.push(item);
      }
    });

    return items;
  }

  /**
   * Enpty cart after checking out.
   */
  public emptyCart() {
    let sql = "DELETE FROM cart";

    this.executeSQL(sql);
  }
}
