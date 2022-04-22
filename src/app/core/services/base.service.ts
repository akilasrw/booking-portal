import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private baseEndpoint = environment.baseEndpoint;

  constructor(protected http: HttpClient) { }

  protected getRequestHeaders(): { headers: HttpHeaders } {
    let headerList = new HttpHeaders({ 'Content-Type': 'application/json' });
    headerList = headerList.append('Cache-Control', 'no-cache');
    headerList = headerList.append("Access-Control-Allow-Origin", "*")
    headerList = headerList.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    headerList = headerList.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    return { headers: headerList };
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  protected get<T>(endpointUrl: string): Observable<T> {
    return this.http.get<T>(`${this.baseEndpoint}${endpointUrl}`, this.getRequestHeaders());
  }

  protected getWithParams<T>(endpointUrl: string, params: HttpParams): Observable<T> {
    const options = {
      'headers': this.getRequestHeaders().headers,
      'params': params
    }
    return this.http.get<T>(`${this.baseEndpoint}${endpointUrl}`, options);
  }

  protected put<T>(endpointUrl: string, object: any): Observable<T> {
    return this.http.put<T>(`${this.baseEndpoint}${endpointUrl}`, JSON.stringify(object), this.getRequestHeaders());
  }

  protected post<T>(endpointUrl: string, object: any): Observable<T> {
    return this.http.post<T>(`${this.baseEndpoint}${endpointUrl}`, JSON.stringify(object), this.getRequestHeaders());
  }

  protected postWithFormData<T>(endpointUrl: string, object: any): Observable<T> {
    let headerList = new HttpHeaders();
    headerList = headerList.append('Cache-Control', 'no-cache');
    headerList = headerList.append('reportProgress', "true");
    headerList = headerList.append('observe','events');

    return this.http.post<T>(`${this.baseEndpoint}${endpointUrl}`, object, {headers: headerList});
  }

  protected delete<T>(endpointUrl: string, object: any): Observable<T> {
    const options = {
      headers: this.getRequestHeaders().headers,
      body: object
    }
    return this.http.delete<T>(`${this.baseEndpoint}${endpointUrl}`, options);
  }
}
