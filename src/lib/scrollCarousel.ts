export function scrollCarousel(root: HTMLElement | null, direction: -1 | 1) {
  if (!root) return;

  const card = root.querySelector("article");
  if (!(card instanceof HTMLElement)) return;

  const styles = getComputedStyle(root);
  const gap =
    Number.parseFloat(styles.columnGap) ||
    Number.parseFloat(styles.gap) ||
    12;
  const step = card.getBoundingClientRect().width + gap;
  const max = Math.max(0, root.scrollWidth - root.clientWidth);
  if (max <= 1) return;

  let next = root.scrollLeft + direction * step;
  if (direction > 0 && next > max - 4) {
    next = 0;
  } else if (direction < 0 && next < 4) {
    next = max;
  }

  root.scrollTo({ left: next, behavior: "smooth" });
}
