import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { InfouserService } from 'app/services/infouser.service';
import { InfoUser } from 'app/model/info-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email:string;
  public profilePhotoUrl:string;
  infoUser:InfoUser;

  constructor(private authService:AuthService , private router:Router, private infoUserService:InfouserService ) { }

  ngOnInit(): void {
    
    
  }
  
  async onClick(){
    try {
     let response= await this.authService.loginWithGoogle();
     var isBBVAEmail= response.user.email.search("^[\\w-\\.]+@(bbva)+(.com)") != -1 ? true : false;
     console.log(response);
     if(isBBVAEmail){
     
      this.email=response.user.email;
      this.profilePhotoUrl=response.user.photoURL
      this.infoUser = new InfoUser(this.email, this.profilePhotoUrl);
      
      Swal.fire({
        title: '¡Bienvenido!',
        text: 'LRA Colombia',
        icon: 'success',
        confirmButtonText: 'Ir'
      }).then(()=>{
        this.router.navigate(['/summaryReport']) 
        this.infoUserService.setUserInfo(this.infoUser);
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
