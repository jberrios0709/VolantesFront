import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {

  users:any[] = [];
  forma:FormGroup;
  userPosition:number = 0;
  action:string = "create";
  sucess:boolean = false;
  errorInit:boolean = false;
  types:any[]=[];
  actived:any[]=[];
  exist:boolean=false;

  constructor(public _http:HttpService) {
    this.createForma(this.userPosition,this.action);
  }

  ngOnInit() {
    this.searchUsers();    
    this.types=[
      {value:1,text:"Administrador"},
      {value:2,text:"Diseñador"},
      {value:3,text:"Vendedor nuevos"},
      {value:4,text:"Vendedor clientes"},
      {value:5,text:"Entregas"},
    ]
    this.actived=[
      {value:0,text:"No"},
      {value:1,text:"Si"}
    ]
  }

  searchUsers(){
    this._http.getRequest('user').subscribe(
      (res)=>{ 
        this.users = res.data;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchUsers();
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

  createForma(i, action){
    this.sucess = false;
    this.errorInit = false;
    this.exist = false;
    this.action = action;
    if(action === "update"){
      this.forma = new FormGroup({
        'id': new FormControl(this.users[i].id,[Validators.required]),
        'email':new FormControl(this.users[i].email),
        'name':new FormControl(this.users[i].name,Validators.required),
        'type':new FormControl(this.users[i].type,Validators.required),
        'actived':new FormControl(this.users[i].actived,Validators.required),
      });
    }else if(action === "create"){
      this.forma = new FormGroup({
        'email':new FormControl('',[Validators.required,Validators.email],this.existEmail.bind(this)),
        'name':new FormControl('',Validators.required),
        'type':new FormControl('',Validators.required),
        'password':new FormControl('',Validators.required),
      });
    }else if(action === "key"){
      this.forma = new FormGroup({
        'id': new FormControl(this.users[i].id,[Validators.required]),
        'password':new FormControl('',Validators.required),
      });
    }
  }

  descriptionPermit(){
    switch(parseInt(this.forma.value.type)) {
      case 1:
        return "Administrador: Posee todos los permisos para interactuar con el sistema.";
      case 2:
        return "Diseñador: Posee solo permisos para interactuar con la seccion de diseños.";
      case 3:
        return "Vendedor Nuevo: Posee solo permisos para interactuar con la seccion de nuevos clientes.";
      case 4:
        return "Vendedor Clientes: Posee permisos para interactuar con la seccion de CF, Nuevo Pedido y Nuevo Cliente.";
      case 5:
        return "Entregas: Posee solo permisos para interactuar con la seccion de Entregas y Cobros.";
                  
      default:
          return "Este tipo de usuario no existe";
    }
  }

  update(){
    this.forma.value.type = parseInt(this.forma.value.type);
    this._http.putRequest('user/'+this.forma.value.id, this.forma.value).subscribe(
      (res)=>{        
        this.searchUsers();
        this.sucess = true;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.update();
        }else{
          this.errorInit = true;
        }
      }
    ) 
  }

  updatePassword(){
    this._http.putRequest('user/'+this.forma.value.id+'/password', this.forma.value).subscribe(
      (res)=>{ 
        this.sucess = true;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.updatePassword();
        }else{
          this.errorInit = true;
        }
      }
    ) 
  }

  create(){
    this._http.postRequest('user', this.forma.value).subscribe(
      (res)=>{ 
        this.users.push(res.data);
        this.sucess = true;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.create();
        }else{
          this.errorInit = true;
        }
      }
    )
  }

  parseType(type){
    return this.types[type-1].text;
  }

  existEmail(control:FormControl):Promise<any>|Observable<any>{
    let $this = this;    
    let promise = new Promise(
      (resolve, reject)=>{
        $this._http.getRequest("verifyEmail?q="+control.value).subscribe(
          (res)=>{
            if(res.data == true){
              $this.exist = true;
              resolve({exist:true});
            }else{
              $this.exist = false;
              resolve(null)
            }
          },
          (error)=>{
            reject({exist:true})
          }
        )
      }
    )
    return promise;
  }

}

