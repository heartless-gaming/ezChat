import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LinkyModule } from 'angular-linky';
import { SafePipe } from './safe.pipe';

import { EmojifyModule } from 'angular2-emojify';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LinkyModule,
    EmojifyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
