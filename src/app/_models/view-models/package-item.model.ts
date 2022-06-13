import { PackageItemStatus } from "src/app/core/enums/common-enums";
import { BaseModel } from "../base-model";
import { AWBDetail } from "./awb/awb-detail.model";

export interface PackageItem extends BaseModel{
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
