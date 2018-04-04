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
  spaces:number=0;
  orderFirstSelect:any=[];
  orderSecondSelect:any=[];

  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.searchOrders();
    this.searchFolios();
  }
  
  sendTaller(){
    if(this.show ==="confirm"){
      this.requestStatus="send";
      let body = {orders:this.bodySend()};
      this._http.postRequest("print", body).subscribe(
        (res)=>{
          this.requestStatus='good';
          this.searchOrders();
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

  selectOthers(index){
    this.requestStatus='not';
    this.objectShow = this.ordersOthers[index];
    this.show = "taller";
  }

  sendTallerOthers(){
      this.requestStatus="send";
      let body = {};
      this._http.postRequest("order/"+this.objectShow.id+"/taller", body).subscribe(
        (res)=>{
          this.requestStatus='good';
          this.searchOrders();
        },
        (error)=>{
          if(this.verifyError(error.json())){        
            this.sendTallerOthers();
          }
          this.requestStatus='error';
        }
      )
    
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

  select(index,type){
    this.requestStatus="not";
    if(type==="folio"){
      this.objectShow = this.folios[index];
      this.show = "folio";
    }else if(type==="confirm"){
      this.show = "confirm";
    }
  }

  searchOrders(){
    this._http.getRequest('orders?q=3').subscribe(
      (res)=>{
        this.ordersFirst = [];
        this.ordersSecond = [];
        this.ordersOthers = [];
        this.filterOrders(res.data);
        this.searchOrdersOtherTaller();
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchOrders();
        }
      }
    )
  }

  searchOrdersOtherTaller(){
    this._http.getRequest('orders?q=4').subscribe(
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
          this.orderFirstSelect.push({isDone:false,spaces:0});
        }else if(order.garnet == "150gr"){
          this.ordersSecond.push(order);
          this.orderSecondSelect.push({isDone:false,spaces:0});
        }else{
          this.ordersOthers.push(order);
        }
      }else{
        this.ordersOthers.push(order);
      }
    }
  }

  selects(array,index){
    if(array == 1){
      this.orderFirstSelect[index].isDone = !this.orderFirstSelect[index].isDone;
    }else if(array == 2){
      this.orderSecondSelect[index].isDone = !this.orderSecondSelect[index].isDone;
    }
    this.countSpaces();
  }

  addSpaces(array,index,event){
    if(array == 1){
      this.orderFirstSelect[index].spaces = event.target.value;
    }else if(array == 2){
      this.orderSecondSelect[index].spaces = event.target.value;
    }
    this.countSpaces();
  }

  countSpaces(){
    let spaces = 0;
    this.orderFirstSelect.map((elem)=>{
      if(elem.isDone){
        spaces = spaces + parseInt(elem.spaces);
      }
    })
    this.orderSecondSelect.map((elem)=>{
      if(elem.isDone){    
        spaces = spaces + parseInt(elem.spaces);
      }
    })
    this.spaces = spaces;
  }

  bodySend(){
    let body = [];
    this.orderFirstSelect.map((elem,index)=>{
      if(elem.isDone){
        body.push({
          order_id: this.ordersFirst[index].id,
          spaces: elem.spaces
        })
      }
    })
    this.orderSecondSelect.map((elem,index)=>{
      if(elem.isDone){    
        body.push({
          order_id: this.ordersSecond[index].id,
          spaces: elem.spaces
        })
      }
    })
    return body;
  }

  test(){
    console.log(this.ordersOthers);
    
  }

}
