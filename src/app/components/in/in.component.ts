import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
@Component({
  selector: 'app-in',
  templateUrl: './in.component.html',
  styles: []
})
export class InComponent implements OnInit {
  ordersDebit:any[] = [];
  payments:any[] = [];
  desde:string;
  hasta:string;
  comment:string;
  constructor(public _http:HttpService) { }

  ngOnInit() {
    this._http.getRequest('orders?q=date&init=true').subscribe(
      (res)=>{    
        console.log(res);
            
        this.payments = res.data;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchsOrdersDate();
        }
      }
    )
  }

  url(){
    return this._http.getUrl()+'pdf/inForDate?desde='+this.desde+'&hasta='+this.hasta+'&comment='+this.comment;
  }

  payment(index){
    if(this.payments[index].abono){
      return this.payments[index].abono.mount;
    }else{
      return this.payments[index].trace;
    }
  }

  paymentWhere(index){
    if(this.payments[index].abono){
      return "Abono";
    }else{
      return "Seña";
    }
  }



  searchsOrdersDate(){
    if(this.desde != undefined && this.hasta != undefined){
      this._http.getRequest('orders?q=date&init=false&desde='+this.desde+'&hasta='+this.hasta).subscribe(
        (res)=>{
          this.payments = res.data;
        },
        (error)=>{
          if(this.verifyError(error.json())){        
            this.searchsOrdersDate();
          }
        }
      )
    }
  }

  verifyError(typeError){
    if(typeError.error = "token_expired"){
      this._http.refreshToken().subscribe(
        (res)=>{ 
          return true;
        }
      )
    }
  }


}
