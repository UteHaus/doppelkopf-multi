import { Component, Input } from '@angular/core';
import { Card } from 'src/doppelkopf/models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
})
export class CardComponent {
  @Input()
  card: Card;

  @Input()
  withDefaultCard: boolean;

  @Input()
  overlap: boolean;

  constructor() {
    this.withDefaultCard = false;
    this.overlap = false;
  }
}
