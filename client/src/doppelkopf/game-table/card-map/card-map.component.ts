import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Card } from 'src/doppelkopf/models/card.model';

@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.less'],
})
export class CardMapComponent implements OnInit, OnDestroy {
  @Input()
  disabled: boolean;

  @Input()
  cards: Card[];

  @Output()
  cardSelected: Subject<Card> = new Subject<Card>();

  constructor() {}

  ngOnDestroy(): void {
    this.cardSelected.complete();
  }

  ngOnInit(): void {}

  trackCard(index: number, card: Card): string {
    return `${card.rank}-${card.suit}`;
  }

  selectCard(card: Card) {
    if (!this.disabled) {
      this.cardSelected.next(card);
    }
  }
}
