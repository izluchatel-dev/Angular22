import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

export interface BookItems {
    key: string;
    title: string;
    author_name?: string[];
}

export interface BooksResponse {
    docs: Array<BookItems>;
}

@Service()
export class BookService {
    private readonly baseUrl = "https://openlibrary.org";

    private httpClient = inject(HttpClient);

    onSearchBooks(queryArgs: string, maxLimit: number): Observable<BooksResponse> {
        return this.httpClient.get<BooksResponse>(`${this.baseUrl}/search.json`, {
            params: {
                q: queryArgs,
                limit: maxLimit,
                fields: 'key,title,author_name'
            }
        });
    }
}
