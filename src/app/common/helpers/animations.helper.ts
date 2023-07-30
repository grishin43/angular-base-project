import {animate, AnimationTriggerMetadata, style, transition, trigger} from "@angular/animations";

export class AnimationsHelper {

  public static get fadeInOut(): AnimationTriggerMetadata[] {
    return [
      trigger(
        'fadeInOut', [
          transition(':enter', [
            style({visibility: 'hidden', opacity: 0}),
            animate('250ms', style({visibility: 'visible', opacity: 1}))
          ]),
          transition(':leave', [
            style({visibility: 'visible', opacity: 1}),
            animate('250ms', style({visibility: 'hidden', opacity: 0}))
          ])
        ]
      )
    ];
  }

}
