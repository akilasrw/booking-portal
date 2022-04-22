import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectList } from '../shared/models/select-list.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService {

  private readonly endpointEntityName = 'country';

  constructor(http: HttpClient) {
    super(http);
   }

  getCountryList() {
    return this.get<SelectList[]>(`${this.endpointEntityName}`);
  }
}
