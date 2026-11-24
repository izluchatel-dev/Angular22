import { Component, inject, signal } from '@angular/core';
import { Book, BookItem } from '../../services/book';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {
  private readonly bookService = inject(Book);

  readonly books = signal<BookItem[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.bookService.getBooks('javascript').subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Не удалось загрузить список книг');
        this.isLoading.set(false);
      }
    });
  }
}
