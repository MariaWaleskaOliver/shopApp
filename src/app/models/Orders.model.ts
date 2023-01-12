/**
 * Order model class
 */
export class Orders {
  public orderId: any = null;
  public status: string = "";   // Value: Payment complete, Preparing, Shipping, Complete, Cancelled
  public orderDateTime: Date = new Date();
  public amount: number = 0;
  public tax: number = 0;
  public total: number = 0;
  public userName: string = ""; // user name
  public phoneNo: string = "";
  public email: string = "";
  public street: string = "";
  public city: string = "";
  public province: string = ""; // province full name, not abbr.
  public description: string = "";
  public cancelDate: Date | undefined;
}
