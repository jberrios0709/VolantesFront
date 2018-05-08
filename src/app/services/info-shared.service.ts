import { Injectable } from '@angular/core';

@Injectable()
export class InfoSharedService {

  constructor() { }

  infoSelects(){
    return{
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

  //Parse views

  parseSize(value){
    switch (value){
      case 1: return "10x7.5";
      case 2: return "10x15";
      case 3: return "15x20";
      case 4: return "15x30";
      case 99: return "No se conoce";
      default: return value;
    }
  }

  parseSides(value){
    switch(value){
      case 1: return "Un solo lado";
      case 2: return "Dos lados diferentes" ;
      case 3: return "Dos lados iguales";
      case 99: return "No se conoce";
    }
  }

  parseDesign(value){
    switch (value){
      case 1: return "Nuevo";
      case 2: return "Correción";
      case 3: return "Mismo";
      case 4: return "Envia el cliente";
      case 99: return "No se conoce";
      default: return value;
    }
  }

  parseGarnet(value){
    switch (value){
      case 1: return "115gr";
      case 2: return "150gr";
      case 99: return "No se conoce";
      default: return value;
    }
  }

  parseStatus(value){
    switch(value){
      case 1: return "Venta";
      case 2: return "Diseño";
      case 3: return "Impresion";
      case 4: return "Taller";
      case 5: return "Entrega";
      case 6: return "Terminado";
      case 7: return "Deudor";
      case 8: return "Cancelada";
    }
  }

  parseStatusLog(value){
    switch(value){
      case 2: return "Venta";
      case 3: return "Diseño";
      case 4: return "Impresion";
      case 5: return "Taller";
      case 6: return "Entrega";
      case 7: return "Terminado - Deudor";
      case 8: return "Cancelada";
    }
  }

}
