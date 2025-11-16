"use client";
import { useEffect, useRef, useState } from "react";

function Component() {
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("100vh");
  const remainingScrollHeightOfBox = boxRef.current
    ? boxRef.current.scrollHeight - boxRef.current.clientHeight
    : 0;
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    // Calculate total height the section needs: box scrollHeight + viewport height
    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(`calc(${remainingScrollHeightOfBox}px + 100vh)`);
    });

    resizeObserver.observe(box);
    return () => resizeObserver.disconnect();
  }, [remainingScrollHeightOfBox]);

  useEffect(() => {
    const lastScrollYRef = {
      current: typeof window !== "undefined" ? window.scrollY : 0,
    };

    const onScroll = () => {
      const container = boxContainerRef.current;
      const box = boxRef.current;
      if (!box || !container) {
        lastScrollYRef.current = window.scrollY;
        return;
      }

      const top = Math.round(container.getBoundingClientRect().top);
      const delta = window.scrollY - lastScrollYRef.current;

      // if the container is exactly at the top, scroll the inner box by the same delta
      if (top === 0 && delta !== 0) {
        const maxScroll = box.scrollHeight - box.clientHeight;
        box.scrollTop = Math.max(0, Math.min(box.scrollTop + delta, maxScroll));
      }

      lastScrollYRef.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight }}
      className="relative w-full "
    >
      {/* Sticky box */}
      <div
        ref={boxContainerRef}
        className="bg-black w-full h-dvh sticky top-0 flex items-center justify-center"
      >
        <div
          ref={boxRef}
          className="mx-auto border border-gray-300 bg-white text-black shadow p-4 rounded-lg overflow-auto"
          style={{ width: "300px", height: "100vh", maxHeight: "400px" }}
        >
          <div className="flex flex-col gap-2">
            {Array(20)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="p-2 rounded-2xl bg-gray-100">
                  item no.{i + 1}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
