export interface FlightScheduleSector{
    originAirportCode: string;
    destinationAirportCode: string;
    originAirportName:String;
    destinationAirportName:String;
    flightNumber:String;
    scheduledDepartureDateTime:Date;
    actualDepartureDateTime:Date;    
  }