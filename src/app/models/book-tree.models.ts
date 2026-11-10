import { HttpResourceRef } from '@angular/common/http';

export type NodeType = 'genre' | 'book';

export interface GenreNode {
    id: string;
    parentId: string | null;
    name: string;
    type: NodeType;
    children?: TreeNode[];
}

export interface BookNode {
    id: string;
    parentId: string;
    title: string;
    author: string;
    type: NodeType;
    children?: TreeNode[];
}

export type TreeNode = GenreNode | BookNode;

export interface IBookDataService {
    readonly genresResource: HttpResourceRef<GenreNode[]>;
    readonly booksResource: HttpResourceRef<BookNode[]>;
}