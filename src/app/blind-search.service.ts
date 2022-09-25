import { EventEmitter, Injectable } from "@angular/core";
import { Codification } from "./codification.model";

@Injectable()
export class BlindSearchService{
  codification: Codification = new Codification('', 0,'','');
  intervals: Number[];
  segments: Number[];

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
    this.segments = segments_array
    interval_array = this.to_interval(tam_interval);
    this.intervals = interval_array
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
    let tam = (Number(tam_intervalo)*1000) * 16;
    for (var i = 1; i <= this.codification.bits; i++) {
      segments_array.push(Number(i * tam));
    }
    return segments_array
  }

  to_interval(tam_intervalo: Number) {
    let interval_array = [];
    let tam = Number(tam_intervalo)*1000;
    for (var i = 0; i <= 16; i++) {
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
}
