import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'books', pathMatch: 'full' },
    {
        path: 'books',
        loadComponent: () =>
            import('./components/book-list/book-list').then(
                (m) => m.BookList
            ),
        pathMatch: 'full'
    },
    {
        path: 'books/:id',
        loadComponent: () =>
            import('./components/book-detail/book-detail').then(
                (m) => m.BookDetail
            )
    },
    { path: '**', redirectTo: '/' },
];
