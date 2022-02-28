import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.less'],
})
export class CardMapComponent {
  @Input()
  playerCards: Card[] = [];

  @Input()
  disabled: boolean;

  @Output()
  cardSelected: Subject<Card> = new Subject<Card>();

  trackCard(card: Card): string {
    return `${card.rank}-${card.suit}`;
  }

  selectCard(card: Card, autoSet = false): void {
    if (!this.disabled || autoSet) {
      this.cardSelected.next(card);
    }
  }

  setLastCard(): void {
    if (this.playerCards.length == 1) {
      this.selectCard(this.playerCards[0], true);
    }
  }
}
