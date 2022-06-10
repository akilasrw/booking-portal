import { AWBCreateRM } from './../_models/request-models/awb/awb-create-rm.model';
import { BaseService } from './../core/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AwbService extends BaseService {

  private readonly endpointEntityName = 'AWB';

  constructor(http:HttpClient) { 
    super(http)
  }
  
  create(awbCreateRM: AWBCreateRM){
    return this.post<any>(this.endpointEntityName, awbCreateRM);
  }

  update(awbUpdateRM: AWBCreateRM){
    return this.put<any>(this.endpointEntityName,awbUpdateRM);
  }
  
}
