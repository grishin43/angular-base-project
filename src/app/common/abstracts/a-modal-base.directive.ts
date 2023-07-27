import {Directive, HostListener} from "@angular/core";
import {ADestroyerDirective} from "./a-destroyer.directive";

@Directive()
export abstract class AModalBaseDirective extends ADestroyerDirective {

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.submit();
    }
  }

  abstract submit(): void;
}
