import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  typeUser:string;

  constructor(public _auth:AuthService, public router:Router) { }

  ngOnInit() {
    this.typeUser = this._auth.typeUser();
    
  }

  logout(){
    this._auth.removeUser();
    this.router.navigate(['/']);
  }

}
