import { PackageItemStatus } from "src/app/core/enums/common-enums";

export interface PackageItem{
    packageRefNumber: string;
    awbTrackingNumber: string;
    width:number;
    length:number;
    height:number;
    weight:number;
    description:string;  
    packageItemStatus: PackageItemStatus;
  }