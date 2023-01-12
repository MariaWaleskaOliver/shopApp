import {Component} from '@angular/core';
import {Item} from "../../models/item.model";
import {DatabaseService} from "../../services/database.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Orders} from "../../models/Orders.model";
import {Settings} from "../../models/Settings.mode";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent {
  items: Item[] = [];
  order: Orders;
  setting: Settings;

  constructor(private database: DatabaseService,
              private router: Router,
              private checkoutService: CheckoutService,
              private settingService: SettingsService) {
    this.order = new Orders();
    this.setting = new Settings();
  }

  ngOnInit(): void {
    this.database.initDB();
    this.items = this.database.selectCartAll()
    this.setting = this.settingService.select();
  }

  btnConfirm_click() {

    if (this.items.length == 0)
    {
      alert("Cart is empty.");
      return;
    }
    this.setting = this.settingService.select();

    if (this.setting.name === "")
    {
      alert("You need to set your information first");
      this.router.navigate(['/setting']);

      return;
    }

    this.order.userName = this.setting.userName;
    this.order.phoneNo = this.setting.phoneNo;
    this.order.email = this.setting.email;
    this.checkoutService.checkout(this.order, this.items);

    this.router.navigate(['/order']);
  }


  btnModify_click(product: any) {
    this.router.navigate(['modify/' + product.id]);
  }

  btnDelete_click(product: any) {
    this.database.delete(product, () => {
      alert("Record deleted successfully");
    });
    this.ngOnInit();
  }
}
