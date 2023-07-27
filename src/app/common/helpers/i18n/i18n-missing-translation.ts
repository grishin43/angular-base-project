import {MissingTranslationHandler, MissingTranslationHandlerParams} from "@ngx-translate/core";

export class MissingTranslationService implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    const handledKey: string | undefined = /[^.]*$/.exec(params.key)?.[0];
    return handledKey ? handledKey : (params.key || 'Can`t resolve missing i18n key');
  }
}
