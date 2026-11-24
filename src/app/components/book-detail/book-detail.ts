import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book, BookDetails } from '../../services/book';

@Component({
  imports: [RouterLink],
  selector: 'app-book-detail',
  styleUrl: './book-detail.css',
  templateUrl: './book-detail.html',
})
export class BookDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(Book);

  readonly book = signal<BookDetails | null>(null);
  readonly isLoading = signal(true);

  readonly description = computed(() => {
    const currentBook = this.book();
    if (!currentBook?.description) return 'Описание отсутствует.';
    return typeof currentBook.description === 'string'
      ? currentBook.description
      : currentBook.description.value;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookById(id).subscribe({
        next: (data) => {
          this.book.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }
}
