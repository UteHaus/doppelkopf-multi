import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-announcement-selector',
  templateUrl: './announcement-selector.component.html',
  styleUrls: ['./announcement-selector.component.less'],
})
export class AnnouncementSelectorComponent {
  show = false;
  announcements: string[] = ['Re', 'Kontra'];

  @Input()
  announcement: string;
  @Output()
  announcementSelected = new EventEmitter<string>();

  setAnnouncements(announcement: string): void {
    this.announcementSelected.emit(announcement);
    this.show = false;
  }
}
