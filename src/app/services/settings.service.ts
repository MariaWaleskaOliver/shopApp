import {Injectable, OnInit} from '@angular/core';
import {Settings} from "../models/Settings.mode";
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnInit{
  public static DDL:string =
    "CREATE TABLE IF NOT EXISTS Settings (\n" +
    "  id NUMBER PRIMARY KEY,\n" +
    "  userName TEXT,\n" +
    "  name TEXT,\n" +
    "  phoneNo TEXT,\n" +
    "  email TEXT,\n" +
    "  aditionalInfo TEXT \n" +
    ");";

  public settings: Settings;

  constructor(private db: DatabaseService) {
    this.settings = new Settings();
  }

  ngOnInit(): void {
  }

  /**
   * Insert the first date and then update it.
   * So only one row are stored.
   * @param settings an object of Settings class.
   */
  public insertOrUpdate(obj: Settings, callback = DatabaseService.defaultHandler(), errorHandler = DatabaseService.errorHandler) {
    // the first 1 means the first row. If there is the a row, it is being updated.
    let sql =
      "insert or replace into settings (id, username, name, phoneNo, email, aditionalInfo) values\n" +
      "(1, ?, ?, ?, ?, ?)";

    this.db.initDB();

    let options: any[] = [obj.userName, obj.name, obj.phoneNo, obj.email, obj.aditionalInfo,];
    this.db.executeSQL(sql, options, callback, errorHandler);
  }

  /**
   * Select settings inforamtion. This method return an object of Settings, NOT ARRAY.
   * @return an object of Settings class, NOT ARRAY.
   */
  public select(): Settings {
    let sql = "SELECT * FROM settings WHERE id = 1";
    let retry: boolean = true;

    //this.db.initDB();
    this.db.executeSelectSQL(sql, [], (results: any) => {

      if (results.rows.length != 0) {
        this.settings.userName = results.rows[0].userName;
        this.settings.name = results.rows[0].name;
        this.settings.phoneNo = results.rows[0].phoneNo;
        this.settings.email = results.rows[0].email;
        this.settings.aditionalInfo = results.rows[0].aditionalInfoy;
      }
    }, err => {
      console.error("Fail to get setting. " + err);
    });

    if (this.settings.userName !== "" && retry) {
      return this.settings
    }

    return this.settings;
  }
}
