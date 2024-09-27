import { EventEmitter, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'inplace-input',
  templateUrl: './inplace-input.component.html',
  styleUrls: ['./inplace-input.component.less'],
})
export class InplaceInputComponent {
  private valueBefore: string;
  @Input() value: string;
  @Input() tag: string;
  @Output() focusOut: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  editValue: EventEmitter<InplaceInputComponent> = new EventEmitter<InplaceInputComponent>();
  editMode = false;

  constructor() {
    firstValueFrom(this.focusOut).then(() => this.edit(false));
  }

  onSave(): void {
    this.focusOut.emit(this.value);
    this.edit(false);
  }

  onCancel(): void {
    this.value = this.valueBefore;
    this.edit(false);
  }

  edit(edit: boolean): void {
    this.editMode = edit;
    if (edit) {
      this.valueBefore = this.value;
    }
  }
}
