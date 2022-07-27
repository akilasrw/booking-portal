import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Validate } from '../shared/models/validate.model';
import { ValidateCargoPositionRequest } from '../_models/request-models/cargo-booking/validate-cargo-position-request.model';

@Injectable({
  providedIn: 'root'
})

export class UldCargoPositionService extends BaseService{

  private readonly endpointEntityName = 'ULDCargoPosition';
  private readonly validateEndpoint = `${this.endpointEntityName}/Validate`;

  constructor(http: HttpClient) {
    super(http);
  }

  validateWeightAndVolume(validateRequest : ValidateCargoPositionRequest){
    return  this.post<Validate>(this.validateEndpoint, validateRequest);
  }
  
}
