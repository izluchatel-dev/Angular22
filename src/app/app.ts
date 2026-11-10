import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from './services/book.service';
import { IBookDataService, TreeNode, GenreNode, BookNode } from './models/book-tree.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private bookService: IBookDataService = inject(BookService);

  private genresResource = this.bookService.genresResource;
  private booksResource = this.bookService.booksResource;

  private baseItemCollection = signal<TreeNode[]>([]);
  displayTreeItemsNow = signal<TreeNode[]>([]);
  searchQuery = signal<string>('');

  constructor() {
    effect(() => {
      if (this.genresResource.status() === 'resolved' && this.booksResource.status() === 'resolved') {

        const genres = this.genresResource.value();
        const books = this.booksResource.value();

        const flatCombinedItems = [...genres, ...books];
        this.baseItemCollection.set(flatCombinedItems);

        if (!this.searchQuery().trim()) {
          this.displayTreeItemsNow.set(this.buildTree(this.baseItemCollection()));
        }
      }
    });
  }

  get isLoading(): boolean {
    return this.genresResource.isLoading() || this.booksResource.isLoading();
  }

  get errorMessage(): string {
    if (this.genresResource.status() === 'error' || this.booksResource.status() === 'error') {
      return 'Ошибка получения данных: Не удалось прочитать файлы с данными JSON';
    }
    return '';
  }

  private buildTree(nodes: TreeNode[]): TreeNode[] {
    const nodesKeyMap = new Map<string, TreeNode>();
    const rootsNodes: TreeNode[] = [];

    nodes.forEach(node => nodesKeyMap.set(node.id, { ...node, children: [] }));

    nodesKeyMap.forEach(node => {
      if (node.parentId === null) {
        rootsNodes.push(node);
      } else {
        const parent = nodesKeyMap.get(node.parentId);
        if (parent) {
          parent.children?.push(node);
        }
      }
    });

    return rootsNodes;
  }

  onSearch(): void {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      this.displayTreeItemsNow.set(this.buildTree(this.baseItemCollection()));
      return;
    }

    const fullTree = this.buildTree(this.baseItemCollection());
    this.displayTreeItemsNow.set(this.filterTreeNodes(fullTree, query));
  }

  isBook(node: TreeNode): node is BookNode {
    return node.type === 'book';
  }

  isGenre(node: TreeNode): node is GenreNode {
    return node.type === 'genre';
  }

  private filterTreeNodes(nodes: TreeNode[], query: string): TreeNode[] {
    return nodes
      .filter(node => {
        let matchesQuery = false;

        if (this.isBook(node)) {
          matchesQuery = node.title.toLowerCase().includes(query) || node.author.toLowerCase().includes(query);
        }

        const hasMatchingChildren = node.children && this.filterTreeNodes(node.children, query).length > 0;

        return matchesQuery || hasMatchingChildren;
      })
      .map(node => {
        const updatedChildren = node.children ? this.filterTreeNodes(node.children, query) : [];
        return { ...node, children: updatedChildren } as TreeNode;
      });
  }
}