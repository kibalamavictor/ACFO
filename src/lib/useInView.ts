import { useLayoutEffect, useState, type RefObject } from "react";

export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = "160px",
) {
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
