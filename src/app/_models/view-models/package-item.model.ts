import { PackageItemStatus } from "src/app/core/enums/common-enums";
import { AWBDetail } from "./awb/awb-detail.model";

export interface PackageItem{
    packageRefNumber: string;
    awbTrackingNumber: string;
    width:number;
    length:number;
    height:number;
    weight:number;
    description:string;
    packageItemStatus: PackageItemStatus;
    weightUnitId?: string;
    volumeUnitId?: string;
    isEdit: boolean; 
    awbInformation:AWBDetail;
  }
