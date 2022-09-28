import { Component, OnInit } from '@angular/core';
import { CodificationService } from '../codification.service';
import { Codification } from '../codification.model';

@Component({
  selector: 'app-codification',
  templateUrl: './codification.component.html',
  styleUrls: ['./codification.component.css']
})
export class CodificationComponent {

  document: File | null;

  file: any;
  bits: number;
  voltage: number;
  text: string;
  bits_array: Number[];
  binary_text: string;
  ascii_text: string;
  vol_text: string;
  recept_vol_text: string;
  recept_num_text: string;
  recept_letters_text: string;

  segments: string[];
  intervals: string[];

  time: number;
  show_time : boolean;

  imgUrl: any;

  select_file : boolean;
  constructor(
    private codificacionService: CodificationService
  ) {
    this.document = null;

    this.file = null;
    this.bits = 8;
    this.voltage = 1;
    this.text = "";
    this.bits_array = [];
    this.binary_text = "";
    this.ascii_text = "";
    this.vol_text = "";
    this.recept_vol_text = "";
    this.recept_num_text = "";
    this.recept_letters_text = "";
    this.intervals = [];
    this.segments = [];
    this.time = 0;
    this.show_time = false;
    this.select_file = false;
  }

  handleFileInput(event : any) {
    this.file = event.target.files[0]
    let fileReader = new FileReader();
    const filereader = new FileReader();

    if (this.file.type.includes('image') == true) {
      
      filereader.readAsDataURL(this.file)
      const that = this;
  
      filereader.onload = function() {
              that.imgUrl = this.result;
              that.codificacionService.set(this.result);        
      };
    
      
    }else{
      this.imgUrl = "";
      fileReader.readAsText(this.file)
      fileReader.onload = (e) => {
        this.codificacionService.set(fileReader.result)
      }

    } 

  }

  selectFile(event : any) {
    this.select_file = event.target.checked
  }

  codificar(){
    var startTime = performance.now()
    
    if(this.select_file){
      this.text = this.codificacionService.codification.text;
      this.codificacionService.codification.text = this.darFormatoPaquete(this.codificacionService.codification.text, this.file.type);
    }else{
      this.codificacionService.codification.text = this.darFormatoPaquete(this.text, "text/plain");
      //this.text =this.codificacionService.codification.text
    }
    let codificacion = new Codification(this.codificacionService.codification.text, this.bits, '', '')
    this.codificacionService.codification = codificacion
    this.bits_array = this.codificacionService.getArrayBits()
    this.codificacionService.getAsciiText(this.bits_array)
    this.ascii_text = this.codificacionService.codification.ascii_text
    this.binary_text = this.codificacionService.codification.binary_text
    this.vol_text = this.codificacionService.to_vol(this.voltage)
    
    this.segments = this.codificacionService.getSegments()
    this.intervals = this.codificacionService.getIntervals()
    var endTime = performance.now()
    this.time= (endTime - startTime)/1000
    this.show_time = true;
  }  

  hide(){
    this.show_time = false;
  }

  darFormatoPaquete(contenido: string, tipo: string){
    let json = JSON.stringify(
      {
        "paquete": 
          [
            {
              "tipoproceso":"codificar",
              "archivo": { "tipo":tipo, "contenido":contenido},
              "origen":"UD",
            }
            
          ]
      }
      );

    return json;
  }
}
