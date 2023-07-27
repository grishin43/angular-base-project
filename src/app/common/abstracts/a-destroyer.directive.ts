import {Directive, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

@Directive()
export abstract class ADestroyerDirective implements OnDestroy {
  protected subs: Subscription = new Subscription();

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
