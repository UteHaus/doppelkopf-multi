import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-announcement-selector',
  templateUrl: './announcement-selector.component.html',
  styleUrls: ['./announcement-selector.component.less'],
})
export class AnnouncementSelectorComponent implements OnInit {
  show: boolean = false;
  announcements: string[] = ['Re', 'Kontra'];

  @Input()
  announcement: string;
  @Output()
  announcementSelected: EventEmitter = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  setAnnouncements(announcement: string) {
    this.announcementSelected.emit(announcement);
  }
}
