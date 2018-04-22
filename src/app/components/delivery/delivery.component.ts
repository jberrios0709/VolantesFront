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
  delivery:boolean=false;
  showSearch:boolean=false;
  forma:FormGroup;
  confirm:boolean = false;
  statusRequest:string = "not";
  ordersDebit:any[] = [];
  numberSearch:any;
  empty:boolean = false;
  showAbono:boolean = false;

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
          console.log(res.data)
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
      "mount":new FormControl(0),
      "method_payment":new FormControl('',Validators.required)
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
      if(control.value <= 0 || control.value > $this.calculate(1)){
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
    this._http.postRequest("order/"+id+"/abonos",{mount:this.forma.value.mount,method_payment:this.forma.value.method_payment,delivery:this.delivery}).subscribe(
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
    this.showAbono = false;
    if(type == "normal"){
      this.order = this.orders[index];
      this.delivery = true;
    }else if(type == "debit"){
      this.order = this.ordersDebit[index];
      this.delivery = false;
    }else{
      this.showAbono = true;
      this.order = type;
    }
  }

  calculateTotalShow(){
    return parseFloat(this.order.price_design) + parseFloat(this.order.price_flyer) + parseFloat(this.order.price_send);
  }

  parseSides(value){
    switch(parseInt(value)){
      case 1: return "Un solo lado";
      case 2: return "Dos lados diferentes" ;
      case 3: return "Dos lados iguales";
    }
  }

  calculate(option){
    let abonos = 0;
      for (let abono of this.order.abonos) {
        abonos+=parseFloat(abono.mount);
      }
    if(option == 1){
      return parseFloat(this.order.price_flyer) + parseFloat(this.order.price_design) + parseFloat(this.order.price_send) - parseFloat(this.order.trace) - abonos;
    }else if(option == 2){
      return parseFloat(this.order.price_flyer) + parseFloat(this.order.price_design) + parseFloat(this.order.price_send) - parseFloat(this.order.trace) - abonos - parseFloat(this.forma.value.mount)
    }
  }

  calculateForIndex(index,option){
    let abonos = 0;
    if(option == "normal"){
      for (let abono of this.orders[index].abonos) {
        abonos+=parseFloat(abono.mount);
      }
      return parseFloat(this.orders[index].price_flyer) + parseFloat(this.orders[index].price_design) + parseFloat(this.orders[index].price_send) - parseFloat(this.orders[index].trace) - abonos;
      
    }else if(option == "debit"){
      for (let abono of this.ordersDebit[index].abonos) {
        abonos+=parseFloat(abono.mount);
      }
    }
    return parseFloat(this.ordersDebit[index].price_flyer) + parseFloat(this.ordersDebit[index].price_design) + parseFloat(this.ordersDebit[index].price_send) - parseFloat(this.ordersDebit[index].trace) - abonos;
    
  }

  calculateTotal(){
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
