import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { InfoSharedService } from '../../services/info-shared.service';

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
  spacesTotal:number = 10;

  constructor(public _http:HttpService, public _infoShared:InfoSharedService) { }

  ngOnInit() {
    this.searchAndOrderData();
    this.searchFolios();
  }

  searchAndOrderData(){
    this.ordersFirst = [];
    this.ordersSecond = [];
    this.ordersOthers = [];
    let promise = new Promise((resolve, reject)=>{           
      if(this.searchOrders()){
        resolve(true);
      }
    })

    let promise2 = new Promise((resolve, reject)=>{           
      if(this.searchOrdersOtherTaller()){
        resolve(true);
      }
    })


    promise2.then((data)=>{      
      promise.then((data)=>{       
        this.ordersFirst = this.orderArray(this.ordersFirst);
        this.ordersSecond = this.orderArray(this.ordersSecond);
        this.ordersOthers = this.orderArray(this.ordersOthers);
      })
    })
  }
  
  sendTaller(){
    if(this.show ==="confirm"){
      this.requestStatus="send";
      let body = {orders:this.bodySend()};
      this._http.postRequest("print", body).subscribe(
        (res)=>{
          this.requestStatus='good';
          this.searchAndOrderData();
          this.searchFolios();
          this.spaces = 0;
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
          this.searchAndOrderData();
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
          this.searchAndOrderData();
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

  select(select,type){
    this.requestStatus="not";
    if(type==="folio"){
      this.objectShow = this.folios[select];
      this.show = "folio";
    }else if(type==="confirm"){
      this.show = "confirm";
    }else if(type==="view"){
      this.ordersFirst.map((elem)=>{
        if(elem.id == parseInt(select)){
          this.objectShow = elem;
          this.show = "view";
        }
      })
      this.ordersSecond.map((elem)=>{
        if(elem.id == parseInt(select)){
          this.objectShow = elem;
          this.show = "view";
        }
      })
      this.ordersOthers.map((elem)=>{
        if(elem.id == parseInt(select)){
          this.objectShow = elem;
          this.show = "view";
        }
      })
    }
  }

  parseSides(value){
    return this._infoShared.parseSides(parseInt(value));
    
  }

  

  searchOrders(){
    this._http.getRequest('orders?q=3').subscribe(
      (res)=>{
        return this.filterOrders(res.data);
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
        res.data.map((elem)=>{
          if(elem.product != "Volantes"){
            this.ordersOthers.push(elem);
          }
        })
        return true;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchOrdersOtherTaller();
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
          this.searchFolios();
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
    let listArray = {"first":[],"second":[],"others": this.ordersOthers};
    for (let order of orders) {
      if(order.product === "Volantes"){
        if(order.garnet == "115gr"){
          listArray.first.push(order);
          this.orderFirstSelect.push({isDone:false,spaces:0});
        }else if(order.garnet == "150gr"){
          listArray.second.push(order);
          this.orderSecondSelect.push({isDone:false,spaces:0});
        }else{
          listArray.others.push(order);
        }
      }else{
        listArray.others.push(order);
      }
    }
    this.ordersFirst = this.orderArray(listArray.first);
    this.ordersSecond = this.orderArray(listArray.second);
    this.ordersOthers = this.orderArray(listArray.others);
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
      this.orderFirstSelect[index].spaces = parseFloat(event.target.value.replace(',','.'));
    }else if(array == 2){
      this.orderSecondSelect[index].spaces =  parseFloat(event.target.value.replace(',','.'));
    }
    this.countSpaces();
  }

  countSpaces(){
    let spaces = 0;
    this.orderFirstSelect.map((elem)=>{
      if(elem.isDone){
        spaces = spaces + parseFloat(elem.spaces);
      }
    })
    this.orderSecondSelect.map((elem)=>{
      if(elem.isDone){    
        spaces = spaces + parseFloat(elem.spaces);
      }
    })
    this.spaces = spaces;
  }

  countSpacesTotal(type){
    let spaces = 0;
    if(type == 1){
      this.ordersFirst.map((elem)=>{
        spaces = spaces + parseInt(elem.spacesInMissing); 
      })
    }else if(type == 2){
      this.ordersSecond.map((elem)=>{
        spaces = spaces + parseInt(elem.spacesInMissing);       
      })
    }
    return spaces;
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

  orderArray(tmp){
    return tmp.sort((a,b)=>{
      if (a.date_delivery > b.date_delivery) {
        return 1;
      }else if (a.date_delivery < b.date_delivery) {
        return -1;
      }else{
        return 0;
      }
    })
  }

}
