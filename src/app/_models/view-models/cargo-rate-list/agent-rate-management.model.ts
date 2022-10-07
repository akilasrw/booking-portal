import { BaseVM } from "src/app/shared/models/base-vm.model";
import { AgentRate } from "./agent-rate.model";

export class AgentRateManagement extends BaseVM{
  cargoAgentId?: string;
  originAirportId?:string;
  destinationAirportId?:string;
  originAirportCode?:string;
  destinationAirportCode?:string;
  originAirportName?:string;
  destinationAirportName?:string;
  cargoAgentName?:string;
  agentRates?:AgentRate[];
}


