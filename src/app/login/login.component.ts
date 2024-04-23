import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { InfouserService } from 'app/services/infouser.service';
import { InfoUser } from 'app/model/info-user';
import { SwPush } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { PushNotificationServiceService } from 'app/services/push-notification-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email:string;
  public profilePhotoUrl:string;
  infoUser:InfoUser;

  constructor(private authService:AuthService , private router:Router, private infoUserService:InfouserService,private swPush:SwPush , private pushNotificationService:PushNotificationServiceService) { }

  ngOnInit(): void {
    
    
  }
  
  async onClick(){
    try {
     let response= await this.authService.loginWithGoogle();
     var isBBVAEmail= response.user.email.search("^[\\w-\\.]+@(bbva)+(.com)") != -1 ? true : false;
     if(isBBVAEmail){
     
      this.email=response.user.email;
      this.profilePhotoUrl=response.user.photoURL
      this.infoUser = new InfoUser(this.email, this.profilePhotoUrl);
      
      const sub = await this.swPush.requestSubscription({serverPublicKey:environment.VAPID_PUBLIC_KEY});
      let token = JSON.stringify(sub);
      const regularExpression = /[}]$/g

      let bodyToSend= token.replace(regularExpression,',"userId":'+'"'+this.email+'"'+" }")
      console.log(bodyToSend)
      let body = JSON.parse(token);
      console.log(body)
      let result = await this.pushNotificationService.verifyToken(token);
      result = 

      Swal.fire({
        title: '¡Bienvenid@!',
        text: response.user.displayName,
        icon: 'success',
        confirmButtonText: 'Ir'
      }).then(()=>{
        this.router.navigate(['/summaryReport']) 
        this.infoUserService.setUserInfo(this.infoUser);
        //localStorage.setItem('isAuthenticated','true');
      }).catch(error=> {
         console.error(error)
      });
     } else {
      this.logout();
     }
    } catch(err){
      console.error(err);
    }
    
  }

  logout():void{
    this.authService.logout();
  }

}
