import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {map} from'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken:any;
  user:any;

  constructor(private http:Http) { }

  registerUser(user){
    var body=JSON.stringify(user);
    let headers =new Headers();
    headers.append('Content-Type','application/json');


    return this.http.post('users/register',user,{headers:headers}).pipe(map(res=>res.json()));

  }
  authenticateUser(user){
    var body=JSON.stringify(user);
    let headers =new Headers();
    headers.append('Content-Type','application/json');
    console.log(user);
    return this.http.post('users/authenticate', user,{headers: headers}).pipe(map(res => res.json()));

  }
  getProfile(){
   let headers = new Headers();
   this.loadToken();
   headers.append('Authorization',this.authToken);
   headers.append('Content-Type','application/json');
   return this.http.get('users/profile',{headers: headers}).pipe(map(res => res.json()));
  }
  getJokes(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('jokes/see',{headers: headers}).pipe(map(res => res.json()));
  
  }
  storeUserData(token,user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;

  }
  loadToken(){
    const token= localStorage.getItem('id_token');
    this.authToken=token;
  }
  isLogged(){
    return localStorage.getItem('id_token') !== null;
  }
  /*isLoggedIn(){
    const token= localStorage.getItem('id_token');
    return !this.jwtHelper.isTokenExpired(token);
  }*/
  logout(){
    this.authToken = null;
    this.user=null;
    localStorage.clear();
  }
  
}
