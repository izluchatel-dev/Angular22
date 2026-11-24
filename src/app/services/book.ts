import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface BookItem {
    id: string;
    title: string;
    author: string;
    firstPublishYear?: number;
}

export interface BookDetails {
    key: string;
    title: string;
    description?: string | { value: string };
}

interface RawResponseItem {
    key: string;
    title: string;
    authors?: { name: string }[];
    first_publish_year?: number;
}

interface RawResponse {
    works: RawResponseItem[];
}

@Service()
export class Book {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://openlibrary.org';

    getBooks(subject: string): Observable<BookItem[]> {
        return this.http
            .get<RawResponse>(`${this.baseUrl}/subjects/${subject}.json?limit=15`)
            .pipe(
                map((response) =>
                    response.works.map((work) => ({
                        id: work.key.replace('/works/', ''),
                        title: work.title,
                        author: work.authors?.[0]?.name ?? 'Автор неизвестен',
                        firstPublishYear: work.first_publish_year
                    }))
                )
            );
    }

    getBookById(id: string): Observable<BookDetails> {
        return this.http.get<BookDetails>(`${this.baseUrl}/works/${id}.json`);
    }

}
