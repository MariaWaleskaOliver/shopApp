/**
 * Order Detail Model
 */
export class OrderDetail {
  public detailId: any = null;      // primary key
  public orderId: any = 0;
  public itemId: any = 0;
  public price: number = 0;
  public quantity: number = 0;
}

/**
 * OrdeDetail + Item
 */
export class OrderDetailExtend {
  public detailId: any = null;      // primary key
  public orderId: any = 0;
  public itemId: any = 0;
  public price: number = 0;         // this price from OrderDetail not Item
  public quantity: number = 0;
  public name: string = "";
  public description: string = "";
  public imageSrc: string = "";
}
