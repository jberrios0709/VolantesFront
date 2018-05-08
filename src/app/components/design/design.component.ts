import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { InfoSharedService } from '../../services/info-shared.service';


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styles: []
})
export class DesignComponent implements OnInit {

  request:string="false";
  orders:any[] = [];
  order:any;
  orderSelect:boolean = false;
  forma:FormGroup;
  indexSelect:number;
  selects:any[] = [{"value":0,"text":"No"},{"value":1,"text":"Si"}];
  
  constructor(public _http:HttpService, public _infoShared:InfoSharedService) { }

  ngOnInit() {
    this.searchOrders();
    this.initForma();
  }

  initForma(){
    this.forma = new FormGroup({
      "design": new FormControl(0,Validators.required),
      "send1": new FormControl(0,Validators.required),
      "correction1": new FormControl(0,Validators.required),
      "send2": new FormControl(0,Validators.required),
      "correction2": new FormControl(0,Validators.required),
      "send3": new FormControl(0,Validators.required),
      "correction3": new FormControl(0,Validators.required),
      "send4": new FormControl(0,Validators.required),
      "correction4": new FormControl(0,Validators.required),
      "send5": new FormControl(0,Validators.required),
      "correction5": new FormControl(0,Validators.required),
      "approved": new FormControl(0,Validators.required),
      "finish": new FormControl(0,Validators.required),
      "responsibility": new FormControl(0,Validators.required)
    })
  }

  searchOrders(){
    this._http.getRequest('orders?q=2').subscribe(
      (res)=>{
        let data = []
        res.data.map((elem)=>{
          if(elem.date_delivery != null){
            this.orders.push(elem);
          }else{
            data.push(elem)
          }
        });
        this.orderArray(data).map((elem)=>{
          this.orders.push(elem);
        })
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchOrders();
        }
      }
    )
  }

  parseSides(value){
    return this._infoShared.parseSides(parseInt(value));
  }

  orderArray(tmp){
    return tmp.sort((a,b)=>{
      if (a.id > b.id) {
        return 1;
      }else if (a.id < b.id) {
        return -1;
      }
    })
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

  parseDesign(value){
    return this._infoShared.parseDesign(parseInt(value));
  }

  selectOrder(index){
    this.order = this.orders[index];
    this.orderSelect = true;
    this.indexSelect = index;
    this.request = "false";
    
    this.forma = new FormGroup({
      "design": new FormControl(this.order.status_design.design,Validators.required),
      "send1": new FormControl(this.order.status_design.send1,Validators.required),
      "correction1": new FormControl(this.order.status_design.correction1,Validators.required),
      "send2": new FormControl(this.order.status_design.send2,Validators.required),
      "correction2": new FormControl(this.order.status_design.correction2,Validators.required),
      "send3": new FormControl(this.order.status_design.send3,Validators.required),
      "correction3": new FormControl(this.order.status_design.correction3,Validators.required),
      "send4": new FormControl(this.order.status_design.send4,Validators.required),
      "correction4": new FormControl(this.order.status_design.correction4,Validators.required),
      "send5": new FormControl(this.order.status_design.send5,Validators.required),
      "correction5": new FormControl(this.order.status_design.correction5,Validators.required),
      "approved": new FormControl(this.order.status_design.approved,Validators.required),
      "finish": new FormControl(this.order.status_design.finish,Validators.required),
      "responsibility": new FormControl(this.order.status_design.responsibility,Validators.required)
    })
  }

  update(){
    this.request="send";
    this.parseForma();
    this._http.postRequest('order/'+this.order["id"]+'/design',this.forma.value).subscribe(
      (res)=>{      
        if(res.statusOrder === 2){
          this.orders[this.indexSelect].status_design=res.data;
          this.request="good";        
        }else{
          this.orders = this.orders.filter((elem)=>{
            if(elem.id!=this.order["id"]){
              return elem;
            }
          });
          this.request="next";   
          this.initForma();     
        }
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.update();
        }else{
          this.request="error";
        }
      }
    )
  }

  parseForma(){
    this.forma.value.design = parseInt(this.forma.value.design);
    this.forma.value.send1 = parseInt(this.forma.value.send1);
    this.forma.value.send2 = parseInt(this.forma.value.send2);
    this.forma.value.send3 = parseInt(this.forma.value.send3);
    this.forma.value.send4 = parseInt(this.forma.value.send4);
    this.forma.value.send5 = parseInt(this.forma.value.send5);
    this.forma.value.correction1 = parseInt(this.forma.value.correction1);
    this.forma.value.correction2 = parseInt(this.forma.value.correction2);
    this.forma.value.correction3 = parseInt(this.forma.value.correction3);
    this.forma.value.correction4 = parseInt(this.forma.value.correction4);
    this.forma.value.correction5 = parseInt(this.forma.value.correction5);
    this.forma.value.approved = parseInt(this.forma.value.approved);
    this.forma.value.finish = parseInt(this.forma.value.finish);
    this.forma.value.responsibility = parseInt(this.forma.value.responsibility);
  }

  showButton(){
    if(this.forma.value.finish == 1 && this.forma.value.responsibility == 1){
      return true;
    }
    return false;
  }
}
