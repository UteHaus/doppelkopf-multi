import { Component, Input, OnInit } from '@angular/core';
import { TablePlayerState } from 'src/doppelkopf/models/table-player-state.model';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.less'],
})
export class ResultTableComponent implements OnInit {
  @Input()
  tablePlayerState: TablePlayerState;

  constructor() {}

  ngOnInit(): void {}
}
