import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // IMportacion de http client , no todo el httpclientmodule porque no necesito toda la utileria de todo el modulo
import { firstValueFrom } from 'rxjs';
import { KpiCurrentDay } from 'app/model/kpi-current-day';
import { HttpBackendResponse } from 'app/model/http-backend-response';
import Swal from 'sweetalert2';
import { KpiYear } from 'app/model/kpi-year';
@Injectable({
  providedIn: 'root'
})
export class KpiOnlineService {

  private baseUrl:string;

  constructor(private httpClient:HttpClient) {
    this.baseUrl= "http://devosfernando.com:38900/api/1/";
  }


   async getCurrentDayKpi():Promise<KpiCurrentDay[]>{
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('tokenServices')
      }) 
    }  
    let response: HttpBackendResponse = new HttpBackendResponse(); 
    response = await firstValueFrom(this.httpClient.get<HttpBackendResponse>(this.baseUrl+"kpi/prevMonht/kpi", headers));
    if(response.status==200){
      return response.response;
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Fallo consultando el KPI del día Actual',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
         return null;
      })
    }
  }

  async getKpiYear():Promise<KpiYear[]>{
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('tokenServices')
      }) 
    }  
    let response: HttpBackendResponse = new HttpBackendResponse(); 
    response = await firstValueFrom(this.httpClient.get<HttpBackendResponse>(this.baseUrl+"kpi/year", headers));
    if(response.status==200){
      return response.response;
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Falla consultando el KPI mensual',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
         return null;
      })
    }
    
  }
}
