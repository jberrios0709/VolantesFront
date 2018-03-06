import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';

@Injectable()
export class HttpService {

  url:String = "http://127.0.0.1/volantes/public/api/1.0/";

  constructor( public http:Http, public _auth:AuthService ) { }

  postRequest(uri:string, body){
    let headers = new Headers();
    headers.append("Authorization","Bearer"+this._auth.getTokem());
    return this.http.post(this.url+uri , body ,{headers})
              .map( 
                res=>{
                  return res.json();
                })
  }

  putRequest(uri:string, body){
    let headers = new Headers();
    headers.append("Authorization","Bearer"+this._auth.getTokem());
    return this.http.put(this.url+uri , body ,{headers})
              .map( 
                res=>{
                  return res.json();
                })
  }

  getRequest(uri:string){
    let headers = new Headers();
    headers.append("Authorization","Bearer"+this._auth.getTokem());
    return this.http.get(this.url+uri , {headers})
              .map( 
                res=>{
                  return res.json();
                })
  }

  deleteRequest(uri:string){
    let headers = new Headers();
    headers.append("Authorization","Bearer"+this._auth.getTokem());
    return this.http.delete(this.url+uri , {headers})
              .map( 
                res=>{
                  return res.json();
                })
  }

  postRequestNotToken(uri:string, body){
    return this.http.post(this.url+uri , body)
              .map( res=>{
                return res.json();
              })
  }

  refreshToken(){
    let headers = new Headers();
    headers.append("Authorization","Bearer"+this._auth.getTokem());
    return this.http.post(this.url+"refresh" , {} ,{headers})
              .map( 
                res=>{
                  this._auth.refreshToken(res.json());
                  return true;
                })
  }

}
