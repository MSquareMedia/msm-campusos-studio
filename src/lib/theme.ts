/**
 * The white-to-peach scroll background used on every page below its hero.
 *
 * Starts at `var(--surface)`, the same token the page's own default
 * background already uses, rather than a hardcoded white, so there is
 * never a visible seam between whatever sits above this div (the header,
 * the hero) and where the gradient begins. The transition to peach is
 * short and reaches full strength quickly rather than fading in gradually,
 * and every section inside this div must leave its own background
 * transparent (no `var(--surface)` / `var(--surface-muted)` fills) or the
 * gradient reappears as a stack of hard-edged blocks instead of one
 * continuous background, see the note in ModernServicesExplorer.tsx.
 */
export const scrollGradientStyle = {
  background: "linear-gradient(to bottom, var(--surface) 0%, #FAF9F7 8%, #FAF9F7 100%)",
};
