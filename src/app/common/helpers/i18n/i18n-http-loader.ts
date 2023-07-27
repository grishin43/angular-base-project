import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import packageJson from "package.json";

export function HttpLoaderFactory(http: HttpClient) {
  const verSuffix: string | number = packageJson && packageJson.version ? packageJson.version.replace(/\D/g, '') : Date.now();
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + verSuffix);
}
