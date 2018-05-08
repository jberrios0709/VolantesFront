import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { InfoSharedService } from '../../services/info-shared.service';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/map';
//import { log } from 'util';

@Component({
  selector: 'app-cf',
  templateUrl: './cf.component.html'
})
export class CfComponent implements OnInit {

  terminoSearch:string="";
  clients:any[]=[];
  clientsFilter:any[]=[];
  positionClient:number=0;
  selectClient:boolean=false;
  selectOrder:boolean=false;
  cancelOrder:boolean=false;
  client:any;
  formaPhone:FormGroup;
  formaEmail:FormGroup;
  formaClient:FormGroup;
  formaBranch:FormGroup;
  orders:any[]=[];
  order:any;
  action:string;
  request:string;
  resourceDelete:any;
  ordersShowLoading:boolean=false;

  constructor(public _http:HttpService, public _infoShared:InfoSharedService) { }

  ngOnInit() {
    this.searchClients();
    this.formaPhone = new FormGroup({
      'number':new FormControl('',Validators.required),
      'explanatory':new FormControl('',Validators.required)
    });
    this.formaEmail = new FormGroup({
      'email':new FormControl('',[Validators.required,Validators.email])
    });
    this.formaBranch = new FormGroup({
      'name':new FormControl('',Validators.required),
      'address':new FormControl(''),
      'phone':new FormControl(''),
    });
    this.formaClient = new FormGroup({
      'name':new FormControl('',Validators.required),
      'address':new FormControl('',Validators.required),
      'charge':new FormControl('',Validators.required),
      'name_contact':new FormControl('',Validators.required),
      'comments':new FormControl(''),
      'observations':new FormControl(''),
      'reference':new FormControl(''),
    });
  }

  searchClients(){
    this._http.getRequest("client").subscribe(
      (res)=>{        
        let clients = this.orderClient(res.data);
        this.clients=clients;
        this.clientsFilter=clients;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchClients();
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

  filter(){
    this.clientsFilter = this.clients.filter((client)=>{
      if(client.name.toUpperCase().indexOf(this.terminoSearch.toUpperCase()) != -1 || 
         client.client.toString().indexOf(this.terminoSearch.toString()) != -1 
      ){
        return true;
      } 
    });
  }

  orderClient(clients){
    let arrayClientsModify = [];
    for(let client of clients){
      arrayClientsModify.push({
        "client":client.id,
        "reference":client.reference,
        "name":client.name,
        "address":client.address,
        "name_contact":client.name_contact,
        "charged":client.charge,
        "observations":client.observations,
        "emails":client.emails,
        "phones":client.phones,
        "comments":client.comments,
        "branchs":client.branchs,
        "date_init":client.created_at
      })
    }
    return arrayClientsModify;
  }

  showClient(index){
    this.request = "not";
    this.cancelOrder = false;
    this.selectClient = true;
    this.client = this.clientsFilter[index];
    this.searchOrders(index);
  }

  showOrder(index){
    this.request = "not";
    this.cancelOrder = false;
    this.selectOrder = true;
    this.order= this.orders[index];
  }

  searchOrders(index){
    this.orders = [];
    this.ordersShowLoading = true;
    let promise = new Promise((resolve, reject)=>{
      let tmp = [];
      let count = 0;
      this.clientsFilter[index].branchs.map((elem)=>{
        this._http.getRequest('branch/'+elem.id+'/order').subscribe(
          (res)=>{
            res.data.map((order)=>{
              tmp.push(order);
            })
            count += 1;
            if(count == this.clientsFilter[index].branchs.length){
              resolve(tmp);
            }
          }
        )
      })
    })
    
    promise.then((data)=>{
      this.orderArray(data);
    })
  }

  orderArray(tmp){
    this.orders = tmp.sort((a,b)=>{
      if (a.created_at > b.created_at) {
        return 1;
      }else if (a.created_at < b.created_at) {
        return -1;
      }else{
        return 0;
      }
    }).reverse()
    this.ordersShowLoading = false;
  }

  addBranch(){
    this.request = "not";
    this.formaBranch.reset({name:"",address:"",phone:""});
    this.action = "branch";
  }

  updateClient(){
    this.formaClient.reset({name:this.client.name,address:this.client.address,charge:this.client.charged,name_contact:this.client.name_contact,comments:this.client.comments,observations:this.client.observations,reference:this.client.reference});
    this.action = "client";
  }

  update(){
    this.request = "send";
    let body = this.formaClient.value;
    this._http.putRequest("client/"+this.client.client,body).subscribe(
      (res)=>{
        this.request = "good";
        this.client.name =body.name;
        this.client.address =body.address;
        this.client.charged =body.charge;
        this.client.comments =body.comments;
        this.client.name_contact =body.name_contact;
        this.client.observations =body.observations;
        this.client.reference =body.reference;
        this.searchClients();
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.update();
        }else{
          this.request = "error";
        }
      }
    )
  }

  createBranch(){    
    this.request = "send";
    this._http.postRequest('client/'+this.client.client+'/branch',this.formaBranch.value).subscribe(
      (res)=>{
        this.request = "good";
        this.client.branchs.push(res.data); 
        this.searchClients();
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.createBranch();
        }else{
          this.request = "error";
        }
      }
    );
  }

  addPhone(){
    this.request = "not";
    this.action = "phone";
    this.formaPhone = new FormGroup({
      'number':new FormControl('',Validators.required),
      'explanatory':new FormControl('',Validators.required)
    });
  }

  addEmail(){
    this.request = "not";
    this.action = "email";
    this.formaEmail = new FormGroup({
      'email':new FormControl('',[Validators.required,Validators.email])
    });
  }

  createResource(){
    let body;
    if(this.action==="phone"){
      body = this.formaPhone.value;
      this.postRequest('client/'+this.client['client']+'/phone',body,"phone")
    }else if(this.action==="email"){
      body = this.formaEmail.value;
      this.postRequest('client/'+this.client['client']+'/email',body,"email")
    }
  }

  postRequest(uri,body,resource){
    this.request = "send";
    this._http.postRequest(uri,body).subscribe(
      (res)=>{
        if(resource==="phone"){
          this.client['phones'].push(res.data);
        }else if(resource==="email"){
          this.client['emails'].push(res.data);
        }
        this.request = "good";
      },
      (error)=>{
        this.request = "error";
      }
    )
  }

  parseStatus(index){
    return this._infoShared.parseStatus(parseInt(this.orders[index].status_order[this.orders[index].status_order.length - 1].status));
  }

  parseStatusLog(value){   
    return this._infoShared.parseStatusLog(parseInt(value));
  }

  parseDesign(value){
    return this._infoShared.parseDesign(parseInt(value));
  }

  parseSides(value){
    console.log(value);
    
    return this._infoShared.parseSides(parseInt(value));
  }

  removePhone(index){
    this.request = "not";
    this.action = "remove";
    this.resourceDelete = {
      index:index,
      resource: "phone"
    };
  }

  removeMail(index){
    this.request = "not";
    this.action = "remove";
    this.resourceDelete = {
      index:index,
      resource: "email"
    };
  }

  deleteRequest(){
    let uri;
    if(this.resourceDelete.resource ==="phone"){
      uri="client/"+this.client["phones"][this.resourceDelete.index]["client_id"]+"/phone/"+this.client["phones"][this.resourceDelete.index]["id"]
    }else if(this.resourceDelete.resource ==="email"){
      uri="client/"+this.client["emails"][this.resourceDelete.index]["client_id"]+"/email/"+this.client["emails"][this.resourceDelete.index]["id"]
    }
    console.log(uri)
    this.request = "send";
    this._http.deleteRequest(uri).subscribe(
      (res)=>{
        if(this.resourceDelete.resource ==="phone"){
          this.client["phones"].splice(this.resourceDelete.index,1);
        }else if(this.resourceDelete.resource ==="email"){
          this.client["emails"].splice(this.resourceDelete.index,1);
        }
        this.request = "good";
        this.resourceDelete={};
      },
      (error)=>{
        this.request = "error";
      }
    )
  }


  orderCancel(){
    this.request = "send";
    this._http.postRequest("order/"+this.order.id+"/cancel",{}).subscribe(
      (res)=>{
        this.request = "good";
        this.order.status_order.push(res.data);        
      },
      (error)=>{
        this.request = "error";
      }
    )
  }

  calculateTotal(){
    return parseFloat(this.order.price_flyer) + parseFloat(this.order.price_send) + parseFloat(this.order.price_design)
  }

  
}
