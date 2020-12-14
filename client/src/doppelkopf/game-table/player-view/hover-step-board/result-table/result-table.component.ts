import { Component, Input, OnInit } from '@angular/core';
import { TableState } from 'src/doppelkopf/models/table-state.model';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.less'],
})
export class ResultTableComponent implements OnInit {
  @Input()
  tablePlayerState: TableState;

  constructor() {}

  ngOnInit(): void {}
}
