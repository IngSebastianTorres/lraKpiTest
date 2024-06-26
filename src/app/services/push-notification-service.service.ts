import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/* 
 Servicio que se encarga de enviar el token de autenticación para las notificaciones PUSH contra el backend donde esta alojado
*/
@Injectable({
  providedIn: 'root'
})
export class PushNotificationServiceService {

  public url ='https://marmoset-select-barnacle.ngrok-free.app';

  constructor( private http:HttpClient) { 

  }


  async saveToken(token):Promise<any>{
    let body = { token }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }
    return await firstValueFrom(this.http.post<any>(this.url+"/save/", body, httpOptions ));
  }

  async verifyToken(token):Promise<any>{
    let body = { token }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }
    return null;
  }

}
