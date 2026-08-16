import { useEffect, useRef, useState } from "react";

const useHorizontalOverflow = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth + 4);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    window.addEventListener("resize", check);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  return { ref, hasOverflow };
};

export default useHorizontalOverflow;
