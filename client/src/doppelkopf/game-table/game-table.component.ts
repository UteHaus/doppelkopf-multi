import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/services';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PlayTable } from '../models/play-table.model';
import { PlayTableService } from '../services/play-table.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.less'],
})
export class GameTableComponent implements OnInit {
  table$: Observable<PlayTable>;
  tableId$: Observable<number>;

  constructor(
    private tableService: PlayTableService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.table$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((tableId: number) => this.tableService.getTable(tableId))
    );
  }

  reloadTable() {}
}
