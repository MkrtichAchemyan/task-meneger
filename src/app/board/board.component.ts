import {Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SocketService} from '../socket.service';
import {GetService} from '../get.sevice';
import {Subscription} from 'rxjs';
import {DragulaService} from 'ng2-dragula';
import {DOCUMENT} from '@angular/common';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [NgbModalConfig, NgbModal]
})


export class BoardComponent implements OnInit, OnDestroy {
  arr;
  subs = new Subscription()
  public index;
  optionValue;
  @ViewChild('cardAndListConteiner') cardAndListConteiner: ElementRef;
  @Inject(DOCUMENT) document: ElementRef;

  constructor(private socketService: SocketService, private getService: GetService, private dragulaService: DragulaService, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.socketService.getList().subscribe(data => {
      this.arr.push(data);
      // this.arr[this.arr.length - 1].card.push("")
    });

    this.socketService.getCard().subscribe(data => {
      this.arr = data;
    });
    this.socketService.getLoopCard().subscribe(data => {
      this.arr = data;
    });
    this.socketService.getDragableData().subscribe(data => {
      this.arr = data;
    })
    this.socketService.getEditedCard().subscribe(data => {
      this.arr = data;
    })
    this.socketService.getDeletedCard().subscribe(data => {
      this.arr = data;
    })

    this.subs.add(this.dragulaService.drop("dragdrop")
      .subscribe(({name, el, target, source, sibling}) => {
        // console.log('dropModel:');
        // console.dir(el);
        // console.dir(source);
        // console.dir(target);
        // console.dir(sibling);
        // var data = {
        //   dragCardId: el.id,
        //   dragListId: source.id,
        //   dragCardIndex: el["value"],
        //   dropListId: target.id,
        //   dropCardIndex: sibling["value"]
        // }
        // console.log(sibling.id, "sibling['value']");
        if (sibling === null) {
          console.log("11111111111111111")
          this.socketService.sendDragableData({
            dragCardId: el.id,
            dragListId: source.id,
            dragCardIndex: el["value"],
            dropListId: target.id,
            dropCardId: null
          })
        } else {
          console.log("222222222222222")
          this.socketService.sendDragableData({
            dragCardId: el.id,
            dragListId: source.id,
            dragCardIndex: el["value"],
            dropListId: target.id,
            dropCardId: sibling["id"]
          })
        }

      })
    );


  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.getService.getAll().subscribe(data => {
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
      this.cardAndListConteiner.nativeElement.scrollLeft = this.cardAndListConteiner.nativeElement.scrollWidth;
    }, 100)

    AddList.style.display = 'none';
    AddColum.style.display = 'block';
    ListName.value = '';
  }


  addCard(AddCard, AddCardColum, CardName, index) {
    this.socketService.sendCard({
      id: index,
      cardName: CardName.value
    });
    let cardAndListConteiner = document.getElementById(index)
    setTimeout(() => {
      cardAndListConteiner.scrollTop = cardAndListConteiner.scrollHeight;
    }, 100)
    AddCard.style.display = 'none';
    AddCardColum.style.display = 'block';
    CardName.value = '';
  }

  addLoopCard(AddCard, AddCardColum, CardName, index) {
    if (this.optionValue === undefined) {
      this.socketService.sendLoopCard({
        id: index,
        cardName: CardName.value,
        selectedValue: "1"
      });
    }
    else{
      this.socketService.sendLoopCard({
        id: index,
        cardName: CardName.value,
        selectedValue: this.optionValue
      });
      this.optionValue = undefined
    }
    let cardAndListConteiner = document.getElementById(index)
    setTimeout(() => {
      cardAndListConteiner.scrollTop = cardAndListConteiner.scrollHeight;
    }, 100)
    AddCard.style.display = 'none';
    AddCardColum.style.display = 'block';
    CardName.value = '';
  }

  addCardColum(AddCardColum, AddCard) {
    AddCardColum.style.display = 'none';
    AddCard.style.display = 'block';
  }

  closeAddCardForm(AddCard, AddCardColum) {
    AddCard.style.display = 'none';
    AddCardColum.style.display = 'block';
  }

  closeAddListForm(AddList, AddColum) {
    AddList.style.display = 'none';
    AddColum.style.display = 'block';
  }

  editCard(content) {
    console.log(content)
    this.modalService.open(content);
  }

  save(modalCardInputValue, modalCardInputId, d) {
    let cardProparty = {
      cardName: modalCardInputValue,
      cardId: modalCardInputId
    }
    this.socketService.sendEditedCard(cardProparty);
    d()
  }

  deleteCard(content) {
    console.log(content)
    this.modalService.open(content);
  }

  delete(cardId, d) {
    this.socketService.sendDeletedCard(cardId);
    d()
  }
  selectOptinValue(event){
    this.optionValue = event
  }
}









