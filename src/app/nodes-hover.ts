import { computed, Directive, input, signal } from '@angular/core';

const HOVER_COLORS = {
  genreNode: 'color-mix(in srgb, var(--color-node-genre), green 70%)',
  bookNode: 'color-mix(in srgb, var(--color-node-book), green 35%)'
} as const;

export type THoverColors = keyof typeof HOVER_COLORS | '';

@Directive({
  selector: '[appNodesHover]',
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[style.color]': 'computedColor()',
    '[style.outline]': 'isHovered() && hasBorder() ? "1px solid color-mix(in srgb, currentColor, transparent 75%)" : null',
    '[style.outline-offset]': 'isHovered() && hasBorder() ? "4px" : null',
    '[style.border-radius]': 'isHovered() && hasBorder() ? "1px" : null',
  }
})
export class NodesHover {
  isHovered = signal(false);

  appNodesHover = input<THoverColors>('');
  hasBorder = input<boolean>(false);

  computedColor = computed(() => {
    const colorKey = this.appNodesHover();

    return this.isHovered() && colorKey ? HOVER_COLORS[colorKey] : null;
  });
}
