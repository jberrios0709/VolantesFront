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
  showSearch:boolean=false;
  forma:FormGroup;
  confirm:boolean = false;
  statusRequest:string = "not";
  ordersDebit:any[] = [];
  numberSearch:any;
  empty:boolean = false;

  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.createForma();
    this.searchAll();
  }

  modalSearch(){
    this.showSearch = true;
    this.show = false;
  }

  searchAll(){
    this.searchOrders();
    this.searchsOrdersDebit();
  }

  searchOrder(){
    this._http.getRequest("order/"+this.numberSearch).subscribe(
      (res)=>{
        if(res.data != null){
          this.selectOrder(0,res.data)
        }else{
          this.empty = true;
        }
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchOrder();
        }
      }
    )
  }

  createForma(){
    this.forma = new FormGroup({
      "mount":new FormControl(0)
    });

    this.forma.controls['mount'].setValidators([
      Validators.required,
      Validators.pattern(/^([0-9])*$/),
      this.mountValidity.bind(this)
    ]);
  }

  mountValidity(control: FormControl):{[s:string]:boolean}{
    let $this:any = this;
    if($this.show){
      if(control.value <= 0 || control.value >= $this.calculate(1)){
        return{
         noQuantity:true
        }
      }
    }
    return null;
  }

  createAbono(){
    this.statusRequest = "send";
    let id = this.order.id;
    this._http.postRequest("order/"+id+"/abonos",this.forma.value).subscribe(
      (res)=>{
        this.statusRequest = "good";
        this.searchAll();
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

  selectOrder(index, type){
    this.statusRequest = "not";    
    this.forma.reset({abono:''});
    this.confirm=false;
    this.show=true;
    this.showSearch=false;
    if(type == "normal"){
      this.order = this.orders[index];
    }else if(type == "debit"){
      this.order = this.ordersDebit[index];
    }else{
      this.order = type;
    }
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

  calculateForIndex(index,option){
    let abonos = 0;
    if(option == "normal"){
      for (let abono of this.orders[index].abonos) {
        abonos+=abono.mount;
      }
      return this.orders[index].price_flyer + this.orders[index].price_design + this.orders[index].price_send - this.orders[index].trace - abonos;
      
    }else if(option == "debit"){
      for (let abono of this.ordersDebit[index].abonos) {
        abonos+=abono.mount;
      }
    }
    return this.ordersDebit[index].price_flyer + this.ordersDebit[index].price_design + this.ordersDebit[index].price_send - this.ordersDebit[index].trace - abonos;
    
  }

  calculateTotal(index){
    let total = 0;
    this.ordersDebit.map((elem,index)=>{
      total += this.calculateForIndex(index,"debit");
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

  searchsOrdersDebit(){
    this._http.getRequest('orders?q=7').subscribe(
      (res)=>{
        console.log(res.data)
        this.ordersDebit = res.data;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchsOrdersDebit();
        }
      }
    )
  }


}
