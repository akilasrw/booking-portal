import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { PackageContainerListQuery } from '../_models/queries/package-container/package-container-list-query.model';
import { PackageContainer } from '../_models/view-models/package-container/package-container.model';

@Injectable({
  providedIn: 'root'
})
export class PackageContainerService extends BaseService {

  private readonly endpointEntityName = 'packageContainer';
  private readonly getFilteredListEndpoint: string = `${this.endpointEntityName}/getFilteredList`;
  private readonly getListEndpoint: string = `${this.endpointEntityName}/getList`;


  constructor(http: HttpClient) {
    super(http);
  }

  getList(query: PackageContainerListQuery) {
    var params = new HttpParams();
    if (query.packageItemType) {
      params = params.append("packageItemCategory", Number(query.packageItemType));
    }

    return this.getWithParams<PackageContainer[]>(this.getListEndpoint, params);
  }


}
