import { PackageItemRM } from "../../view-models/cargo-booking/package-item-request.model";


export interface ValidateCargoPositionRequest {
  flightScheduleSectorId: string;
  packageItem: PackageItemRM;
}


