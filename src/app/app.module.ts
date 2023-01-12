import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderComponent } from './components/order/order.component';
import { SettingComponent } from './components/setting/setting.component';
import { AboutComponent } from './components/about/about.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
//import { Validator } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CheckoutComponent,
    OrderComponent,
    SettingComponent,
    AboutComponent,
    OrderDetailComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
