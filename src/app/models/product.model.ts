export class Item{
    id: number = -1;
     name : any=null;
     description: any=null;
     imageSrc : any=null;
     itemId: any=null;
     price : any=null;



constructor(name?: string, description?: string, imageSrc?: string,
    price?: number){
      this.name = name;
      this.description = description;
      this.imageSrc = imageSrc;
      this.price = price;
 
   }
}