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
  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.searchsOrdersDebit();
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

  searchsOrdersDebit(){
    this._http.getRequest('orders?q=7').subscribe(
      (res)=>{
        this.ordersDebit = res.data;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchsOrdersDebit();
        }
      }
    )
  }

  searchsOrdersDate(){
    if(this.desde != undefined && this.hasta != undefined){
      this._http.getRequest('orders?q=date&desde='+this.desde+'&hasta='+this.hasta).subscribe(
        (res)=>{
          this.payments = res.data;
        },
        (error)=>{
          if(this.verifyError(error.json())){        
            this.searchsOrdersDebit();
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

  calculateForIndex(index){
    let abonos = 0;
    for (let abono of this.ordersDebit[index].abonos) {
      abonos+=abono.mount;
    }
    return this.ordersDebit[index].price_flyer + this.ordersDebit[index].price_design + this.ordersDebit[index].price_send - this.ordersDebit[index].trace - abonos;
  }

  calculateTotal(index){
    let total = 0;
    this.ordersDebit.map((elem,index)=>{
      total += this.calculateForIndex(index);
    })
    return total;
  }

  calculateClientsDebit(){
    let clients = [];
    this.ordersDebit.map((elem)=>{
      clients.push(elem.branch.client.id);
    })
    return clients.length;
  }
}
