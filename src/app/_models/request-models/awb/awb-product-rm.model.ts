import { PackageProductType } from "src/app/core/enums/common-enums";

export interface AWBProductRM{
    productRefNumber:String;
    productName:String;
    productType:PackageProductType;
    quantity:number;
  }
  