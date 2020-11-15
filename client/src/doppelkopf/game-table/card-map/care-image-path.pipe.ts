import { Pipe, PipeTransform } from '@angular/core';
import { Card, Ranks, Suits } from 'src/doppelkopf/models/card.model';

@Pipe({
  name: 'careImagePath',
})
export class CareImagePathPipe implements PipeTransform {
  transform(value: Card, ...args: unknown[]): unknown {
    if (!value)
      return args && args[0] ? '/assets/images/cards/default-card.png' : '';

    var cartSuit = '';
    var cartRank = '';
    switch (value.suit) {
      case Suits.hearts:
        cartSuit = 'herz';
        break;
      case Suits.diamonds:
        cartSuit = 'shell';
        break;
      case Suits.clubs:
        cartSuit = 'eichel';
        break;
      case Suits.spades:
        cartSuit = 'blatt';
        break;
      default:
        break;
    }

    switch (value.rank) {
      case Ranks.king:
        cartRank = 'koenig';
        break;
      case Ranks.ace:
        cartRank = 'ass';
        break;
      case Ranks.ten:
        cartRank = '10';
        break;
      case Ranks.queen:
        cartRank = 'ober';
        break;
      case Ranks.jack:
        cartRank = 'unter';
        break;
      default:
        break;
    }

    return `/assets/images/cards/${cartSuit}-${cartRank}.png`;
  }
}
