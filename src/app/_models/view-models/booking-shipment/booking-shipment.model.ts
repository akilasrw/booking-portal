import {generate} from "rxjs";
import {PackageItemStatus} from "../../../core/enums/common-enums";

export interface BookingShipment {
  shipmentID: string;
  bookedDate: Date;
  awbNumber: string;
  shipmentStatus: PackageItemStatus;
  packageCount: number;
  flightNumber: string;
  from: string;
  to: string;
  flightDate: Date;
  flightDep: Date;
  flightArr: Date;
  acceptedForFLight: Date;
  inDestinationWahouse: Date;
  deliverdToAgent: Date;
  enrouteToWahouse: Date;
  inOriginWahouse: Date;
}
