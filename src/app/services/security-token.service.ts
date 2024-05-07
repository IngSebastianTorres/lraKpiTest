import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SecurityTokenService {

  private baseUrl:string;
  private body:{email:string}

  constructor(private httpClient:HttpClient) { 
    this.baseUrl=  'http://devosfernando.com:38900/api/1/';
  }

  async generateToken({email}):Promise<any>{
    this.body = {email}; 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
      })   
  }
    return await firstValueFrom(this.httpClient.post<any>(this.baseUrl+'auth/securityToken', this.body, httpOptions))
  }
}
