import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service'
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styles: []
})
export class NewComponent implements OnInit {

  request:string="false";
  requestClient:string;
  requestBranch:any[] = [];
  requestOrder:any[] = [];
  formaClient:FormGroup;
  formaBranch:FormGroup;
  formaOrder:FormGroup;
  nextView:boolean = false;
  select:any = {}; //Campos para los selects de la vista
  spaces:string = "0";
  phones:any[] = [];

  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.createForma();
    this.initSelect();
  }

  initSelect(){
    this.select = {
      "product":["Volantes"],
      "size":[{"value":1,"size":"10x7.5"},{"value":2,"size":"10x15"},{"value":3,"size":"20x15"},{"value":4,"size":"20x30"}],
      "garnet":["115gr","150gr"],
      "time":[{"value":7,"text":"1 semana"},{"value":21,"text":"3 semanas"}],
      "send":[{"value":0,"text":"No"},{"value":1,"text":"Si"}],
      "design":[{"value":1,"text":"Nuevo"},{"value":2,"text":"Correción"},{"value":3,"text":"Mismo"},{"value":4,"text":"Envia el cliente"}],
      "sides":[{"value":1,"text":"Un solo lado"},{"value":2,"text":"Dos lados diferentes"},{"value":3,"text":"Dos lados iguales"}],
      "price":[{"value":"default", "text": "0"}]
    }
  }

  next(){
    this.nextView = !this.nextView;
  }

  createForma(){
         
      this.formaClient = new FormGroup({
        'name':new FormControl('',Validators.required),
        'reference':new FormControl('',Validators.required),
        'observations':new FormControl('',Validators.required),
        'comments':new FormControl(''),
        'name_contact':new FormControl('',Validators.required),
        'charge':new FormControl('',Validators.required),
        'address':new FormControl('',Validators.required),
        'phones':new FormArray([
          new FormControl('',Validators.required)
        ]),
        'explanatorys':new FormArray([
          new FormControl('',Validators.required)
        ]),
        'emails':new FormArray([
          new FormControl('',[Validators.required, Validators.email])
        ])
      });
      this.formaBranch = new FormGroup({
        'name':new FormArray([
          new FormControl('',Validators.required)
        ]),
        'address':new FormArray([
          new FormControl('')
        ]),
        'phone':new FormArray([
          new FormControl('')
        ]),
        'isDone':new FormArray([
          new FormControl(false)
        ])  
      });
      this.formaOrder = new FormGroup({
        "product":new FormControl('',Validators.required),
        "size":new FormControl('',Validators.required),
        "size_special":new FormControl(0,),
        "garnet":new FormControl('',Validators.required),
        "quantity":new FormControl('',),
        "time_delivery":new FormControl('',Validators.required),
        "special_time":new FormControl(0,),
        "sides":new FormControl('',Validators.required),
        "design":new FormControl('',Validators.required),
        "contact_design":new FormControl('',Validators.required),
        "specification":new FormControl('',Validators.required),
        "trace":new FormControl(''),
        "debit":new FormControl(''),
        "method_payment":new FormControl('',Validators.required),
        "price_flyer":new FormControl('',Validators.required),
        "price_design":new FormControl('',[Validators.required,Validators.pattern(/^([0-9]|.)*$/)]),
        "price_send":new FormControl('',[Validators.required,Validators.pattern(/^([0-9]|.)*$/)]),
        "price_flyer_special":new FormControl(false),
        "we_send":new FormControl('',Validators.required),
        "description_send":new FormControl('',Validators.required),
      });

      this.formaOrder.controls['price_flyer'].setValidators([
        Validators.required,
        Validators.pattern(/^([0-9]|.)*$/),
        this.price.bind(this.formaOrder)
      ]);
  
      this.formaOrder.controls['quantity'].setValidators([
        Validators.required,
        Validators.pattern(/^([0-9])*$/),
        this.quantity.bind(this.formaOrder)
      ]);
  
      this.formaOrder.controls['trace'].setValidators([
        Validators.required,
        this.traceRule.bind(this)
      ]);
  }

  addPhone(){
    (<FormArray>this.formaClient.controls['phones']).push(
      new FormControl('', Validators.required)
    );
    (<FormArray>this.formaClient.controls['explanatorys']).push(
      new FormControl('', Validators.required)
    );
  }

  addBranch(){
    (<FormArray>this.formaBranch.controls['name']).push(
      new FormControl('', Validators.required)
    );
    (<FormArray>this.formaBranch.controls['address']).push(
      new FormControl('', Validators.required)
    );
    (<FormArray>this.formaBranch.controls['phone']).push(
      new FormControl('', Validators.required)
    );
    (<FormArray>this.formaBranch.controls['isDone']).push(
      new FormControl(false)
    );
  }

  changeSelect(index){
    this.formaBranch.value.isDone[index]=!this.formaBranch.value.isDone[index];
  }

  addEmail(){
    (<FormArray>this.formaClient.controls['emails']).push(
      new FormControl('', Validators.required)
    );
  }

  createClient(){    
    this.request="process";
    this.requestClient="send";
    
    this._http.postRequest('client',this.formaClient.value).subscribe(
      (res)=>{       
        this.requestClient="good";
        this.createBranch(res.data.id);
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.createClient();
        }else{
          this.requestClient="error";
        }
      }
    );
  }


  createBranch(clientId){    
    this.requestBranch.push("send");
    this.formaBranch.value.name.map((elem,index)=>{
      let body = {
        name: elem,
        address: this.formaBranch.value.address[index],
        phone: this.formaBranch.value.phone[index]
      }
      this._http.postRequest('client/'+clientId+'/branch',body).subscribe(
        (res)=>{
          if(this.formaBranch.value.isDone[index]){
            this.createOrder(res.data.id,index);
            this.requestBranch[index]="good";
          }
        },
        (error)=>{
          if(this.verifyError(error.json())){        
            this.createClient();
          }else{
            this.requestBranch[index]="error";
          }
        }
      );
    });
    
  }

  createOrder(branchId,index){
    this.requestOrder.push({status:"send"});
    
    this._http.postRequest('branch/'+branchId+'/order',this.formaOrder.value).subscribe(
      (res)=>{
        //this.request="finish";
        this.requestOrder[index]={status:"good",id:res.data.id};
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.createClient();
        }else{
          this.requestOrder[index]={status:"error"};
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


  //Segmento de orden

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

    price(control: FormControl):{[s:string]:boolean}{
      if(control.value === "Price special"){
        return{
         noPrice:true
        }
      }
      return null;
    }

    traceRule(control: FormControl):{[s:string]:boolean}{
      let $this:any = this;
      if($this.calculateTotal()<control.value || control.value < 0){
        return{
         noTraceRule:true
        }
      }
      return null;
    }
 
    priceSpecial(){
     if(this.formaOrder.value.size_special === 1 || this.formaOrder.value.size_special === 1 || this.formaOrder.value.price_flyer != "default" || this.formaOrder.value.special_time === 1){
       this.formaOrder.value.price_flyer_special = 1;
     }else{
       this.formaOrder.value.price_flyer_special = 0;
     }
   }
 
   sizeSpecial(){
     if(this.formaOrder.value.size === "1" || this.formaOrder.value.size === "2" || this.formaOrder.value.size === "3" || this.formaOrder.value.size === "4"){
       this.formaOrder.value.size_special = 0;    
       this.formaOrder.value.size = parseFloat(this.formaOrder.value.size);
     }else{
       this.formaOrder.value.size_special = 1;
     }
   }
 
   timeSpecial(){
     if(this.formaOrder.value.time_delivery != "7" && this.formaOrder.value.time_delivery != "21"){
       this.formaOrder.value.special_time = 1;
     }else{
       this.formaOrder.value.special_time = 0;  
       this.formaOrder.value.time_delivery = parseFloat(this.formaOrder.value.time_delivery);     
     }
   }

   searchPrice(){
    let body = {
      "size":this.formaOrder.value.size,
      "time_delivery":this.formaOrder.value.time_delivery,
      "quantity":this.formaOrder.value.quantity,
      "garnet":this.formaOrder.value.garnet
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

  rulesBussiness(){
    this.timeSpecial();
    this.sizeSpecial();
    this.priceSpecial();
  }

  reset(){
    this.createForma();
    this.initSelect();
  }

  //Parses views

  parseSize(){
    switch (this.formaOrder.value.size){
      case 1: return "10x7.5";
      case 2: return "10x15";
      case 3: return "15x20";
      case 4: return "15x30";
      default: return this.formaOrder.value.size;
    }
  }

  parseSides(){
    switch(parseInt(this.formaOrder.value.sides)){
      case 1: return "Un solo lado";
      case 2: return "Dos lados diferentes" ;
      case 3: return "Dos lados iguales";
    }
  }

  parseDesign(){
    switch (parseInt(this.formaOrder.value.design)){
      case 1: return "Nuevo";
      case 2: return "Correción";
      case 3: return "Mismo";
      case 4: return "Envia el cliente";
      default: return this.formaOrder.value.design;
    }
  }

  parseGarnet(){
    switch (this.formaOrder.value.garnet){
      case 1: return "115gr";
      case 2: return "150gr";
      default: return this.formaOrder.value.garnet;
    }
  }

  parsePriceFlyer(){
    if(this.formaOrder.value.price_flyer == "default"){
      return parseFloat(this.select.price[0].text);
    }else{
      return parseFloat(this.formaOrder.value.price_flyer);
    }
  }

  calculateTotal(){
    if(this.formaOrder.value.price_flyer == "default"){
      return parseFloat(this.select.price[0].text) + parseFloat(this.formaOrder.value.price_design) + parseFloat(this.formaOrder.value.price_send);
    }else{
      return parseFloat(this.formaOrder.value.price_flyer) + parseFloat(this.formaOrder.value.price_design) + parseFloat(this.formaOrder.value.price_send);
    }
  }

  calculateDebit(){
    if(this.formaOrder.value.price_flyer == "default"){
      return parseFloat(this.select.price[0].text) + parseFloat(this.formaOrder.value.price_design) + parseFloat(this.formaOrder.value.price_send) - parseFloat(this.formaOrder.value.trace);
    }else{
      return parseFloat(this.formaOrder.value.price_flyer) + parseFloat(this.formaOrder.value.price_design) + parseFloat(this.formaOrder.value.price_send) - parseFloat(this.formaOrder.value.trace);
    }
  }

  calculateSpaces(){
    if(this.formaOrder.value.quantity != "" && this.formaOrder.value.size != ""){
      let body;
      if(this.formaOrder.value.size === "1" || this.formaOrder.value.size === "2" || this.formaOrder.value.size === "3" || this.formaOrder.value.size === "4"){
        body = {size:this.select.size[parseInt(this.formaOrder.value.size)-1].size,quantity:this.formaOrder.value.quantity};
      }else{
        body = {size:this.formaOrder.value.size,quantity:this.formaOrder.value.quantity};
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

  deleteAttr(type,index){
    if(type=="phone"){
      (<FormArray>this.formaClient.controls['phones']).removeAt(index);
      (<FormArray>this.formaClient.controls['explanatorys']).removeAt(index);
    }else if(type=="email"){
      (<FormArray>this.formaClient.controls['emails']).removeAt(index);
    }else if(type=="branch"){
      (<FormArray>this.formaBranch.controls['name']).removeAt(index);
      (<FormArray>this.formaBranch.controls['address']).removeAt(index);
      (<FormArray>this.formaBranch.controls['phone']).removeAt(index);
      (<FormArray>this.formaBranch.controls['isDone']).removeAt(index);
    }
  }

}
