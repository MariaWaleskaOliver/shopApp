import { Injectable } from '@angular/core';
import {Item} from "../models/item.model";

@Injectable({
  providedIn: 'root'
})
export class CartOperationService {

  private itemList: Item[]=[
    {name:'Roasted Salmon', description:'Our signature Oven Roasted Salmon with flavorful Spices, come with sides',imageSrc:"../assets/img/Salmon.jpg",itemId:1, price:18} ,
    {name:'New York Steak', description:'Premium Steak with asparagus ',imageSrc:"../assets/img/Steak.jpg",itemId:2, price:21} ,
    {name:'Fries', description:'Signature Fires with parsley',imageSrc:"../assets/img/Fries.jpg",itemId:3, price:6} ,
    {name:'Bbq Combo', description:'Serves 3, include pork, sausages, roasted beef ',imageSrc:"../assets/img/Bbq.jpg",itemId:4, price:64} ,



  ]

  private cartItem : Item[] = [];
  public getItemList (){
    return this.itemList;
  }
  public getCartItem(){
    return this.cartItem;
  }
  public getCartCount(){
    return this.cartItem.length+1
  }



  constructor() { }



}
