import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // IMportacion de http client , no todo el httpclientmodule porque no necesito toda la utileria de todo el modulo
import { firstValueFrom } from 'rxjs';

import { HttpBackendResponse } from 'app/model/http-backend-response';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  private baseUrl:string;
  private baseUrlLocalJson:string;

  constructor(private httpClient:HttpClient) {
    this.baseUrl= "http://devosfernando.com:38900/api/1/";
    this.baseUrlLocalJson="https://ingsebastiantorres.github.io/lraKpiTest/dataKPIGeneralProd.json";
  }


   async getCurrentDayKpi():Promise<HttpBackendResponse>{
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
      }) 
    }  
    let response: HttpBackendResponse = new HttpBackendResponse(); 
    response = await firstValueFrom(this.httpClient.get<HttpBackendResponse>(this.baseUrlLocalJson, headers));
    if(response.status==200){
      return response;
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


}
