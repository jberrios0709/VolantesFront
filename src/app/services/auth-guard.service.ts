import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(public _auth:AuthService, public router:Router) { }

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    if(this._auth.isAuthenticated()){
      return true;
    }else{
      this.router.navigate(['/']);
      return false;
    }
  }
}
