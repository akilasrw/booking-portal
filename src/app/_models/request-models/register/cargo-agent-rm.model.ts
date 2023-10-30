import { CargoAgentStatus } from "src/app/core/enums/common-enums";

export interface CargoAgentRM{
    agentName:string;
    userName:string;
    address:string;
    primaryTelephoneNumber:string;
    secondaryTelephoneNumber:string;
    email:string;
    cargoAccountNumber:string;
    countryId:string;
    baseAirportId:string;
    city:string;
    agentIATACode:string;
    password:string;
    confirmPassword:string;
    status?: CargoAgentStatus;
    agreementFile: File;
  }
  