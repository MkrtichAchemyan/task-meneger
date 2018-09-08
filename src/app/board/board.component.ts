import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SocketService} from '../socket.service';
import {GetService} from '../get.sevice';
import {Subscription} from 'rxjs';
import {DragulaService} from 'ng2-dragula';
import {DOCUMENT} from '@angular/common';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})


export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  arr;
  subs =new Subscription()
  public index;
  @ViewChild('header') nav1;
  @Inject(DOCUMENT) document: ElementRef;
  constructor(private socketService: SocketService, private getService: GetService, private dragulaService: DragulaService,) {
    this.socketService.getList().subscribe(data => {
      console.log(data, "getList------------------------");
      this.arr.push(data);
      // this.arr[this.arr.length - 1].card.push("")
      console.log(this.arr.length, '--------------------------', this.arr);
    });

    this.socketService.getCard().subscribe(data => {
      console.log(data, " --------------getCard");
      console.log(this.arr);
      console.log(this.index)
      this.arr.find(list => list._id === data["listId"]).card.push(data);
      console.log(this.arr)
    });

    this.socketService.getDragableData().subscribe(data => {
      this.arr = data;
    })

    this.subs.add(this.dragulaService.drop("dragdrop")
      .subscribe(({ name, el, target, source, sibling }) => {
        console.log('dropModel:');
        console.log(el);
        console.log(source);
        console.log(target);
        console.dir(sibling);
       var data = {
         dragListId: el.id,
         dragCardId: source.id,
         dragCardIndex: el["value"],
         dropListId: target.id,
         dropCardIndex: sibling["value"]
       }
       this.socketService.sendDragableData(data)
      })
    );


  }
  ngOnDestroy() {
     this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(document.body.scrollWidth);
      document.body.scrollLeft = document.body.scrollWidth + 118;
      console.log(document.body.scrollLeft);
    }, 100);
  }


  ngOnInit() {
    this.getService.getAll().subscribe(data => {
      console.log(data, '+++++++++++++++++++++++++++++++++++');
      this.arr = data;
    });
  }

  addColum(AddColum, AddList) {
    AddColum.style.display = 'none';
    AddList.style.display = 'block';
  }

  addList(AddList, AddColum, ListName) {
    this.socketService.sendList(ListName.value);
    setTimeout(() => {
      console.log(document.body.scrollLeft);
      document.body.scrollLeft = document.body.scrollWidth;
      console.log(document.body.scrollLeft);
    }, 100);

    AddList.style.display = 'none';
    AddColum.style.display = 'block';
    ListName.value = '';
  }


  addCard(AddCard, AddCardColum, CardName, index) {

    this.index = index;
    this.socketService.sendCard({
      id: index,
      cardName: CardName.value
    });

    AddCard.style.display = 'none';
    AddCardColum.style.display = 'block';
    CardName.value = '';
  }

  addCardColum(AddCardColum, AddCard) {
    AddCardColum.style.display = 'none';
    AddCard.style.display = 'block';
  }
}




