import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiRouteEnum} from "./api-route.enum";
import {ISessionCreateDTO} from "../../common/models/domain/dto/session.dto";
import {ISessionModel} from "../../common/models/domain/models/session.model";

@Injectable()
export class ApiService {
  protected api: string = '';

  constructor(
    private http: HttpClient
  ) {
  }

  public signIn({email, password}: ISessionCreateDTO): Observable<ISessionModel> {
    return this.http.post<ISessionModel>(`${this.api}/${ApiRouteEnum.SESSION}`, {email, password});
  }

}
