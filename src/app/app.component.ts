import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { SwPush } from '@angular/service-worker';
import { PushNotificationServiceService } from './services/push-notification-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public readonly VAPID_PUBLIC_KEY= 'BH97zDze6zTrxxcPzjzT8NQpQD8jNuvK_r9xy04vjzgEkfmMsYjUOo9xbMznD1MXc3BzO32JXvDPwhucI_COtJU';
    resultSubscription:any;

    constructor(public location: Location, private swPush:SwPush, private pushNotificationService:PushNotificationServiceService) {
      this.subscribeNotifications();
    }


    async subscribeNotifications (){
      
      try{
        
        const sub = await this.swPush.requestSubscription({serverPublicKey:this.VAPID_PUBLIC_KEY});
        const token = JSON.parse(JSON.stringify(sub));
        let result = await this.pushNotificationService.saveToken(token);
        
        console.log("TOKEN ", token);
        console.log("RESULT ", result);
      
      } catch(err){
          console.error("Error on subscribe notifications ", err);
      }

    }
    
  /*  subscribeNotifications():any{
      this.swPush.requestSubscription({
        serverPublicKey:this.VAPID_PUBLIC_KEY
      }).then(sub => {
         this.pushNotificationService.saveToken(token).subscribe(()=>{

         })
      })
    }*/

    ngOnInit(){
    }

    isMap(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }
}
