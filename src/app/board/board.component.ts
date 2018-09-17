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

    // get data sockets

    this.socketService.getList().subscribe(data => {
      this.arr.push(data);
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

    // drag and drop,,, send data

    this.subs.add(this.dragulaService.drop("dragdrop")
      .subscribe(({name, el, target, source, sibling}) => {
        if (sibling === null) {
          this.socketService.sendDragableData({
            dragCardId: el.id,
            dragListId: source.id,
            dragCardIndex: el["value"],
            dropListId: target.id,
            dropCardId: null
          })
        } else {
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

    // get all data

    this.getService.getAll().subscribe(data => {
      this.arr = data;
    });
  }

  // open new list registr container

  addColum(AddColum, AddList) {
    AddColum.style.display = 'none';
    AddList.style.display = 'block';
  }

  // send new list data

  addList(AddList, AddColum, ListName) {
    this.socketService.sendList(ListName.value);
    setTimeout(() => {
      this.cardAndListConteiner.nativeElement.scrollLeft = this.cardAndListConteiner.nativeElement.scrollWidth;
    }, 100)

    AddList.style.display = 'none';
    AddColum.style.display = 'block';
    ListName.value = '';
  }

// send new card data

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

  // send loop card data

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

  // show card register  container

  addCardColum(AddCardColum, AddCard) {
    AddCardColum.style.display = 'none';
    AddCard.style.display = 'block';
  }

  // close card register  container

  closeAddCardForm(AddCard, AddCardColum) {
    AddCard.style.display = 'none';
    AddCardColum.style.display = 'block';
  }

  // close list register  container

  closeAddListForm(AddList, AddColum) {
    AddList.style.display = 'none';
    AddColum.style.display = 'block';
  }

  // open edit card modal

  editCard(content) {
    this.modalService.open(content);
  }

  // save edited data

  save(modalCardInputValue, modalCardInputId, d) {
    let cardProparty = {
      cardName: modalCardInputValue,
      cardId: modalCardInputId
    }
    this.socketService.sendEditedCard(cardProparty);
    d()
  }

  // open delete card modal

  deleteCard(content) {
    this.modalService.open(content);
  }

  // send delete card data

  delete(cardId, d) {
    this.socketService.sendDeletedCard(cardId);
    d()
  }
}



