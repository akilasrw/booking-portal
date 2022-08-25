import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';
import { PackageContainerType, PackageItemCategory, PackageItemStatus, PackagePriorityType } from "src/app/core/enums/common-enums";


export class PackageItemRM {
  width?: number;
  length?: number;
  height?: number;
  volumeUnitId?: string;
  weight?: number;
  weightUnitId?: string;
  declaredValue?: number;
  packageItemCategory?: PackageItemCategory;
  packagePriorityType?: PackagePriorityType;
  packageContainerType?: PackageContainerType;
  packageItemStatus?: PackageItemStatus;
  description?: string;
  pieces?:number;
}
