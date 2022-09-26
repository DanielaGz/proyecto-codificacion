import { Component, OnInit } from '@angular/core';
import { DecodificationService } from '../decodification.service';
import { Codification } from '../codification.model';

@Component({
  selector: 'app-decodification',
  templateUrl: './decodification.component.html',
  styleUrls: ['./decodification.component.css']
})
export class DecodificationComponent {

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

  select_file : boolean;

  imgUrl: any;

  constructor(
    private decodificacionService: DecodificationService
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

    fileReader.readAsText(this.file)
    fileReader.onload = (e) => {
      this.decodificacionService.set(fileReader.result)
    }
  }

  selectFile(event : any) {
    this.select_file = event.target.checked
  }


  decodificar(){
    var startTime = performance.now()
    if(this.select_file){
      this.vol_text =this.decodificacionService.codification.text
    }else{
      this.decodificacionService.codification.text = this.vol_text
    }
    let codificacion = new Codification(this.vol_text, this.bits, '', '')
    this.decodificacionService.codification = codificacion
    this.bits_array = this.decodificacionService.getArrayBits(this.decodificacionService.codification.bits)
    this.decodificacionService.createTables(this.voltage)
    
    this.segments = this.decodificacionService.getSegments()
    this.intervals = this.decodificacionService.getIntervals()
    //receptor
    this.recept_vol_text = this.decodificacionService.vol_to_binaria(this.voltage,this.vol_text);
    this.recept_num_text = this.decodificacionService.binaria_to_number(this.recept_vol_text);
    this.recept_letters_text = this.decodificacionService.num_to_asciiletters(this.recept_num_text);

    let j = this.ConvertiraJSON(this.recept_letters_text)
    if (j != false){
      this.recept_letters_text = j.paquete[0].archivo.contenido;
      if (j.paquete[0].archivo.tipo.includes('image') == true) {
        this.imgUrl = this.recept_letters_text
      }
    }
    
    var endTime = performance.now()
    this.time= (endTime - startTime)/1000
    this.show_time = true;
  }  

  hide(){
    this.show_time = false;
  }

  ConvertiraJSON(x: string){
    let j: any;
    try {
      j = JSON.parse(x); // Convertir Texto en formato Json en un Objeto/Arreglo
    } catch (error) {
      console.error("Error Convetir a JSON");
      return false;
    }

    return j;
  }

}
