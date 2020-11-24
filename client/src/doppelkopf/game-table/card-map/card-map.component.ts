import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Card } from 'src/doppelkopf/models/card.model';
import { CardUtil } from 'src/doppelkopf/utils/card.util';

@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.less'],
})
export class CardMapComponent implements OnInit, OnDestroy {
  private _cards: Card[];
  private _diamondsAceAsMaster: boolean;
  orderedCards: Card[] = [];

  @Input()
  disabled: boolean;

  @Input()
  set cards(value: Card[]) {
    this._cards = value;
    this.orderCards();
  }

  @Input()
  set diamondsAceAsMaster(value: boolean) {
    this._diamondsAceAsMaster = value;
    this.orderCards();
  }

  @Output()
  cardSelected: Subject<Card> = new Subject<Card>();

  constructor() {}

  ngOnDestroy(): void {
    this.cardSelected.complete();
  }

  ngOnInit(): void {}

  trackCard(card: Card): string {
    return `${card.rank}-${card.suit}`;
  }

  selectCard(card: Card) {
    if (!this.disabled) {
      this.cardSelected.next(card);
    }
  }

  private orderCards() {
    if (this._diamondsAceAsMaster && this._cards && this._cards.length > 0) {
      this.orderedCards = CardUtil.orderCards(
        this._cards,
        this._diamondsAceAsMaster
      );
    }
  }
}
