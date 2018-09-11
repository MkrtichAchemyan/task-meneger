import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import {Observable} from "rxjs/index";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class SocketService {

  constructor(private http: HttpClient) {
  };
  private socket = io.connect("http://localhost:8000");

  sendList(data){
    return this.socket.emit("sendList", data)
  }
  getList(){
    let observable = new Observable(observer => {
      this.socket.on('newList', (data) => {
        observer.next(data);
      })
    });
    return observable
  }

  sendCard(data){
    return this.socket.emit("sendCard", data)
  }
  sendLoopCard(data){
    return this.socket.emit("sendLoopCard", data)
  }
  getCard(){
    let observable = new Observable(observer => {
      this.socket.on('newCard', (data) => {
        observer.next(data);
      })
    });
    return observable
  }
  getLoopCard(){
    let observable = new Observable(observer => {
      this.socket.on('newLoopCard', (data) => {
        observer.next(data);
      })
    });
    return observable
  }
  sendDragableData(data){
    return this.socket.emit("dargableData", data)
  }

  getDragableData(){
    let observable = new Observable(observer => {
      this.socket.on('newDragableData', (data) => {
        observer.next(data);
      })
    });
    return observable
  }
}
