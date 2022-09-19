import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  file : File | null;
  bits : number;
  text : string;
  bits_array : Number[];
  binary_text : string;
  ascii_text : string;

  constructor() {
    this.file = null;
    this.bits = 8;
    this.text = "";
    this.bits_array = [];
    this.binary_text = "";
    this.ascii_text = "";
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
}
