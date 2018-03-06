import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styles: []
})
export class PrintComponent implements OnInit {

  ordersFirst:any[] = []; //115gr
  ordersSecond:any[] = []; //150gr
  ordersOthers:any[] = []; //Otros

  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.searchOrders();
  }

  searchOrders(){
    this._http.getRequest('orders?q=3').subscribe(
      (res)=>{
        this.filterOrders(res.data);
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchOrders();
        }
      }
    )
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

  filterOrders(orders){
    for (let order of orders) {
      if(order.product === "Volantes")
        if(order.garnet === "115gr"){
          this.ordersFirst.push(order);
        }else if(order.garnet === "150gr"){
          this.ordersSecond.push(order);
        }
      else{
        this.ordersOthers.push(order);
      }
    }
  }

}
