import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AdminUser } from '../_models/accountmanage';
import {updatePassword} from '../_models/updatePassword';
import { updateAccount } from '../_models/updateAccount';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:7167/api/';

  private CurrentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.CurrentUserSource.asObservable();
  constructor( private httpClient : HttpClient) { }

  login(model: any) {
    return this.httpClient.post<User>(this.baseUrl + 'account/Login', model).pipe(
      map((response: any)=> {
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user))
          const helper = new JwtHelperService()
          const decodedToken = helper.decodeToken(user.token)
        const role_claim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        const role = decodedToken[role_claim]
          localStorage.setItem('role', role)
          this.CurrentUserSource.next(user)
        }
      }))
    }
    
  

  logout(){
    this.CurrentUserSource.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
   
  }

}
