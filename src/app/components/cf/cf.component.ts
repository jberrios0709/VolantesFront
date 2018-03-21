import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service'
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
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
  client:object={};
  success:boolean=true;
  error:boolean=false;
  formaPhone:FormGroup;
  formaEmail:FormGroup;
  formaClient:FormGroup;
  formaBranch:FormGroup;
  orders:any[]=[];
  action:string;
  request:string;
  resourceDelete:any;

  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.searchClients();
    this.formaPhone = new FormGroup({
      'number':new FormControl('',Validators.required),
      'explanatory':new FormControl('',Validators.required)
    });
    this.formaEmail = new FormGroup({
      'email':new FormControl('',[Validators.required,Validators.email])
    });
  }

  searchClients(){
    this._http.getRequest("client").subscribe(
      (res)=>{
        let clients = this.orderClient(res.data);
        this.clients=clients;
        this.clientsFilter = clients;
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
         client.client.toString().indexOf(this.terminoSearch.toString()) != -1 ||
         client.nameBranch.toUpperCase().indexOf(this.terminoSearch.toUpperCase()) != -1 
      ){
        return true;
      } 
    });
  }

  orderClient(clients){
    let arrayClientsModify = [];
    let branchs = [];
    for(let client of clients){
      arrayClientsModify.push({
        "client":client.id,
        "name":client.name,
        "name_contact":client.name_contact,
        "charged":client.charge,
        "reference:":client.reference,
        "observations":client.observations,
        "emails":client.mails,
        "phones":client.phones,
        "comments":client.comments,
        "branchs":client.branchs,
        "date_init":client.created_at
      })
    }
    return arrayClientsModify;
  }

  showClient(index){
    this.selectClient = true;
    this.client = this.clientsFilter[index];
    this.createForma(index);
    this.searchOrders(index);
  }

  searchOrders(index){
    this.clientsFilter[index].branchs.map((elem)=>{
      this._http.getRequest('branch/'+elem.id+'/order').subscribe(
        (res)=>{
          res.data.map((order)=>{
            this.orders.push(order);
          })
          
        }
      )
    })
  }

  createForma(index){
    this.success = false;
    this.error = false;
    console.log();
    this.formaBranch = new FormGroup({
      'name':new FormControl(this.clientsFilter[index].name,Validators.required),
      'address':new FormControl(this.clientsFilter[index].address,Validators.required)
    });
  }

  createBranch(clientId){    
    this._http.postRequest('client/'+clientId+'/branch',this.formaBranch.value).subscribe(
      (res)=>{
        this.success = true;
        this.searchClients();
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.createBranch(clientId);
        }else{
          this.error = true;
        }
      }
    );
  }

  addPhone(){
    this.action = "phone";
    this.formaPhone = new FormGroup({
      'number':new FormControl('',Validators.required),
      'explanatory':new FormControl('',Validators.required)
    });
  }

  addEmail(){
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
    switch(this.orders[index].status_order[this.orders[index].status_order.length - 1].status){
      case 2: return "Diseño";
      case 3: return "Impresion";
      case 4: return "Taller";
      case 5: return "Entrega";
      case 6: return "Terminado";
      case 7: return "Deudor";
    }
  }

  removePhone(index){
    this.action = "remove";
    this.resourceDelete = {
      index:index,
      resource: "phone"
    };
  }

  removeMail(index){
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
    this.request = "send";
    this._http.deleteRequest(uri).subscribe(
      (res)=>{
        if(this.resourceDelete.resource ==="phone"){
          this.client["phones"].splice(this.resourceDelete.index);
        }else if(this.resourceDelete.resource ==="email"){
          this.client["emails"].splice(this.resourceDelete.index);
        }
        this.request = "good";
        this.resourceDelete={};
      },
      (error)=>{
        this.request = "error";
      }
    )

    
  }

  
}
