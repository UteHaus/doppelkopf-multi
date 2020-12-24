import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  announcementSelected = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  setAnnouncements(announcement: string) {
    this.announcementSelected.emit(announcement);
    this.show = false;
  }
}
