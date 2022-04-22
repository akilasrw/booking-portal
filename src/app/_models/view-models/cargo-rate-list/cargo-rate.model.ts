import { PackageBoxType, PackageContainerType } from "src/app/core/enums/common-enums";

export interface CargoRate{
  id:string;
  height: number;
  width: number;
  length: number;
  maxWaight: number;
  rate:number; 
  packageContainerType:PackageContainerType;
  packageBoxType:PackageBoxType;
}


