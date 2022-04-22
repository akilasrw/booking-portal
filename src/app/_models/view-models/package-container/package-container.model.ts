import { BaseModel } from './../../base-model';
import { PackageContainerType, PackageItemCategory } from "src/app/core/enums/common-enums"

export interface PackageContainer extends BaseModel{
  height: number;
  width: number;
  length: number;
  isCustom: boolean;
  packageContainerType: PackageContainerType;
  packageItemCategory: PackageItemCategory;
  maxWaight: number;
}
