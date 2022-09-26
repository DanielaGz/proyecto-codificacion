import { EventEmitter, Injectable } from "@angular/core";
import { Codification } from "./codification.model";

@Injectable()
export class BlindSearchService{
  codification: Codification = new Codification('', 0,'','');
  intervals: Number[];
  segments: Number[];

  bits = {
    "8": {
      "intervals" : 16,
      "segments" : 8,
      "seg" : 3,
      "int" : 4
    },
    "9": {
      "intervals" : 16,
      "segments" : 16,
      "seg" : 4,
      "int" : 4
    },
    "10": {
      "intervals" : 16,
      "segments" : 32,
      "seg" : 5,
      "int" : 4
    }
  }

  constructor(){
    this.intervals = []
    this.segments = []
  }

  getIntervals(){
    let aux = []
    for (var i = 0; i < (this.intervals.length-1); i++){
      aux.push(this.intervals[i] + '-' + this.intervals[i+1])
    }
    return aux
  }

  getSegments(){
    let aux = []
    for (var i = 0; i < (this.segments.length-1); i++){
      aux.push(this.segments[i] + '-' + this.segments[i+1])
    }
    return aux
  }

  set(val : any){
    if (typeof(val) == 'string'){
      this.codification.text = val
    }
  }

  setCodificationObject(codification : Codification){
    this.codification = codification
  }

  getArrayBits(num : number){
    let bits_array = []

    for (var i = (num - 1); i >= 0; i--) {
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
      message += this.to_by(char, bits_array)+" "
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
    return message
  }

  createTables(voltage : number){
    let cant_interval = (this.bits as any)[this.codification.bits]['intervals'];
    //console.log(cant_interval)
    let segments_array = [this.codification.bits]; //8
    let interval_array = [cant_interval]; //16
    let tam_interval = voltage / (cant_interval * this.codification.bits) //x, vol = 1
    segments_array = this.to_segmento(tam_interval);
    this.segments = segments_array
    interval_array = this.to_interval(tam_interval);
    this.intervals = interval_array
  }  

  to_segmento(tam_intervalo: Number) {
    let cant_interval = (this.bits as any)[this.codification.bits]['intervals'];
    let segments_array = [0,];
    let tam = (Number(tam_intervalo)*1000) * cant_interval;
    for (var i = 1; i <= this.codification.bits; i++) {
      segments_array.push(Number(i * tam));
    }
    return segments_array
  }

  to_interval(tam_intervalo: Number) {
    let cant_interval = (this.bits as any)[this.codification.bits]['intervals'];
    let interval_array = [];
    let tam = Number(tam_intervalo)*1000;
    for (var i = 0; i <= cant_interval; i++) {
      interval_array.push(Number(i * tam).toFixed(5));
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

    let binary_text = ""
    
    for (const vol of vol_text.split(" ")) {
      let binario = ""
      if (vol != "") {
        if (vol.substring(0, 1) == '+'){ //signo positivo
          binario += "0";
        }else{ //signo negativo
          binario += "1";
        }
        let mun_segmento = -1;
        for (var i = 0; i < (this.segments.length-1); i++) { //buscar segmento
          //binary_text += i + " s:" +segments_array[i] + " v:" +parseFloat(vol.substring(1)) + " sig:" + segments_array[i+1]+ " "
          if(this.segments[i]<=parseFloat(vol.substring(1)) && this.segments[i+1]>parseFloat(vol.substring(1))){
            mun_segmento = i
              break;
            }
        }

        if(mun_segmento == -1){//verifcar que encontro un segmento -> mun_segmenyo 
          mun_segmento = (this.intervals.length-1);
        }
        
        // buscar intervalo

        let mun_intervalo = -1;
        let aux = Number((parseFloat(vol.substring(1)) - Number(this.segments[mun_segmento])).toFixed(5));
        //console.log(aux)
        //console.log("nn",aux, parseFloat(vol.substring(1)), segments_array[mun_segmento]);
        for (var i = 0; i < (this.intervals.length-1); i++) { //buscar segmento
          if(this.intervals[i]<=aux && this.intervals[i+1]>aux){
            mun_intervalo = i
              break;
            }
        }

        if(mun_intervalo == -1){//verifcar que encontro un intervalo -> mun_intervalo, sino significa que es el ultimo 
          mun_intervalo = (this.intervals.length);
        }

        // tocar pasar el mun_segmenyo a binario si es 8bits, entonees solo puete tener 3 ceros -> 1 = 001, 4 = 100
        let seg_binario = this.to_by(mun_segmento, this.getArrayBits((this.bits as any)[this.codification.bits]['seg'])) //pasar a binario
        let intr_binario = this.to_by(mun_intervalo, this.getArrayBits((this.bits as any)[this.codification.bits]['int'])) //pasar a binario

        //console.log(mun_segmento+" "+seg_binario)
        //console.log(mun_intervalo+" "+intr_binario)
        //console.log('-------------------')


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

  binaria_to_number(binari_text: string){
    let num_text = "";
    for (const bin of binari_text.split(" ")) {
      if (bin != "") {
        num_text += this.Binary_to_Decimal(bin)+","
      }
    }
    return num_text
  }

  num_to_asciiletters(num_text: string){
    let letters_text = "";
    for (const num of num_text.split(",")) {
      if (num != "") {
      letters_text += String.fromCharCode(parseInt(num))+"";
      }
    }
    return letters_text
  }
}

