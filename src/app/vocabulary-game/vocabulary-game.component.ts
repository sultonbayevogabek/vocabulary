import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {VocabularyService} from '../services/vocabulary.service';
import {IVocabulary} from '../models/models';

@Component({
    selector: 'vocabulary-game',
    templateUrl: './vocabulary-game.component.html',
    styleUrls: ['./vocabulary-game.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class VocabularyGameComponent implements OnInit {
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
        return text.replace(/ /g, '');
    }

    getVocabulariesList(): void {
        this._vocabularyService.getVocabulariesList()
            .subscribe(res => {
                if (res) {
                    for (const key in res) {
                        this.vocabularies.push(res[key]);
                    }
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
            document.documentElement.requestFullscreen().then()
        }
    }

    generateRandomIndex(remindersLength: number): number {
        return Math.ceil(Math.random() * remindersLength) - 1
    }

    startGame(): void {
        this.nextQuestion();
    }

    answer(): void {
        if (!this.answerWord.length) {
            return;
        }

        if (this.removeSpacesAndToLower(this.currentQuestion?.word) === this.removeSpacesAndToLower(this.answerWord)) {
            new Audio('assets/success.mp3').play()
                .then(() => {
                    this.rightAnswer = '';
                    this.nextQuestion();
                })
        } else {
            new Audio('assets/fail.mp3').play()
                .then(() => {
                    this.rightAnswer = this.currentQuestion.word;
                })
        }
    }

    nextQuestion(): void {
        if (this.totalQuestionsCount > this.resolvedQuestionsCount) {
            this.resolvedQuestionsCount++;
            this.answerWord = '';
            this.rightAnswer = ''
            const index = this.generateRandomIndex(this.vocabularies.length);
            this.currentQuestion = this.vocabularies[index];
            this.vocabularies.splice(index, 1);
        }
    }
}
