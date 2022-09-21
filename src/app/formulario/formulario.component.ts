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

  file: File | null;
  bits: number;
  voltage: number;
  text: string;
  bits_array: Number[];
  binary_text: string;
  ascii_text: string;
  vol_text: string;
  recept_vol_text: string;

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
  }

  handleFileInput(event : any) {
    this.file = event.target.files[0]
    console.log(this.file)
    let texto = ''

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    }
    if(this.file != null)
      console.log(typeof(fileReader.readAsText(this.file)))

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
    let codificacion = new Codification(this.text, this.bits, '', '')
    this.codificacionService.codification = codificacion
    this.bits_array = this.codificacionService.getArrayBits()
    this.codificacionService.getAsciiText(this.bits_array)
    this.ascii_text = this.codificacionService.codification.ascii_text
    this.binary_text = this.codificacionService.codification.binary_text
    this.vol_text = this.codificacionService.to_vol(this.voltage)
    //receptor
    this.recept_vol_text = this.codificacionService.vol_to_binaria(this.voltage,this.vol_text);

  }  

}
