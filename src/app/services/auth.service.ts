import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { HttpService } from './http.service';

@Injectable()
export class AuthService {

  constructor() { }

  isAuthenticated(){
    if(localStorage.getItem("token")){
      return true;
    }else{
      return false;
    };
  }

  setUser(data){
     localStorage.setItem("token",data.token);
     localStorage.setItem("username",data.user.name);
     localStorage.setItem("type",data.user.type);
  }

  refreshToken(data){
    localStorage.setItem("token",data.token);
 }

  removeUser(){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("type");
  }

  typeUser(){
    let type =  localStorage.getItem("type");
    return type;
  }

  username(){
    let username =  localStorage.getItem("username");
    return username;
  }

  getTokem(){
    let type = "Bearer "+localStorage.getItem("token");
    return type;
  }

}
