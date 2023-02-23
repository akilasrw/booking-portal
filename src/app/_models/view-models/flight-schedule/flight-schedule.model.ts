import { BaseVM } from './../../../shared/models/base-vm.model';
import { AircraftConfigType } from "src/app/core/enums/common-enums";
import { FlightScheduleSectorCargoPosition } from "../flight-schedule-sectors/flight-schedule-sector-cargo-position.model";

export interface FlightSchedule extends BaseVM{
  aircraftConfigType:AircraftConfigType;
  originAirportCode: string;
  destinationAirportCode: string;
  originAirportName: string;
  destinationAirportName: string;
  flightNumber: string;
  scheduledDepartureDateTime: Date;
  acceptanceCutoffTime?: Date;
  bookingCutoffTime: Date;
  availableWeight:number;
  availableVolume:number;
  originAirportId:string;
  destinationAirportId:string;
  flightScheduleSectorIds:string[];
  flightScheduleSectorCargoPositions: FlightScheduleSectorCargoPosition[];
}


