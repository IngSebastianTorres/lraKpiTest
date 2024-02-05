import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService , private router:Router) { }

  ngOnInit(): void {

  }

  async onClick(){
    try {
     let response= await this.authService.loginWithGoogle();
     this.router.navigate(['/summaryReport'])
     console.log("Login ", response)
    } catch(err){
      console.error(err);
    }
    
  }

}
