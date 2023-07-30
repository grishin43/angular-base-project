import {Injectable} from '@angular/core';
import {of} from "rxjs";

@Injectable()
export class AuthService {

  constructor() {
  }

  public getAccount(): any {
    return of(true);
  }

}
