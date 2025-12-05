import React, {
  useRef,
  useState,
  useLayoutEffect,
  type ReactNode,
} from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  minWidth?: number;
  minHeight?: number;
  aspect?: number;
}

const MIN_DIMENSION = 32;

export const SimpleResponsiveContainer: React.FC<Props> = ({
  children,
  className = "",
  style = {},
  minWidth = MIN_DIMENSION,
  minHeight = MIN_DIMENSION,
  aspect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (rect?: DOMRect) => {
      const bounds = rect || el.getBoundingClientRect();
      let width = Math.max(bounds.width, minWidth);
      let height = Math.max(bounds.height, minHeight);

      if (aspect) {
        height = width / aspect;
      }

      setSize({ width, height });
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === el) {
            update(entry.contentRect);
          }
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [minWidth, minHeight, aspect]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    >
      {size
        ? React.cloneElement(children as React.ReactElement<any>, {
            width: size.width,
            height: size.height,
          })
        : null}
    </div>
  );
};
