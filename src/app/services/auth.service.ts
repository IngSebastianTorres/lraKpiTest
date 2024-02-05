import { Injectable } from '@angular/core';
import {Auth, GoogleAuthProvider, signInWithPopup, signOut} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth:Auth) { }

  public loginWithGoogle(){
    return signInWithPopup(this.auth,new GoogleAuthProvider());
  }

  public logout(){
    return signOut(this.auth);
  }
}
