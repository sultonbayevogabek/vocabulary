import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { VocabularyService } from '../services/vocabulary.service';
import { IVocabulary } from '../models/models';

@Component({
    selector: 'vocabulary-game',
    templateUrl: './vocabulary-game.component.html',
    styleUrls: [ './vocabulary-game.component.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class VocabularyGameComponent implements OnInit {
    @ViewChild('answerInput') answerInput!: ElementRef;
    @ViewChild('success') success!: ElementRef;
    @ViewChild('fail') fail!: ElementRef;
    public vocabularies: IVocabulary[] = [];
    public totalQuestionsCount = 0;
    public resolvedQuestionsCount = 0;
    public currentQuestion!: IVocabulary;
    public rightAnswer: string = '';
    public answerWord = '';

    constructor(
        private _vocabularyService: VocabularyService
    ) {
    }

    ngOnInit(): void {
        this.getVocabulariesList();
    }

    removeSpacesAndToLower(text: string): string {
        return text.replace(/ /g, '')?.toLowerCase();
    }

    getVocabulariesList(): void {
        this._vocabularyService.getVocabulariesList()
            .subscribe(res => {
                if (res) {
                    for (const key in res) {
                        this.vocabularies.push(res[key]);
                    }
                    const intervals = JSON.parse(localStorage.getItem('interval')!).split('-');
                    const fromIndex = +intervals![0];
                    const toIndex = +intervals![1];
                    this.vocabularies = this.vocabularies.slice(fromIndex - 1, toIndex);
                    this.totalQuestionsCount = this.vocabularies.length;
                    this.startGame();
                }
            }, () => {
                this.vocabularies = [];
            });
    }

    toggleFullScreen(): void {
        if (document.fullscreen) {
            document.exitFullscreen().then();
        } else {
            document.documentElement.requestFullscreen().then();
        }
    }

    generateRandomIndex(remindersLength: number): number {
        return Math.ceil(Math.random() * remindersLength) - 1;
    }

    startGame(): void {
        this.nextQuestion();
    }

    answer(): void {
        if (!this.answerWord.length) {
            return;
        }

        if (this.removeSpacesAndToLower(this.currentQuestion?.word) === this.removeSpacesAndToLower(this.answerWord)) {
            this.success.nativeElement.volume = 0.1;
            this.success.nativeElement.play().then()
            this.rightAnswer = '';
            this.nextQuestion();
            // const successAudio = new Audio('assets/success.mp3');
            // successAudio.volume = 0.1;
            // successAudio.play()
            //     .then(() => {
            //
            //     });
        } else {
            // const failAudio = new Audio('assets/fail.mp3');
            // failAudio.volume = 0.1;
            this.fail.nativeElement.volume = 0.1;
            this.fail.nativeElement.play().then()
            this.rightAnswer = this.currentQuestion?.word;
            // failAudio.play().then();
        }
    }

    nextQuestion(): void {
        if (this.totalQuestionsCount > this.resolvedQuestionsCount) {
            this.answerInput.nativeElement.focus();
            this.resolvedQuestionsCount++;
            this.answerWord = '';
            this.rightAnswer = '';
            const index = this.generateRandomIndex(this.vocabularies.length);
            this.currentQuestion = this.vocabularies[index];
            this.vocabularies.splice(index, 1);
        }
    }
}
