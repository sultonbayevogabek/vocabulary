import { NgModule } from '@angular/core';
import { VocabularyListComponent } from './vocabulary-list.component';
import { VocabularyListRoutingModule } from './vocabulary-list-routing.module';
import { DatePipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VocabularyListComponent
  ],
    imports: [
        VocabularyListRoutingModule,
        NgForOf,
        NgxPaginationModule,
        ReactiveFormsModule,
        NgIf,
        FormsModule,
        NgOptimizedImage,
        DatePipe
    ]
})

export class VocabularyListModule {
}
