import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  email:string;
  password:string;
  forma:FormGroup;
  errorInit:boolean =  false;
  errorServer:boolean =  false;
  sucess:boolean = false;
  request:boolean = false;

  constructor( public _http:HttpService, public _auth:AuthService, public router:Router) { 
    this.forma = new FormGroup({
      'email':new FormControl('',[Validators.required,Validators.email]),
      'password':new FormControl('',Validators.required)
    });
  }

  ngOnInit() {}

  login(){
    this.request = true;
    this._http.postRequestNotToken("auth",this.forma.value).subscribe(
      (data)=>{
        this.request = false;
        this._auth.setUser(data);  
        setTimeout(()=>{  this.router.navigate(['userAuthenticate/home']) }, 3000);
        this.sucess = true;
      },
      (error)=>{
        this.request = false;
        if(error.status === 401){
          this.errorInit = true;
        }else{
          this.errorServer = true;
        }
      }
    );    
  }

}
