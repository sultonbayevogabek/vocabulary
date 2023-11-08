import { NgModule } from '@angular/core';
import { VocabularyListComponent } from './vocabulary-list.component';
import { VocabularyListRoutingModule } from './vocabulary-list-routing.module';
import { NgForOf, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VocabularyListComponent
  ],
  imports: [
    VocabularyListRoutingModule,
    NgForOf,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgIf
  ]
})

export class VocabularyListModule {
}
