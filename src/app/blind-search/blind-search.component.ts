import { Component, OnInit } from '@angular/core';
import { BlindSearchService } from '../blind-search.service';
import { CodificationService } from '../codification.service';
import { Codification } from '../codification.model';
import { and } from 'ajv/dist/compile/codegen';

@Component({
  selector: 'app-blind-search',
  templateUrl: './blind-search.component.html',
  styleUrls: ['./blind-search.component.css']
})
export class BlindSearchComponent {

  document: File | null;

  file: any;
  bits: number;
  metodo: number;
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
    private blindSearchService: BlindSearchService,
    private codificacionService: CodificationService
  ) {
    this.document = null;

    this.file = null;
    this.metodo = 1;
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

    let bits_array2: Number[] = [];
    let ascii_text2 = "";
    let binary_text2 = "";
    let vol_text2 = "";

    for(const bit of listaBistBusqueda) {
      this.bits = bit;

      let codificacion = new Codification(this.vol_text, this.bits, '', '')
      this.blindSearchService.codification = codificacion
      this.bits_array = this.blindSearchService.getArrayBits(this.blindSearchService.codification.bits)
      this.blindSearchService.createTables(this.voltage)
      
      //receptor
      this.recept_vol_text = this.blindSearchService.vol_to_binaria(this.voltage,this.vol_text);
      this.recept_num_text = this.blindSearchService.binaria_to_number(this.recept_vol_text);
      this.recept_letters_text = this.blindSearchService.num_to_asciiletters(this.recept_num_text);
      
      if(this.metodo == 1){
        let j = this.ConvertiraJSON(this.recept_letters_text)
        
        if (j != false){
          this.recept_letters_text = j.paquete[0].archivo.contenido;
          
          break;
        }
      }else{
        let cant_revisar = 15;
        let voltajes_origen = this.vol_text.split(" ");
        if (voltajes_origen.length < 15){
          cant_revisar = voltajes_origen.length;
        }

        let codificacion2 = new Codification(this.recept_letters_text.substring(0, cant_revisar), this.bits, '', '')
        this.codificacionService.codification = codificacion2
        bits_array2 = this.codificacionService.getArrayBits()
        this.codificacionService.getAsciiText(bits_array2)
        ascii_text2 = this.codificacionService.codification.ascii_text
        binary_text2 = this.codificacionService.codification.binary_text
        vol_text2 = this.codificacionService.to_vol(this.voltage)
        
        if(this.compararVoltajes(voltajes_origen, vol_text2.split(" "), Number(this.blindSearchService.tam_interval)*1000)){
          
          let j = this.ConvertiraJSON(this.recept_letters_text)
          if (j != false){
            this.recept_letters_text = j.paquete[0].archivo.contenido;
          }
          
          break;
        }

      }
      
    }

    if (this.recept_letters_text.includes('data:image/') == true) {
      this.imgUrl = this.recept_letters_text
    }

    this.segments = this.blindSearchService.getSegments()
    this.intervals = this.blindSearchService.getIntervals()
    
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

  compararVoltajes(vol1: String[], vol2: String[], tam: Number){
    let leng = vol2.length;
    let v1 = 0;
    let v2 = 0;
    if(vol1.length < vol2.length){
      leng = vol1.length 
    }

    for (var i = 0; i < leng-1; i++) {
      v1 = Number(vol1[i].substring(1))
      v2 = Number(vol2[i].substring(1))
      console.log(v1, v2)
      if( v1 != v2 || (   (v1-Number(tam)/2 >= v2 )  && v2 <=(v1+Number(tam)/2) )  ){
        
        return false;
      }
     

    }
    return true;
  }

}
