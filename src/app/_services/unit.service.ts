import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectList } from '../shared/models/select-list.model';
import { Unit } from '../_models/view-models/unit/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseService{

  private readonly endpointEntityName = 'unit';
  private readonly getListEndpoint: string = `${this.endpointEntityName}/getSelectList`;


  constructor(http: HttpClient) {
    super(http);
  }


  getUnitList() {
    return this.get<SelectList[]>(`${this.getListEndpoint}`);
  }

  getList() {
    return this.get<Unit[]>(`${this.endpointEntityName}`);
  }

}
