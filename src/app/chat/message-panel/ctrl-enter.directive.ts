import { Directive, Output, HostListener } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[ctrlEnter]'
})
export class CtrlEnterDirective {
  @Output() ctrlEnter = new EventEmitter();
  @HostListener('keydown', ['$event'])
  keydown(ev) {
    if (ev.ctrlKey && (ev.keyCode === 13)) {
      this.ctrlEnter.emit('');
    }
  }
  constructor() { }
}
