import { PackageItemCategory } from "src/app/core/enums/common-enums";

export class AWBDetail{
    userId?:string
    shipperName?:string;
    awbTrackingNumber?:number;
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
    destinationAirportName?:string;
    shippingReferenceNumber?:string;
    currency?:string;
    declaredValueForCarriage?:number;
    declaredValueForCustomer?:number;
    amountOfInsurance?:number;   
    rateCharge?:number;
    natureAndQualityOfGoods?:string;
    packageItemCategory?:PackageItemCategory;
    noOfPieces?:number;
    grossWeight?:number;
    comodityType?:string;
    chargeableWeight?:number;
    totalCharge?:number;
  }