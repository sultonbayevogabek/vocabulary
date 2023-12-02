import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VocabularyService } from '../services/vocabulary.service';
import { IVocabulary } from '../models/models';
import { Router } from '@angular/router';
import { fromEvent, map, merge, of, Subscription } from 'rxjs';

@Component({
    selector: 'vocabulary-list',
    templateUrl: './vocabulary-list.component.html',
    styleUrls: [ './vocabulary-list.component.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class VocabularyListComponent implements OnInit {
    @ViewChild('wordTextArea') wordTextArea!: ElementRef;
    public showVocabularyForm = false;
    public showSearchInput = false;
    public search = '';
    public vocabularyForm: FormGroup = new FormGroup({
        word: new FormControl('', Validators.required),
        definition: new FormControl('', Validators.required)
    });
    public vocabularies: IVocabulary[] = [];
    public vocabulariesReserve: IVocabulary[] = [];
    public currentPage = 1;

    public networkStatus: boolean = false;
    public networkStatus$: Subscription = Subscription.EMPTY;

    constructor(
        private _vocabularyService: VocabularyService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        this.checkNetworkStatus();
        this.getVocabulariesList();
    }

    removeSpacesAndToLower(text: string): string {
        return text.replace(/ /g, '')?.toLowerCase();
    }

    addNewWord(): void {
        if (this.vocabularyForm.invalid || !this.networkStatus) {
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
            index: this.vocabulariesReserve?.length + 1,
            word: this.vocabularyForm.get('word')?.value,
            definition: this.vocabularyForm.get('definition')?.value
        };

        this._vocabularyService.addNewWord(payload)
            .subscribe(() => {
                this.vocabularyForm.reset();
                this.wordTextArea.nativeElement.focus();
                this.getVocabulariesList(true);
            }, () => {
                alert('Error occurred');
            });
    }

    getVocabulariesList(afterAddingNewWord = false): void {
        this._vocabularyService.getVocabulariesList()
            .subscribe(res => {
                if (res) {
                    this.vocabularies = [];
                    this.vocabulariesReserve = [];
                    for (const key in res) {
                        this.vocabularies.push({
                            ...res[key],
                            id: key
                        });
                        this.vocabulariesReserve.push({
                            ...res[key],
                            id: key
                        });
                    }
                    if (afterAddingNewWord) {
                        this.currentPage = Math.ceil(this.vocabularies.length / 20);
                    }
                }
            }, () => {
                this.vocabularies = [];
                this.vocabulariesReserve = [];
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

    play(): void {
        const interval = prompt('Enter questions interval', '1-' + this.vocabularies?.length);

        if (interval) {
            localStorage.setItem('interval', JSON.stringify(interval));
            this._router.navigate([ '/game' ]).then();
        }
    }

    toggleSearchInput(): void {
        this.search = '';
        this.showSearchInput = !this.showSearchInput;

        if (!this.showSearchInput) {
            this.searchWord();
        }
    }

    searchWord(): void {
        this.currentPage = 1;
        this.vocabularies = [];
        this.vocabularies = this.vocabulariesReserve.filter(voc => {
            return voc.word?.toLowerCase().includes(this.search.toLowerCase())
                || voc.definition?.toLowerCase().includes(this.search.toLowerCase());
        });
    }

    textToSpeech(word: any): void {
        const speech = new SpeechSynthesisUtterance();

        speech.lang = "en-US";
        speech.text = word;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
    }

    checkNetworkStatus() {
        this.networkStatus = navigator.onLine;
        this.networkStatus$ = merge(
            of(null),
            fromEvent(window, 'online'),
            fromEvent(window, 'offline')
        )
            .pipe(map(() => navigator.onLine))
            .subscribe(status => {
                this.networkStatus = status;
            });
    }
}
