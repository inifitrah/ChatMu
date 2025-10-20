import { useEffect, RefObject } from "react";

const useClickOutside = (
  refs: RefObject<HTMLElement>[],
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(target)
      );
      if (isOutside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

export default useClickOutside;
