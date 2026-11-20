import { Component, inject, signal } from '@angular/core';
import { BookItems, BookService } from '../book-service';
import { catchError, debounceTime, filter, finalize, map, of, skip, Subject, switchMap, take, takeUntil } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-book-component',
  styleUrl: './book-component.css',
  templateUrl: './book-component.html',
})
export class BookComponent {
  private readonly minLengthQuery = 3;
  private readonly defaultLimit = 10;

  private bookService = inject(BookService);

  limitsValues = Array.of(5, 10, 20, 50);
  selectedLimit = signal(this.defaultLimit);

  books = signal<BookItems[]>([]);

  isLoading = signal(false);
  showLimitTip = signal(false);

  search$ = new Subject<string>();
  private requestLimit$ = new Subject<number>();

  constructor() {
    this.search$.pipe(
      map(value => value.trim()),
      debounceTime(500),
      switchMap(value => {
        if (value.length < this.minLengthQuery) return of([]);

        this.isLoading.set(true);

        this.requestLimit$.next(this.selectedLimit());

        return this.bookService.onSearchBooks(value, this.selectedLimit()).pipe(
          map(res => res.docs),
          catchError(() => of([])),
          finalize(() => this.isLoading.set(false))
        );
      }),
      takeUntilDestroyed()
    ).subscribe(books => this.books.set(books));

    this.requestLimit$.pipe(
      filter(value => value === this.defaultLimit),
      skip(2),
      take(1),
      takeUntil(toObservable(this.selectedLimit).pipe(skip(1))),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.showLimitTip.set(true);
    });
  }

  onLimitChange(newLimit: number, currentQuery: string) {
    this.selectedLimit.set(newLimit);
    this.showLimitTip.set(false);
    if (currentQuery.trim().length >= this.minLengthQuery) {
      this.search$.next(currentQuery);
    }
  }

}
