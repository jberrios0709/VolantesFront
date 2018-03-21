import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styles: []
})

export class DeliveryComponent implements OnInit {
  orders:any[] = [];
  order:any;
  show:boolean=false;
  forma:FormGroup;
  confirm:boolean = false;
  statusRequest:string = "not";

  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.createForma();
    this.searchOrders();
  }

  createForma(){
    this.forma = new FormGroup({
      "mount":new FormControl(0,Validators.required)
    });
  }

  createAbono(){
    this.statusRequest = "send";
    let id = this.order.id;
    this._http.postRequest("order/"+id+"/abonos",this.forma.value).subscribe(
      (res)=>{
        this.statusRequest = "good";
        this.orders = this.orders.filter((elem)=>{
          if(elem.id != id){
            return elem;
          }
        })
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.createAbono();
        }
        this.statusRequest = "error";
      }
    )
  }

  searchOrders(){
    this._http.getRequest('orders?q=5').subscribe(
      (res)=>{      
        this.orders = res.data;
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

  selectOrder(index){
    this.statusRequest = "not";    
    this.forma.reset({abono:''});
    this.confirm=false;
    this.show=true;
    this.order = this.orders[index];
  }

  calculate(option){
    let abonos = 0;
      for (let abono of this.order.abonos) {
        abonos+=abono.mount;
      }
    if(option == 1){
      return this.order.price_flyer + this.order.price_design + this.order.price_send - this.order.trace - abonos;
    }else if(option == 2){
      return this.order.price_flyer + this.order.price_design + this.order.price_send - this.order.trace - abonos - this.forma.value.mount
    }
  }

  calculateForIndex(index){
    let abonos = 0;
    for (let abono of this.orders[index].abonos) {
      abonos+=abono.mount;
    }
    return this.orders[index].price_flyer + this.orders[index].price_design + this.orders[index].price_send - this.orders[index].trace - abonos;
  }

}
