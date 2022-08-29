import { PackageItemStatus } from "src/app/core/enums/common-enums";
import { BaseModel } from "../base-model";

export class PackageItem extends BaseModel{
    packageRefNumber?: string;
    width?:number;
    length?:number;
    height?:number;
    weight?:number;
    description?:string;
    packageItemStatus?: PackageItemStatus;
    weightUnitId?: string;
    volumeUnitId?: string;
    pieces?:number;
    isEdit?: boolean; 
  }
