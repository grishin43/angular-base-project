import {Directive, HostListener, Input} from '@angular/core';
import {ClipboardService} from "ngx-clipboard";

@Directive({
  selector: '[copyToClipboard]'
})
export class CopyToClipboardDirective {
  @Input() clipboardText!: string | undefined;

  constructor(
    private clipboardService: ClipboardService
  ) {
  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.clipboardText) {
      this.clipboardService.copy(this.clipboardText);
    } else {
      console.error('Text to copy is undefined, check input params')
    }
  }

}
