import { AWBProduct } from "./awb-product.model";

export class AWBDetail{
    userId?:string
    shipperName?:string;
    awbTrackingNumber?:string;
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
    packageProducts?:AWBProduct[];
  }