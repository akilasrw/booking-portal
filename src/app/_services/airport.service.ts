import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { SelectList } from '../shared/models/select-list.model';

@Injectable({
  providedIn: 'root'
})
export class AirportService extends BaseService {

  private readonly endpointEntityName = 'airport';

  constructor(http: HttpClient) {
    super(http);
  }

  getSelectList(){
    return this.get<SelectList[]>(`${this.endpointEntityName}/getSelectList`);
  }
}
