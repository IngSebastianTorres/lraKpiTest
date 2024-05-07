import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { SwPush } from '@angular/service-worker';
import { PushNotificationServiceService } from './services/push-notification-service.service';
import { SecurityTokenService } from './services/security-token.service';
import { environment } from 'environments/environment';

//const miliSecondsToRefreshToken=120000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

   
    
    resultSubscription:any;

    constructor(public securityToken:SecurityTokenService,public location: Location, private swPush:SwPush, private pushNotificationService:PushNotificationServiceService) {
      this.subscribePushNotifications();
      
    }

    async subscribePushNotifications(){
      try {
        const sub = await this.swPush.requestSubscription({serverPublicKey:environment.VAPID_PUBLIC_KEY});
        let token = JSON.stringify(sub);
        console.log(token)
        let result = await this.pushNotificationService.saveToken(token);
      
      }catch(err){
        console.error("Error on subscribe notifications ", err);
      }
    }



    /*async subscribeNotifications (){
      
      try{
        
        const sub = await this.swPush.requestSubscription({serverPublicKey:this.VAPID_PUBLIC_KEY});
        const token = JSON.parse(JSON.stringify(sub));
        let result = await this.pushNotificationService.saveToken(token);
        
        console.log("TOKEN ", token);
        console.log("RESULT ", result);
      
      } catch(err){
          console.error("Error on subscribe notifications ", err);
      }

    }*/
    
    ngOnInit(){
     // this.subscribeChangesOfNotification();
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

    async generateTokenToServices(){
      var email = {email:'juancarlos.coronado@bbva.com'}
      try {
          let response = await this.securityToken.generateToken(email);
          localStorage.setItem('tokenServices',response.token);
          console.log(response);
      }catch (err){
          console.log(err);
      }
    }
}
