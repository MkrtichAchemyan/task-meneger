import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BoardComponent } from './board/board.component';
import {GetService} from './get.sevice';
import {SocketService} from './socket.service';
import { DragulaModule } from 'ng2-dragula';



@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DragulaModule.forRoot(),
  ],
  providers: [
    GetService,
    SocketService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
