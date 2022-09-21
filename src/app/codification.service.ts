import { EventEmitter, Injectable } from "@angular/core";
import { Codification } from "./codification.model";

@Injectable()
export class CodificationService{
  codification: Codification = new Codification('', 0,'','');

  constructor(){}

  setCodificationObject(codification : Codification){
    this.codification = codification
  }

  getArrayBits(){
    let bits_array = []

    for (var i = (this.codification.bits - 1); i >= 0; i--) {
      bits_array.push(Math.pow(2, i))
    }

    return bits_array
  }

  getAsciiText(bits_array: Number[]){
    let ascii = []
    for (var i = 0; i < this.codification.text.length; i++) {
      ascii.push(this.codification.text.charCodeAt(i));
    }

    this.codification.ascii_text = ascii.toLocaleString()

    let message = ""
    for (const char of ascii) {
      message += this.to_by(char, bits_array)
    }

    this.codification.binary_text = message
  }

  to_by(x: Number, bits_array: Number[]) {
    let val = x
    let message = ""
    for (const bit of bits_array) {
      if (val >= bit) {
        message += '1'
        val = Number(val) - Number(bit)
      } else {
        message += '0'
      }
    }
    return message + " "
  }

  to_vol(voltage : number) {

    let cant_interval = 16;
    let segments_array = [this.codification.bits]; //8
    let interval_array = [cant_interval]; //16
    let tam_interval = voltage / (cant_interval * this.codification.bits) //x, vol = 1
    segments_array = this.to_segmento(tam_interval);
    interval_array = this.to_interval(tam_interval);
    let text = ""


    for (const bin of this.codification.binary_text.split(" ")) {
      if (bin != "") {
        let seg = bin.substring(1, 4);
        let inter = bin.substring(4, 8);
        let signo = "+"
        if (bin.substring(0, 1) == "1") { signo = "-" }
        text += signo + (segments_array[this.Binary_to_Decimal(seg)] + interval_array[this.Binary_to_Decimal(inter)]) + " ";
      }
    }

    return text
  }

  

  to_segmento(tam_intervalo: Number) {
    let segments_array = [0,];
    let tam = Number(tam_intervalo) * 16;
    for (var i = 1; i < this.codification.bits; i++) {
      segments_array.push(Number(i * tam));
    }
    return segments_array
  }

  to_interval(tam_intervalo: Number) {
    let interval_array = [];
    let tam = Number(tam_intervalo);
    for (var i = 0; i < 16; i++) {
      interval_array.push(Number(i * tam));
    }
    return interval_array
  }

  Binary_to_Decimal(num: String) {
    let sum = 0;
    var numReverse = num.split('').reverse().join('');

    for (var i = 0; i < numReverse.length; i++) {
      sum = sum + parseInt(numReverse[i]) * 2 ** (i);
    }
    return sum
  }

  print_array(list: number[]) {
    let text = "-/";
    for (var i = 0; i < list.length; i++) {
      text += list[i] + " ";
    }
    return text
  }

  vol_to_binaria(voltage : number, vol_text: string){
    let binary_text ="";

    let cant_interval = 16;
    let segments_array = [this.codification.bits]; //8
    let interval_array = [cant_interval]; //16
    let tam_interval = voltage / (cant_interval * this.codification.bits) //x, vol = 1
    segments_array = this.to_segmento(tam_interval);
    interval_array = this.to_interval(tam_interval);
    
    for (const vol of vol_text.split(" ")) {
      let binario = ""
      if (vol != "") {
        if (vol.substring(0, 1) == '+'){ //signo positivo
          binario += "0";
        }else{ //signo negativo
          binario += "1";
        }
        let mun_segmento = -1;
        for (var i = 0; i < (segments_array.length-1); i++) { //buscar segmento
          //binary_text += i + " s:" +segments_array[i] + " v:" +parseFloat(vol.substring(1)) + " sig:" + segments_array[i+1]+ " "
          if(segments_array[i]<=parseFloat(vol.substring(1)) && segments_array[i+1]>parseFloat(vol.substring(1))){
            mun_segmento = i
              break;
            }
        }

        if(mun_segmento == -1){//verifcar que encontro un segmento -> mun_segmenyo 
          mun_segmento = (segments_array.length-1);
        }
        
        // buscar intervalo

        let mun_intervalo = -1;
        let aux = parseFloat(vol.substring(1)) - segments_array[mun_segmento];
        //console.log("nn",aux, parseFloat(vol.substring(1)), segments_array[mun_segmento]);
        for (var i = 0; i < (interval_array.length-1); i++) { //buscar segmento
          if(interval_array[i]<=aux && interval_array[i+1]>aux){
            mun_intervalo = i
              break;
            }
        }

        if(mun_intervalo == -1){//verifcar que encontro un intervalo -> mun_intervalo, sino significa que es el ultimo 
          mun_intervalo = (interval_array.length);
        }

        // tocar pasar el mun_segmenyo a binario si es 8bits, entonees solo puete tener 3 ceros -> 1 = 001, 4 = 100
        let seg_binario = this.pasarabinario(mun_segmento, 3) //pasar a binario
        let intr_binario = this.pasarabinario(mun_intervalo, 4) //pasar a binario

        binario += seg_binario+""+intr_binario;

        binary_text += binario+" "
      }
    }

    return binary_text //+ this.print_array(segments_array);
  }

  pasarabinario(x: Number, bits: Number){
    let num = x.toString(2);
    while(num.length<bits){
      num ="0"+num
   }
    return num
  }
}
