import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
list = []
  constructor() { }

  ngOnInit() {
  }
  addColum(AddColum,AddList){
    AddColum.style.display = "none"
    AddList.style.display = "block"
  }
  addList(AddList,AddColum,ListName){
   this.list.push(ListName.value)
    AddList.style.display = "none";
    AddColum.style.display = "block";
  }
}
