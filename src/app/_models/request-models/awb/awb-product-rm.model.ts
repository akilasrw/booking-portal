import { PackageProductType } from "src/app/core/enums/common-enums";

export interface AWBProductRM{
    productRefNumber:string;
    productName:string;
    productType:PackageProductType;
    quantity:number;
  }
  