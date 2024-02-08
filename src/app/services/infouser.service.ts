

import { Injectable } from '@angular/core';
import { InfoUser } from 'app/model/info-user';
import { ReplaySubject } from 'rxjs';
@Injectable()

export class InfouserService {

  private dataSubject: ReplaySubject<InfoUser> = new ReplaySubject<InfoUser>();
  dataObserver= this.dataSubject.asObservable();

  constructor() {   
   
  }

  getInfoUser():any{
    //return this.infoUser;
  }

  setUserInfo(infoUser:InfoUser):void{
    this.dataSubject.next(infoUser);
  }
  
  
}
