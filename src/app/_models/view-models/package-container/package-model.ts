import {PackageItemStatus} from "../../../core/enums/common-enums";

export interface PackageModel {
  packageID: string;
  packageItemStatus: number;
  packageItem: {
    packageRefNumber: string;
    packagePriorityType: number;
    width: number;
    length: number;
    height: number;
    volumeUnitId: string | null;
    weight: number;
    chargeableWeight: number;
    weightUnitId: string | null;
    declaredValue: number;
    packageItemStatus: PackageItemStatus;
    description: string;
    packageItemCategory: number;
    cargoBookingId: string;
    cargoBooking: any; // You might want to replace this with the correct type if cargoBooking is supposed to have a specific type
    volumeUnit: any; // You might want to replace this with the correct type if volumeUnit is supposed to have a specific type
    weightUnit: any; // You might want to replace this with the correct type if weightUnit is supposed to have a specific type
    packageULDContainers: any[] | null; // You might want to replace this with the correct type if packageULDContainers is supposed to have a specific type
    createdBy: string;
    created: string;
    lastModifiedBy: string | null;
    lastModified: string | null;
    isActive: boolean;
    isDeleted: boolean;
    id: string;
  };
  createdBy: string;
  created: string;
  lastModifiedBy: string | null;
  lastModified: string | null;
  isActive: boolean;
  isDeleted: boolean;
  id: string;
}
