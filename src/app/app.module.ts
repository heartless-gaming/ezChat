import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LinkyModule } from 'angular-linky';
import { SafePipe } from './safe.pipe';

import { EmojifyModule } from 'angular2-emojify';
import { MentionModule } from './mention';

import { NgxAutoScroll } from "ngx-auto-scroll/lib/ngx-auto-scroll.directive";

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    NgxAutoScroll
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LinkyModule,
    EmojifyModule,
    MentionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
