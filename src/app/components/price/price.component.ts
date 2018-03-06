import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styles: []
})
export class PriceComponent implements OnInit {
  prices:any={};
  priceIndex:number;
  show:boolean = false;
  constructor(public _http:HttpService) { }

  ngOnInit() {
    this.searchPrices();    
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

}
