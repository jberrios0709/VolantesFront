import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service'
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { log } from 'util';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-old',
  templateUrl: './old.component.html',
  styles: []
})
export class OldComponent implements OnInit {

  terminoSearch:string="";
  clients:any[]=[]; //Arreglo de clientes
  clientsFilter:any[]=[]; //Arreglo de clientes segun el filtro
  selectClient:boolean=false;
  client:object={}; //Cliente que se muestra en la vista
  branchSelect:any[]=[];
  all:boolean=false; //Selecciona todas las sucursales?
  forma:FormGroup;
  select:any = {}; //Campos para los selects de la vista
  branch:any[]=[]; //Todas las sucursales seleccionadas seran filtradas en este arreglo
  requestSend:any[]=[]; 
  spaces:string = "0";

  constructor(public _http:HttpService, public activatedRoute:ActivatedRoute) {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['q']==="true"){
        this.getClient(params['id']);
      }
    });
   }

  ngOnInit() {
    this.initSelect();
    this.searchClients();
    this.createForma();
  }

  initSelect(){
    this.select = {
      "product":["Volantes"],
      "size":[{"value":1,"size":"10x7.5"},{"value":2,"size":"10x15"},{"value":3,"size":"15x20"},{"value":4,"size":"15x30"}],
      "garnet":["115gr","150gr"],
      "time":[{"value":7,"text":"1 semana"},{"value":21,"text":"3 semanas"}],
      "send":[{"value":0,"text":"No"},{"value":1,"text":"Si"}],
      "design":[{"value":1,"text":"Nuevo"},{"value":2,"text":"Correción"},{"value":3,"text":"Ultimo diseño"},{"value":4,"text":"Envia el cliente"}],
      "sides":[{"value":1,"text":"Un solo lado"},{"value":2,"text":"Dos lados diferentes"},{"value":3,"text":"Dos lados iguales"}],
      "mention":[{"value":1,"text":"100%"},{"value":2,"text":"150%"},{"value":3,"text":"No"}],
      "price":[{"value":"default", "text": "0"}]
    }
  }

  createForma(){
    this.forma = new FormGroup({
      "product":new FormControl('',Validators.required),
      "size":new FormControl('',Validators.required),
      "size_special":new FormControl(0,),
      "garnet":new FormControl('',Validators.required),
      "quantity":new FormControl('',),
      "time_delivery":new FormControl('',Validators.required),
      "special_time":new FormControl(0,),
      "sides":new FormControl('',Validators.required),
      "design":new FormControl('',Validators.required),
      "mention":new FormControl('',Validators.required),
      "specification":new FormControl('',Validators.required),
      "trace":new FormControl('',Validators.required),
      "debit":new FormControl(''),
      "method_payment":new FormControl('',Validators.required),
      "price_flyer":new FormControl('default',Validators.required),
      "price_design":new FormControl('0',Validators.required),
      "price_send":new FormControl('0',Validators.required),
      "price_flyer_special":new FormControl(0),
      "we_send":new FormControl('',Validators.required),
      "description_send":new FormControl('',Validators.required),
    });

    this.forma.controls['quantity'].setValidators([
      Validators.required,
      this.quantity.bind(this.forma)
    ]);
  }

  searchClients(){
    this._http.getRequest("client").subscribe(
      (res)=>{
        this.clients=res.data;
        this.clientsFilter = res.data;
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
         client.id.toString().indexOf(this.terminoSearch.toString()) != -1
      ){
        return true;
      } 
    });
  }

  showClient(index){
    this.selectClient = true;
    this.all = false;
    this.client = this.clientsFilter[index];
    this.branchSelect = this.clientsFilter[index].branchs.map((elem)=>{
      return {
        "id": elem.id,
        "isDone": false,
        "name":elem.name
      }
    })
  }

  addBranchOrder(index){
    if(this.branchSelect[index].isDone){
      this.branchSelect[index].isDone = false;
    }else{
      this.branchSelect[index].isDone = true;
    }
  }

  selectAll(){
    this.all = !this.all;
    this.branchSelect.forEach((elem) => {
      if(this.all){
        elem.isDone = true;
      }else{
        elem.isDone = false;
      }
    });
  }

  getClient(id){
    this._http.getRequest("client/"+id).subscribe(
      (res)=>{
        this.selectClient = true;
        this.all = false;
        this.client = res.data;
        this.branchSelect = res.data.branch.map((elem)=>{
          return {
            "id": elem.id,
            "isDone": false,
            "name":elem.name
          }
    })
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.getClient(id);
        }
      }
    )
  }

  addProduct(event){
   if(this.select.product.length === 2){
    this.select.product[1] = event.target.value;
   }else if(this.select.product.length === 1){
    this.select.product.push(event.target.value);
   }
  }

  addSize(event){
    if(this.select.size.length === 5){
     this.select.size[4] = {"value": event.target.value, "size": event.target.value};
    }else if(this.select.size.length === 4){
     this.select.size.push({"value": event.target.value, "size": event.target.value});
    }
   }

   addTime(event){
    if(this.select.time.length === 3){
     this.select.time[2] = {"value": event.target.value, "text": event.target.value};
    }else if(this.select.time.length === 2){
     this.select.time.push({"value": event.target.value, "text": event.target.value});
    }
   }

   addGarnet(event){
    if(this.select.garnet.length === 3){
     this.select.garnet[2] = event.target.value;
    }else if(this.select.garnet.length === 2){
     this.select.garnet.push(event.target.value);
    }
   }

   addPrice(event){
    if(this.select.price.length === 2){
     this.select.price[1].text = event.target.value;
     this.select.price[1].value = event.target.value;
    }else if(this.select.price.length === 1){
     this.select.price.push({"value":event.target.value, "text":event.target.value});
    }
   }

   quantity(control: FormControl):{[s:string]:boolean}{
     let forma:any = this;
     if(forma.controls['product'].value === "Volantes" && (control.value < 5000 || control.value % 5000 != 0)){
       return{
        noQuantity:true
       }
     }
     return null;
   }

   priceSpecial(){
    if(this.forma.value.size_special === 1 || this.forma.value.size_special === 1 || this.forma.value.price_flyer != "default" || this.forma.value.special_time === 1){
      this.forma.value.price_flyer_special = 1;
    }else{
      this.forma.value.price_flyer_special = 0;
    }
  }

  sizeSpecial(){
    if(this.forma.value.size === "1" || this.forma.value.size === "2" || this.forma.value.size === "3" || this.forma.value.size === "4"){
      this.forma.value.size_special = 0;    
      this.forma.value.size = parseInt(this.forma.value.size);
    }else{
      this.forma.value.size_special = 1;
    }
  }

  timeSpecial(){
    if(this.forma.value.time_delivery != "7" && this.forma.value.time_delivery != "21"){
      this.forma.value.special_time = 1;
    }else{
      this.forma.value.special_time = 0;  
      this.forma.value.time_delivery = parseInt(this.forma.value.time_delivery);     
    }
  }

  searchPrice(){
    let body = {
      "size":this.forma.value.size,
      "time_delivery":this.forma.value.time_delivery,
      "quantity":this.forma.value.quantity,
      "garnet":this.forma.value.garnet
      
    }
    this._http.postRequestNotToken('calculatePrice',body).subscribe(
      (res)=>{
        if(res.price === "Price special"){
          this.select.price[0].text = "Precio especial";
          this.select.price[0].value = res.price;
        }else{
          this.select.price[0].text = res.price;
          this.select.price[0].value = "default";
        }
      }
    )
  }

  createToBranch(){
    this.branch = this.branchSelect.filter((branch)=>{
      if(branch.isDone){
        return true;
      }
    });
  }

  rulesBussiness(){
    this.timeSpecial();
    this.sizeSpecial();
    this.priceSpecial();
    this.createToBranch();
  }

  createOrder(){
    
    this.requestSend = this.branch.map(()=>{
      return {value:"send"};
    })
    this.branch.map((elem, index)=>{
      this._http.postRequest('branch/'+elem.id+'/order',this.forma.value).subscribe(
        (res)=>{
          this.requestSend[index] = {value:"good", id:res.data.id};
          console.log(this.requestSend);
        },
        (error)=>{
          this.requestSend[index].value = "error";
        }
      )
    });    
  }

  reset(){
    this.selectClient=false;
    this.client={};
    this.branchSelect=[];
    this.all=false;
    this.branch=[];
    this.requestSend=[];
    this.createForma();
    this.initSelect();
  }

  //Parses views

  parseSize(){
    switch (this.forma.value.size){
      case 1: return "10x7.5";
      case 2: return "10x15";
      case 3: return "15x20";
      case 4: return "15x30";
      default: return this.forma.value.size;
    }
  }

  parseDesign(){
    switch (this.forma.value.design){
      case 1: return "Nuevo";
      case 2: return "Correción";
      case 3: return "Ultimo diseño";
      case 4: return "Envia el cliente";
      default: return this.forma.value.design;
    }
  }

  parseGarnet(){
    switch (this.forma.value.garnet){
      case 1: return "115gr";
      case 2: return "150gr";
      default: return this.forma.value.garnet;
    }
  }

  parseMention(){
    switch (this.forma.value.mention){
      case 1: return "100%";
      case 2: return "150%";
      case 3: return "No";
      default: return this.forma.value.mention;
    }
  }

  parsePriceFlyer(){
    if(this.forma.value.price_flyer == "default"){
      return parseFloat(this.select.price[0].text);
    }else{
      return parseFloat(this.forma.value.price_flyer);
    }
  }

  calculateTotal(){
    if(this.forma.value.price_flyer == "default"){
      return parseFloat(this.select.price[0].text) + parseFloat(this.forma.value.price_design) + parseFloat(this.forma.value.price_send);
    }else{
      return parseFloat(this.forma.value.price_flyer) + parseFloat(this.forma.value.price_design) + parseFloat(this.forma.value.price_send);
    }
  }

  calculateDebit(){
    if(this.forma.value.price_flyer == "default"){
      return parseFloat(this.select.price[0].text) + parseFloat(this.forma.value.price_design) + parseFloat(this.forma.value.price_send) - parseFloat(this.forma.value.trace);
    }else{
      return parseFloat(this.forma.value.price_flyer) + parseFloat(this.forma.value.price_design) + parseFloat(this.forma.value.price_send) - parseFloat(this.forma.value.trace);
    }
  }

  calculateSpaces(){
    if(this.forma.value.quantity != "" && this.forma.value.size != ""){
      let body;
      if(this.forma.value.size === "1" || this.forma.value.size === "2" || this.forma.value.size === "3" || this.forma.value.size === "4"){
        body = {size:this.select.size[parseInt(this.forma.value.size)-1].size,quantity:this.forma.value.quantity};
      }else{
        body = {size:this.forma.value.size,quantity:this.forma.value.quantity};
      }
      this._http.postRequestNotToken('calculateSpaces',body).subscribe(
        (res)=>{
          this.spaces = res.space;
        },
        (error)=>{
          this.spaces = "0";
        }
      )
    }else{
      this.spaces = "0";
    }
  }

}
