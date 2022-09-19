import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-binario',
  templateUrl: './binario.component.html',
  styleUrls: ['./binario.component.css']
})
export class BinarioComponent implements OnInit {

  binary_text : string

  constructor() {
    this.binary_text = ""
  }

  ngOnInit(): void {
  }

}
