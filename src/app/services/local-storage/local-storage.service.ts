import {Inject, Injectable} from '@angular/core';
import {CodecHelper} from "../../common/helpers/codec.helper";

@Injectable()
export class LocalStorageService {

  constructor(
    @Inject(Window) private windowRef: Window
  ) {
  }

  public getItem(key: string): any | undefined {
    try {
      return CodecHelper.decodeData(
        this.windowRef.localStorage.getItem(
          CodecHelper.encodeData(key) as string
        ) as string
      );
    } catch (e) {
      return undefined;
    }
  }

  public setItem(key: string, value: any): void {
    try {
      this.windowRef.localStorage.setItem(
        CodecHelper.encodeData(key) as string,
        CodecHelper.encodeData(value) as string
      );
    } catch (e) {
      throw e;
    }
  }

  public setEncodedItem(key: string, value: any): void {
    try {
      this.windowRef.localStorage.setItem(
        CodecHelper.encodeData(key) as string,
        value
      );
    } catch (e) {
      throw e;
    }
  }

  public removeItem(key: string): void {
    try {
      this.windowRef.localStorage.removeItem(
        CodecHelper.encodeData(key) as string
      );
    } catch (e) {
      throw e;
    }
  }

  public clear(): void {
    this.windowRef.localStorage.clear();
  }

}
