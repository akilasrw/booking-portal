import { PackageProductType } from "src/app/core/enums/common-enums";

export class AWBProduct{
  productRefNumber?:string;
  productName?:string;
  productType?:PackageProductType;
  quantity?:number;
}