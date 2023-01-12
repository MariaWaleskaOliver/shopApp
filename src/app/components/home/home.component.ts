import {publish} from "rxjs";

import {Component, OnInit} from '@angular/core';
import {Item} from "../../models/item.model";
import {CartOperationService} from "../../services/cartOperation.service";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  myimage: string = "assets/img/img4.png";
  items: Item[] | undefined;
  cardItems: Item[] | undefined;
  cartCount: number |undefined;



  constructor(private cartOperationService: CartOperationService, private database:DatabaseService) {
  }

  ngOnInit(): void{


    this.database.initDB();

  this.items = this.cartOperationService.getItemList();
  this.cardItems = this.cartOperationService.getCartItem();
  this.getCartCount(); // this need to get fixed

}

// click listener get element that trigger the event and add to database accordingly

btnAddCart_Click(e:Event){

    //add to database
  let  targetID: string =  (e.target as HTMLElement).id;

  let product: Item;
  // @ts-ignore
  for (product of this.items){
    if (targetID == (product.itemId).toString()){
      console.log(product);
      this.database.insert(product, ()=>{
        console.log("add to cart successfully");
      })
    }
  }
  // get number of item in cart

    this.getCartCount()


  // show snack bar
  var snackBar = document.getElementById("snackbar");
  // @ts-ignore
  snackBar.className ="show";
  setTimeout(function (){
    // @ts-ignore
    snackBar.className = snackBar.className.replace("show","");
  },3000)
}


getCartCount(){
  this.database.selectAll()
    .then(data=>{
      let list = data;
      this.cartCount= list.length;
      console.log(this.cartCount)

    })
    .catch(err=>{
      console.error(err);
    });
  }
}
