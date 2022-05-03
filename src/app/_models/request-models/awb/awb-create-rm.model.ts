import { AWBProductRM } from "./awb-product-rm.model";

export interface AWBCreateRM{
    shipperName:String;
    shipperAccountNumber:String;
    shipperAddress:String;
    consigneeName:String;
    consigneeAccountNumber:String;
    consigneeAddress:String;
    agentName:String;
    agentCity:String;
    agentAITACode:String;
    agentAccountNumber:String;
    agentAccountInformation:String;
    requestedRouting:String;
    routingAndDestinationTo:String;
    routingAndDestinationBy:String;
    requestedFlightDate:Date;
    destinationAirportId:String;
    destinationAirportCode:String;
    shippingReferenceNumber:String;
    currency:String;
    declaredValueForCarriage:number;
    declaredValueForCustomer:number;
    amountOfInsurance:number;   
    packageProducts:AWBProductRM[];
  }
  