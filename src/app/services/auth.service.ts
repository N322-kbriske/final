import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: any = {};
  public backupUser: any = {};

  constructor(private auth: Auth) {}

  // create a user
  async register({ email, password }: any) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      // console.log(e.message);
      return null;
    }
  }

  // log in a user
  async login({ email, password }: any) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      // console.log(e.message);
      return null;
    }
  }

  logOut() {
    return signOut(this.auth);
  }
}
