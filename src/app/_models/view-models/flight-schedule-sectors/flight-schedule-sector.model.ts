import { AircraftConfigType } from "src/app/core/enums/common-enums";
import { FlightScheduleSectorCargoPosition } from "./flight-schedule-sector-cargo-position.model";

export interface FlightScheduleSector{
  id: string;
  aircraftConfigType:AircraftConfigType;
  originAirportCode: string;
  destinationAirportCode: string;
  originAirportName: string;
  destinationAirportName: string;
  flightNumber: string;
  scheduledDepartureDateTime: Date;
  acceptanceCutoffTime?: Date;
  bookingCutoffTime: Date;
  actualDepartureDateTime: Date;
  flightScheduleStatus: number;
  availableWeight:number;
  availableVolume:number;
  originAirportId:string;
  destinationAirportId:string;
  flightScheduleSectorCargoPositions: FlightScheduleSectorCargoPosition[];
}


