import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Card } from '../../models/card.model';
import { PlayTableService } from '../../services/play-table.service';

@Component({
  selector: 'app-last-stich',
  templateUrl: './last-stich.component.html',
  styleUrls: ['./last-stich.component.less'],
})
export class LastStichComponent implements OnInit, OnDestroy {
  private tableIdSub: Subject<number>;
  stichCards$: Observable<Card[]>;

  @Input()
  tableId: number;

  constructor(private tableService: PlayTableService) {}

  ngOnDestroy(): void {
    this.tableIdSub.complete();
  }

  ngOnInit(): void {
    this.tableIdSub = new Subject<number>();
    this.stichCards$ = this.tableService.getLastCardStich(this.tableId);
  }
}
