import {NgModule} from '@angular/core';
import {VocabularyGameComponent} from './vocabulary-game.component';
import {VocabularyGameRoutingModule} from './vocabulary-game-routing.module';
import {NgIf} from '@angular/common';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    VocabularyGameComponent
  ],
  imports: [
    VocabularyGameRoutingModule,
    NgIf,
    FormsModule
  ]
})

export class VocabularyGameModule {
}
