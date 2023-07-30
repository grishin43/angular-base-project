import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {LocalStorageKey} from "../local-storage/local-storage-key.enum";
import {LangEnum} from "../../common/enums/lang.enum";

@Injectable()
export class I18nService {
  readonly langList: string[] = Object.values(LangEnum);

  constructor(
    private translate: TranslateService,
    private localStorage: LocalStorageService
  ) {
  }

  public get defaultLang(): string {
    return this.translate.defaultLang;
  }

  public get otherLanguages(): string[] {
    return this.langList.filter((l: string) => l !== this.defaultLang);
  }

  public setupLanguages(): void {
    let userLang: string | undefined = this.localStorage.getItem(LocalStorageKey.LANGUAGE);
    if (!userLang?.length) {
      userLang = this.translate.getBrowserLang();
    }
    if (this.langList.indexOf(userLang as LangEnum) > -1) {
      this.translate.setDefaultLang(userLang as string);
    } else {
      this.translate.setDefaultLang(this.langList[0]);
    }
  }

  public getLanguage(): string {
    return this.translate.defaultLang
      || this.localStorage.getItem(LocalStorageKey.LANGUAGE) as string
      || this.translate.getBrowserLang() as string;
  }

  public switchLanguage(lang: string): void {
    this.translate.setDefaultLang(lang);
    this.localStorage.setItem(LocalStorageKey.LANGUAGE, lang);
  }

}
