import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  file : File | null;
  bits : number;
  voltage : number;
  text : string;
  bits_array : Number[];
  binary_text : string;
  ascii_text : string;
  vol_text : string;

  constructor() {
    this.file = null;
    this.bits = 8;
    this.voltage = 1;
    this.text = "";
    this.bits_array = [];
    this.binary_text = "";
    this.ascii_text = "";
    this.vol_text = "";
   }

   codificar() {

    this.bits_array.splice(0,this.binary_text.length);

    for (var i=(this.bits-1); i>=0;i--) {
      this.bits_array.push(Math.pow(2,i))
    }

    let ascii = this.to_ascii()
    this.ascii_text = ascii.toString()
    let message = ""
    for (const char of ascii) {
      message += this.to_by(char)
    }
    this.binary_text = message;
    this.vol_text = this.to_vol();
   }

   to_by(x : Number){
    let val = x
    let message = ""
    for (const bit of this.bits_array) {
      if(val >= bit){
        message += '1'
        val = Number(val) - Number(bit)
      }else{
        message += '0'
      }
    }
    return message+" "
   }

   to_ascii(){
    let ascii = []
    for (var i=0; i<this.text.length;i++) {
      ascii.push(Number(this.text.charCodeAt(i)));
    }
    return ascii
   }

   to_vol(){

    let cant_interval = 16;
    let segments_array = [this.bits]; //8
    let interval_array = [cant_interval]; //16
    let tam_interval = this.voltage / ( cant_interval * this.bits) //x, vol = 1
    segments_array = this.to_segmento(tam_interval);
    interval_array = this.to_interval(tam_interval);
    let text = ""
    
    
    for( const bin of this.binary_text.split(" ")){
      if(bin != ""){
        let seg = bin.substring(1,4);
        let inter = bin.substring(4,8);
        let signo = "+"
        if(bin.substring(0,1)=="1"){signo = "-"}
        text += signo+(segments_array[this.Binary_to_Decimal(seg)] + interval_array[this.Binary_to_Decimal(inter)])+" ";
      }
    }

    return text
   }

  to_segmento(tam_intervalo : Number){
    let segments_array = [0,];
    let tam = Number(tam_intervalo)*16;
    for (var i=1; i<this.bits; i++){
      segments_array.push(Number(i*tam));
    }
    return segments_array
   }

   to_interval(tam_intervalo : Number){
    let interval_array = [];
    let tam = Number(tam_intervalo);
    for (var i=0; i<16; i++){
      interval_array.push(Number(i*tam));
    }
    return interval_array
   }

  Binary_to_Decimal(num: String){
    let sum = 0;
    var numReverse = num.split('').reverse().join('');

    for (var i = 0; i < numReverse.length; i++) {
      sum = sum + parseInt(numReverse[i]) * 2 **( i);
    }
    return sum
  }

  print_array(list: number[]){
    let text = "-/";
    for(var i = 0; i < list.length; i++){
      text += list[i] +" ";
    }
    return text
  }

}
