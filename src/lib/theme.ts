/**
 * The white-to-peach scroll background used on every page below its hero.
 *
 * Starts at `var(--surface)`, the same token the page's own default
 * background already uses, rather than a hardcoded white, so there is
 * never a visible seam between whatever sits above this div (the header,
 * the hero) and where the gradient begins. The "peach" stop is
 * `var(--surface-muted)` rather than a literal hex: that token is the same
 * #FAF9F7 in light mode, but it flips to a dark tone under
 * `prefers-color-scheme: dark`. A hardcoded hex here stayed light in dark
 * mode while the surrounding page (and this section's own light-on-dark
 * text) switched, leaving a pale block with unreadable pale text over it.
 * The transition to peach is short and reaches full strength quickly
 * rather than fading in gradually, and every section inside this div must
 * leave its own background transparent (no `var(--surface)` /
 * `var(--surface-muted)` fills) or the gradient reappears as a stack of
 * hard-edged blocks instead of one continuous background, see the note in
 * ModernServicesExplorer.tsx.
 */
export const scrollGradientStyle = {
  background:
    "linear-gradient(to bottom, var(--surface) 0%, var(--surface-muted) 8%, var(--surface-muted) 100%)",
};
