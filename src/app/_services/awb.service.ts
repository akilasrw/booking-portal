import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { AWBCreateRM } from '../_models/request-models/awb/awb-create-rm.model';

@Injectable({
  providedIn: 'root'
})
export class AWBService extends BaseService {

  private readonly endpointEntityName = 'awb';


  constructor(http: HttpClient) {
    super(http);
  }

  createAWB(awbRequest: AWBCreateRM){
    return this.post<any>(this.endpointEntityName, awbRequest);
  }
}
