import { Component, signal } from '@angular/core';
import { BookComponent } from './book-component/book-component';

@Component({
  imports: [BookComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('http-05');
}
