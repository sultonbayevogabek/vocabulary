import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VocabularyService } from '../services/vocabulary.service';
import { IVocabulary } from '../models/models';

@Component({
  selector: 'vocabulary-list',
  templateUrl: './vocabulary-list.component.html',
  styleUrls: [ './vocabulary-list.component.scss' ],
  encapsulation: ViewEncapsulation.None
})

export class VocabularyListComponent implements OnInit {
  @ViewChild('wordTextArea') wordTextArea!: ElementRef;
  public showVocabularyForm = false;
  public vocabularyForm: FormGroup = new FormGroup({
    word: new FormControl('', Validators.required),
    definition: new FormControl('', Validators.required)
  });
  public vocabularies: IVocabulary[] = [];
  public currentPage = 1;

  constructor(
    private _vocabularyService: VocabularyService
  ) {
  }

  ngOnInit(): void {
    this.getVocabulariesList();
  }

  removeSpacesAndToLower(text: string): string {
    return text.replace(/ /g, '');
  }

  addNewWord(): void {
    if (this.vocabularyForm.invalid) {
      return;
    }

    const word = this.vocabularyForm.get('word')?.value;

    const isExists = this.vocabularies.find(vocabulary => {
      return this.removeSpacesAndToLower(vocabulary.word) === this.removeSpacesAndToLower(word);
    });

    if (isExists) {
      alert('This word is in the dictionary. You cannot add this word');
      return;
    }

    const payload = {
      index: this.vocabularies?.length + 1,
      word: this.vocabularyForm.get('word')?.value,
      definition: this.vocabularyForm.get('definition')?.value
    };

    this._vocabularyService.addNewWord(payload)
      .subscribe(() => {
        this.vocabularyForm.reset();
        this.getVocabulariesList();
      }, () => {
        alert('Error occurred');
      });
  }

  getVocabulariesList(): void {
    this._vocabularyService.getVocabulariesList()
      .subscribe(res => {
        if (res) {
          this.vocabularies = [];
          for (const key in res) {
            this.vocabularies.push({
              ...res[key],
              id: key
            });
          }
        }
      }, () => {
        this.vocabularies = [];
      });
  }

  updateVocabulary(item: IVocabulary, word: string, definition: string) {
    this._vocabularyService.updateVocabulary(item?.id!, {
      ...item,
      word,
      definition
    })
      .subscribe();
  }

  toggleVocabularyForm(): void {
    this.showVocabularyForm = !this.showVocabularyForm;

    if (this.showVocabularyForm) {
      this.wordTextArea.nativeElement.focus();
    }
  }

  toggleFullScreen(): void {
    if (document.fullscreen) {
      document.exitFullscreen().then();
    } else {
      document.documentElement.requestFullscreen().then()
    }
  }
}
