import { AWBProductRM } from "./awb-product-rm.model";

export class AWBCreateRM{
    id?:string;
    userId?:string;
    shipperName?:string;
    shipperAccountNumber?:string;
    shipperAddress?:string;
    consigneeName?:string;
    consigneeAccountNumber?:string;
    consigneeAddress?:string;
    agentName?:string;
    agentCity?:string;
    agentAITACode?:string;
    agentAccountNumber?:string;
    agentAccountInformation?:string;
    requestedRouting?:string;
    routingAndDestinationTo?:string;
    routingAndDestinationBy?:string;
    requestedFlightDate?:Date;
    destinationAirportId?:string;
    destinationAirportCode?:string;
    shippingReferenceNumber?:string;
    currency?:string;
    declaredValueForCarriage?:number;
    declaredValueForCustomer?:number;
    amountOfInsurance?:number;   
    packageProducts?:AWBProductRM[];
    isEditAWB?:boolean;
    cargoBookingId?:string;
  }
  