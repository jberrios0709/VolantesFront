import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styles: []
})
export class PriceComponent implements OnInit {
  prices:any={};
  priceIndex:number;
  show:boolean = false;
  formaFirst:FormGroup;
  formaSecond:FormGroup;
  formaThree:FormGroup;
  formaFour:FormGroup;
  text:any [] = ["5000","10000","15000","20000"];
  measure:any [] = ["15x7.5","15x10","20x15","20x30"];
  status:number=0;
  request:string="not";

  constructor(public _http:HttpService) { 
    this.formaFirst = new FormGroup({
      'prices':new FormArray([])
    }),
    this.formaSecond = new FormGroup({
      'prices':new FormArray([])
    }),
    this.formaThree = new FormGroup({
      'prices':new FormArray([])
    }),
    this.formaFour = new FormGroup({
      'prices':new FormArray([])
    })
  }

  ngOnInit() {
    this.searchPrices();    
    for (let i = 0; i<16;i++){
      (<FormArray>this.formaFirst.controls['prices']).push(
        new FormControl('', Validators.required)
      );
      (<FormArray>this.formaSecond.controls['prices']).push(
        new FormControl('', Validators.required)
      );
      (<FormArray>this.formaThree.controls['prices']).push(
        new FormControl('', Validators.required)
      );
      (<FormArray>this.formaFour.controls['prices']).push(
        new FormControl('', Validators.required)
      );
    }
    console.log(this.formaFirst.value);
    
  }

  searchPrices(){
    this._http.getRequest('price').subscribe(
      (res)=>{ 
        this.prices = res.data;
        this.show = true;
        this.priceIndex = 0;
      },
      (error)=>{
        if(this.verifyError(error.json())){        
          this.searchPrices();
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

  showPrice(index){
    this.priceIndex = index;
  }

  next(){
    if(this.formaFirst.valid){
      this.status = 1;
      if(this.formaSecond.valid){
        this.status = 2;
        if(this.formaThree.valid){
          this.status = 3;
        }else{
          this.status = 2;
        }
      }else{
        this.status = 1;
      }
    }else{
      this.status = 0;
    }
  }

  createBody(){
    let body = [];
    for(let i = 0; i<4; i++){
      body.push({
        "time": 1,
        "garnet":"115gr",
        "measure_id": i+1,
        "price1":this.formaFirst.value.prices[i*4],
        "price2":this.formaFirst.value.prices[i*4+1],
        "price3":this.formaFirst.value.prices[i*4+2],
        "price4":this.formaFirst.value.prices[i*4+3]
      })

      body.push({
        "time": 3,
        "garnet":"115gr",
        "measure_id": i+1,
        "price1":this.formaSecond.value.prices[i*4],
        "price2":this.formaSecond.value.prices[i*4+1],
        "price3":this.formaSecond.value.prices[i*4+2],
        "price4":this.formaSecond.value.prices[i*4+3]
      })

      body.push({
        "time": 1,
        "garnet":"150gr",
        "measure_id": i+1,
        "price1":this.formaThree.value.prices[i*4],
        "price2":this.formaThree.value.prices[i*4+1],
        "price3":this.formaThree.value.prices[i*4+2],
        "price4":this.formaThree.value.prices[i*4+3]
      })

      body.push({
        "time": 3,
        "garnet":"150gr",
        "measure_id": i+1,
        "price1":this.formaFour.value.prices[i*4],
        "price2":this.formaFour.value.prices[i*4+1],
        "price3":this.formaFour.value.prices[i*4+2],
        "price4":this.formaFour.value.prices[i*4+3]
      })
      
    }
    this.request = "send";
    this._http.postRequest('price',{prices:body}).subscribe(
      (res)=>{
        this.request = "good";
      },
      (error)=>{
        this.request = "error";
      }
    )
    
  }
}
