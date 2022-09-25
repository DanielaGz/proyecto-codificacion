import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularioComponent } from './formulario/formulario.component';
import { HeaderComponent } from './header/header.component';
import { CodificationService } from './codification.service';
import { DecodificationService } from './decodification.service';
import { BlindSearchService } from './blind-search.service';
import { FooterComponent } from './footer/footer.component';
import { CodificationComponent } from './codification/codification.component';
import { DecodificationComponent } from './decodification/decodification.component';
import { BlindSearchComponent } from './blind-search/blind-search.component';

@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    HeaderComponent,
    FooterComponent,
    CodificationComponent,
    DecodificationComponent,
    BlindSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    CodificationService,
    DecodificationService,
    BlindSearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
