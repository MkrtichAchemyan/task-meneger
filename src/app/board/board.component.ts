import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SocketService} from '../socket.service';
import {GetService} from '../get.sevice';
import {Subscription} from 'rxjs';
import {DragulaService} from 'ng2-dragula';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})


export class BoardComponent implements OnInit,OnDestroy {
  arr;
  public index;
  // @ViewChild('Nav1') nav1
  // @ViewChild('Body') body
  MANY_ITEMS = 'MANY_ITEMS';
  subs = new Subscription();
  constructor(private socketService: SocketService, private getService: GetService, private dragulaService:DragulaService) {

    this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        console.log('dropModel:');
        console.log(el, "el");
        console.log(source, "source");
        console.log(target , "target");
        console.log(sourceModel, "sourceModel");
        console.log(targetModel, "targetModel");
        console.log(item, "item");
      })
    );
    this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
      .subscribe(({ el, source, item, sourceModel }) => {
        console.log('removeModel:');
        console.log(el, "el");
        console.log(source, "source");
        console.log(sourceModel, "sourceModel");
        console.log(item, "item");
      })
    );

    this.socketService.getList().subscribe(data => {
      this.arr.push(data);
      console.log(this.arr, "--------------------------")
    });

    this.socketService.getCard().subscribe(data => {
      this.arr[this.index].card.push(data['cardName']);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


  ngOnInit() {
    this.getService.getAll().subscribe(data =>{
      console.log(data, "+++++++++++++++++++++++++++++++++++")
      //console.dir(this.body)
      this.arr = data;
      // this.nav1.style.width = window.
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
