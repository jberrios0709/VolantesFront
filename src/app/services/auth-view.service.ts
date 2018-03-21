import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthViewService {

  constructor(public _auth:AuthService, public router:Router) { }

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    if(this.permits(next.routeConfig.path,this._auth.typeUser())){
      return true;
    }else{
      this.router.navigate(['userAuthenticate/home']);
      return false;
    }
  }

  permits(path, typeUser){
    switch(path) {
      case "userAuthenticate/users":
          if(typeUser === "1"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/prices":
          if(typeUser === "1"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/CF":
          if(typeUser === "1" || typeUser === "4"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/order":
          if(typeUser === "3"){
            this.router.navigate(['userAuthenticate/order/new']);
            return true;
          }else if(typeUser === "1" || typeUser === "4"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/order/old":
          if(typeUser === "1" || typeUser === "4"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/order/new":
          if(typeUser === "1" || typeUser === "4" || typeUser === "3"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/design":
          if(typeUser === "1" || typeUser === "2"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/print":
          if(typeUser === "1"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/delivery":
          if(typeUser === "1" || typeUser === "5"){
            return true;
          }else{
            return false;
          }
      case "userAuthenticate/in":
          if(typeUser === "1"){
            return true;
          }else{
            return false;
          }
      default:
          return false;
    }
  }

}
