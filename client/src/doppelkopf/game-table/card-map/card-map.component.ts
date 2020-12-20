import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Card } from 'src/doppelkopf/models/card.model';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';
import { TableMethods } from 'src/doppelkopf/services/table-hub-method.enum';
import { TableHubService } from 'src/doppelkopf/services/table-hub.service';
import { CardUtil } from 'src/doppelkopf/utils/card.util';

@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.less'],
})
export class CardMapComponent implements OnInit, OnDestroy {
  cardsSub: BehaviorSubject<Card[]> = new BehaviorSubject([]);
  private _diamondsAceAsMaster: boolean;
  private _gameVariant: GamesVariants;
  orderedCards: Card[] = [];

  @Input()
  disabled: boolean;

  @Input()
  set gameVariant(value: GamesVariants) {
    this._gameVariant = value;
    this.updateOrderCards();
  }

  @Input()
  set diamondsAceAsMaster(value: boolean) {
    this._diamondsAceAsMaster = value;
    this.updateOrderCards();
  }

  @Output()
  cardSelected: Subject<Card> = new Subject<Card>();

  @Input()
  sourceHubMethode: TableMethods;

  constructor(private hubService: TableHubService) {}

  ngOnDestroy(): void {
    this.cardSelected.complete();
    this.cardsSub.complete();
    this.hubService.offMethode(this.sourceHubMethode);
  }

  ngOnInit(): void {
    this.hubService.onMethode(this.sourceHubMethode, (data) => {
      this.cardsSub.next(data);
      this.updateOrderCards();
    });
    this.hubService.invokeMethode(this.sourceHubMethode);
  }

  trackCard(card: Card): string {
    return `${card.rank}-${card.suit}`;
  }

  selectCard(card: Card, index: number) {
    if (!this.disabled) {
      this.cardSelected.next(card);
      this.orderedCards.splice(index, 1);
    }
  }

  private updateOrderCards(): void {
    if (
      this._diamondsAceAsMaster != undefined &&
      this.cardsSub.value &&
      this.cardsSub.value.length > 0
    ) {
      this.orderedCards = CardUtil.orderCards(
        this.cardsSub.value,
        this._gameVariant,
        this._diamondsAceAsMaster
      );
    }
  }
}
