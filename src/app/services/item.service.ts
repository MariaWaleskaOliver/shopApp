import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";
import {Settings} from "../models/Settings.mode";
import Item from "../models/item.model";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  public static DDL:string =
    "CREATE TABLE IF NOT EXISTS Item (\n" +
    "itemId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\n" +
    "name text,\n" +
    "description TEXT,\n" +
    "imageSrc TEXT,\n" +
    "price REAL\n" +
    ");";

  item : Item;

  constructor(private db: DatabaseService) {
    this.item = new Item();
  }

  ngOnInit(): void {
    this.db.initDB();
  }

  /**
   * Insert item object into Item table.
   * @param obj
   * @param callback
   * @param errorHandler
   */
  public insertOrUpdate(obj: Item, callback = DatabaseService.defaultHandler(), errorHandler = DatabaseService.errorHandler) {
    // the first 1 means the first row. If there is the a row, it is being updated.
    let sql =
      "insert or replace into Item (itemId, name, description, imageSrc, price) values\n" +
      "(?, ?, ?, ?, ?)";

    this.db.initDB();

    let options: any[] = [obj.itemId, obj.name, obj.description, obj.imageSrc, obj.price];
    this.db.executeSQL(sql, options, callback, errorHandler);
  }

  /**
   * Get item data by item name
   * @param name
   */
  public select(name: string): Item {
    let sql = "SELECT * FROM Item WHERE name = ?";
    let options = [name];

    this.db.executeSelectSQL(sql, options, result => {
      if (result.rows.length > 0)
      {
        let row = result.rows[0]
        this.item.itemId = row['itemId'];
        this.item.name = row['name'];
        this.item.price = row['price'];
        this.item.description = row['description'];
        this.item.imageSrc = row['imageSrc'];
      }

      return this.item;
    })
    return this.item;
  }

}
