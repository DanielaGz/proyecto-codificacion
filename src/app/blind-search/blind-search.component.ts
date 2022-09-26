import { Component, OnInit } from '@angular/core';
import { BlindSearchService } from '../blind-search.service';
import { Codification } from '../codification.model';

@Component({
  selector: 'app-blind-search',
  templateUrl: './blind-search.component.html',
  styleUrls: ['./blind-search.component.css']
})
export class BlindSearchComponent {

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
    private blindSearchService: BlindSearchService
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
      this.blindSearchService.set(fileReader.result)
    }
  }

  selectFile(event : any) {
    this.select_file = event.target.checked
  }


  decodificar(){

    const listaBistBusqueda = [8,9,10];
    var startTime = performance.now()

    if(this.select_file){
      this.vol_text =this.blindSearchService.codification.text
    }else{
      this.blindSearchService.codification.text = this.vol_text
    }

    for(const bit of listaBistBusqueda) {
      this.bits = bit;
      console.log(this.bits, "----------")
      let codificacion = new Codification(this.vol_text, this.bits, '', '')
      this.blindSearchService.codification = codificacion
      this.bits_array = this.blindSearchService.getArrayBits(this.blindSearchService.codification.bits)
      this.blindSearchService.createTables(this.voltage)
      
      this.segments = this.blindSearchService.getSegments()
      this.intervals = this.blindSearchService.getIntervals()
      //receptor
      this.recept_vol_text = this.blindSearchService.vol_to_binaria(this.voltage,this.vol_text);
      this.recept_num_text = this.blindSearchService.binaria_to_number(this.recept_vol_text);
      this.recept_letters_text = this.blindSearchService.num_to_asciiletters(this.recept_num_text);
  
      let j = this.ConvertiraJSON(this.recept_letters_text)
      
      if (j != false){
        this.recept_letters_text = j.paquete[0].archivo.contenido;
        if (j.paquete[0].archivo.tipo.includes('image') == true) {
          this.imgUrl = this.recept_letters_text
        }
        break;
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
