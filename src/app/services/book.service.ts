import { Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { IBookDataService, GenreNode, BookNode, NodeType } from '../models/book-tree.models';

const mapToType = <T>(nodeType: NodeType) => {
    return (rawValues: any): T[] => {
        if (Array.isArray(rawValues)) {
            return rawValues.map(item => ({ ...item, type: nodeType } as T));
        }
        return [];
    };
};

@Service()
export class BookService implements IBookDataService {

    readonly genresResource = httpResource<GenreNode[]>(() => ({
        url: '/assets/genres.json'
    }), {
        defaultValue: [],
        parse: mapToType<GenreNode>('genre')
    });

    readonly booksResource = httpResource<BookNode[]>(() => ({
        url: '/assets/books.json'
    }), {
        defaultValue: [],
        parse: mapToType<BookNode>('book')
    });
}