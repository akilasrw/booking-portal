import { PackageProductType } from "src/app/core/enums/common-enums";

export class AWBProductRM{
    id?:string;
    productRefNumber?:string;
    productName?:string;
    productType?:PackageProductType;
    quantity?:number;
  }
  