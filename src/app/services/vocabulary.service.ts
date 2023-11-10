import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVocabulary } from '../models/models';
import { HttpClient } from '@angular/common/http';

const HOST = 'https://vocabulary-eaf35-default-rtdb.firebaseio.com/vocabularies.json';

@Injectable({
  providedIn: 'root'
})

export class VocabularyService {
  constructor(
    private _http: HttpClient
  ) {
  }

  getVocabulariesList(): Observable<IVocabulary[]> {
    return this._http.get<IVocabulary[]>(HOST);
  }

  addNewWord(payload: IVocabulary): Observable<{ success: boolean }> {
    return this._http.post<{ success: boolean }>(HOST, payload);
  }

  updateVocabulary(id: string, payload: IVocabulary): Observable<{ success: boolean }> {
    return this._http.patch<{ success: boolean }>(HOST, JSON.stringify({
      [id]: payload
    }));
  }
}
