import { PackageContainerType, PackageItemCategory, PackageItemStatus, PackagePriorityType } from "src/app/core/enums/common-enums";


export interface PackageItemRM {
  width: number;
  length: number;
  height: number;
  volumeUnitId?: string;
  weight: number;
  weightUnitId?: string;
  declaredValue?: number;
  packageItemCategory?: PackageItemCategory;
  packagePriorityType?: PackagePriorityType;
  description?: string;
  packageItemStatus?: PackageItemStatus;
  packageContainerType?: PackageContainerType;
}
