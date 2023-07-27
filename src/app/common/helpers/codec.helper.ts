import {Base64} from 'js-base64';

export class CodecHelper {

  public static encodeData(data: any): string | undefined {
    try {
      return Base64.encode(JSON.stringify(data));
    } catch (e) {
      return undefined;
    }
  }

  public static decodeData(data: string): any {
    try {
      return JSON.parse(Base64.decode(data));
    } catch (e) {
      return undefined;
    }
  }

}
