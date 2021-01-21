import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-language-selection',
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.less'],
})
export class LanguageSelectionComponent {
  showLangauges: boolean = false;
  languagesKeys: string[] = ['de', 'hsb', 'en'];
  @Input()
  value: string;
  @Output()
  valueChange = new EventEmitter<string>();

  constructor() {}

  setLanguage(language: string): void {
    this.value = language;
    this.showLangauges = false;
    this.valueChange.emit(language);
  }
}
