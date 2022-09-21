import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularioComponent } from './formulario/formulario.component';
import { HeaderComponent } from './header/header.component';
import { CodificationService } from './codification.service';

@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    CodificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
