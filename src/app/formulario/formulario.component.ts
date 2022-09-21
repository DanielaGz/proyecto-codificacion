import { Component, OnInit } from '@angular/core';
import { CodificationService } from '../codification.service';
import { Codification } from '../codification.model';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

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
  }

  handleFileInput(event : any) {
    this.file = event.target.files[0]
    let fileReader = new FileReader();

    fileReader.readAsText(this.file)
    fileReader.onload = (e) => {
      this.codificacionService.set(fileReader.result)
    }
    
  }

  setCodificationObject() {
    let document = new Codification(
      this.text,
      this.bits,
      "",
      ""
    )
    this.codificacionService.setCodificationObject(document)
  }

  codificar(){
    this.text =this.codificacionService.codification.text
    let codificacion = new Codification(this.codificacionService.codification.text, this.bits, '', '')
    this.codificacionService.codification = codificacion
    this.bits_array = this.codificacionService.getArrayBits()
    this.codificacionService.getAsciiText(this.bits_array)
    this.ascii_text = this.codificacionService.codification.ascii_text
    this.binary_text = this.codificacionService.codification.binary_text
    this.vol_text = this.codificacionService.to_vol(this.voltage)
    
    this.segments = this.codificacionService.getSegments()
    this.intervals = this.codificacionService.getIntervals()
    //receptor
    this.recept_vol_text = this.codificacionService.vol_to_binaria(this.voltage,this.vol_text);
    this.recept_num_text = this.codificacionService.binaria_to_number(this.recept_vol_text);
    this.recept_letters_text = this.codificacionService.num_to_asciiletters(this.recept_num_text);
  }  

}
