 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {OrderComponent} from "./components/order/order.component";
import {SettingComponent} from "./components/setting/setting.component";
import {AboutComponent} from "./components/about/about.component";
import {OrderDetailComponent} from "./components/order-detail/order-detail.component";


const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"home",component:HomeComponent},
  {path:"checkout",component:CheckoutComponent},
  {path:"order",component:OrderComponent},
  {path:"detail/:id",component:OrderDetailComponent},
  {path:"setting",component:SettingComponent},
  {path:"about",component:AboutComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
