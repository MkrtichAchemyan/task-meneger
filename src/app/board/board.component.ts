import {Component, OnInit} from '@angular/core';
import {SocketService} from '../socket.service';
import {GetService} from '../get.sevice';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {
  arr = [];
  public index;

  constructor(private socketService: SocketService, private getService: GetService) {
    this.socketService.getList().subscribe(data => {
      this.arr.push(data);
    });

    this.socketService.getCard().subscribe(data => {
      this.arr[this.index].card.push(data['cardName']);
    });
  }

  ngOnInit() {
    this.getService.getAll().subscribe(data =>{
      console.log(data, "+++++++++++++++++++++++++++++++++++")
      this.arr.push(data);
    })
  }

  addColum(AddColum, AddList) {
    AddColum.style.display = 'none';
    AddList.style.display = 'block';
  }

  addList(AddList, AddColum, ListName) {
    this.socketService.sendList(ListName.value)


    AddList.style.display = 'none';
    AddColum.style.display = 'block';
    ListName.value = "";
  }

  addCard(AddCard, AddCardColum, CardName, index) {
    this.index = index
    this.socketService.sendCard({
      id:this.arr[index]._id,
      cardName: CardName.value
    })

    AddCard.style.display = 'none';
    AddCardColum.style.display = 'block';
    CardName.value = ""
  }

  addCardColum(AddCardColum, AddCard) {
    AddCardColum.style.display = 'none';
    AddCard.style.display = 'block';
  }
}
