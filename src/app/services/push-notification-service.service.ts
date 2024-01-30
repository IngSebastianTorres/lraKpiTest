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

  public url ='https://71f5-191-104-174-57.ngrok-free.app';

  constructor( private http:HttpClient) { 

  }


  async saveToken(token):Promise<any>{
    let body = { token }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }
    return await firstValueFrom(this.http.post<any>(this.url+"/save", body, httpOptions ));
  }

/*  saveToken = (token) => {
    return this.http.post( this.url+"/save", 
      body:{
        token
      }
    );
  };*/
}
