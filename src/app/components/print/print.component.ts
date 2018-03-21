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
  folios:any[] = [];
  objectShow:any;
  show:string;
  requestStatus:string="not";

  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.searchOrders();
    this.searchFolios();
  }
  
  sendTaller(){
    if(this.show ==="order"){
      this.requestStatus="send";
      let body = {order_id:this.objectShow.id};
      this._http.postRequest("print", body).subscribe(
        (res)=>{
          this.requestStatus='good';
          this.deleteOrder();
          this.searchFolios();
        },
        (error)=>{
          if(this.verifyError(error.json())){        
            this.jobPrint();
          }
          this.requestStatus='error';
        }
      )
    }
  }

  jobPrint(){
    if(this.show ==="folio"){
      this.requestStatus="send";
      this._http.putRequest("print/"+this.objectShow.id , {}).subscribe(
        (res)=>{
          this.requestStatus='good';
          this.deleteFolio();
        },
        (error)=>{
          if(this.verifyError(error.json())){        
            this.jobPrint();
          }
          this.requestStatus='error';
        }
      )
    }
  }

  deleteFolio(){
    this.folios =  this.folios.filter((elem)=>{
        if(elem.id != this.objectShow.id){
          return elem;
        }
    })
  }

  deleteOrder(){
    if(this.objectShow.garnet === "115gr"){
      this.ordersFirst =  this.ordersFirst.filter((elem)=>{
        if(elem.id != this.objectShow.id){
          return elem;
        }
      })
    }else if(this.objectShow.garnet === "150gr"){
      this.ordersSecond =  this.ordersSecond.filter((elem)=>{
        if(elem.id != this.objectShow.id){
          return elem;
        }
      })
    }
  }

  select(index,type,orderType){
    this.requestStatus="not";
    if(type==="folio"){
      this.objectShow = this.folios[index];
      this.show = "folio";
    }else if(type==="order"){
      if(orderType == 1){
        this.objectShow = this.ordersFirst[index];
      }else if(orderType == 2){
        this.objectShow = this.ordersSecond[index];
      }else if(orderType == 3){
        this.objectShow = this.ordersOthers[index];
      }
      this.show = "order";
    }
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

  searchFolios(){
    this._http.getRequest('print').subscribe(
      (res)=>{
        this.folios = res.data;
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
      if(order.product == "Volantes"){
        if(order.garnet == "115gr"){
          this.ordersFirst.push(order);
        }else if(order.garnet == "150gr"){
          this.ordersSecond.push(order);
        }
      }else{
        this.ordersOthers.push(order);
      }
    }
  }

}
