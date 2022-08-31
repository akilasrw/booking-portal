import { BaseQuery } from './../../../shared/models/base-query.model';

export class CargoAgentQuery extends BaseQuery{
  appUserId?:string;
  isCountryInclude?:boolean;
}
