import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVocabulary } from '../models/models';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class VocabularyService {
  private _host = '';
  constructor(
    private _http: HttpClient
  ) {
    this._host = 'https://vocabulary-eaf35-default-rtdb.firebaseio.com/' + window.location.host.split('.')[0] + '.json';
    console.log(this._host);
  }

  getVocabulariesList(): Observable<IVocabulary[]> {
    return this._http.get<IVocabulary[]>(this._host);
  }

  addNewWord(payload: IVocabulary): Observable<{ success: boolean }> {
    return this._http.post<{ success: boolean }>(this._host, payload);
  }

  updateVocabulary(id: string, payload: IVocabulary): Observable<{ success: boolean }> {
    return this._http.patch<{ success: boolean }>(this._host, JSON.stringify({
      [id]: payload
    }));
  }
}
