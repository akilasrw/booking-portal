import { FlightScheduleSectorCargoPosition } from "./flight-schedule-sector-cargo-position.model";

export interface FlightScheduleSector{
  id: string;
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
  flightScheduleSectorCargoPositions: FlightScheduleSectorCargoPosition[];
}


