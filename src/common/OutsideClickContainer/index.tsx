import { ReactNode, useEffect, useRef } from "react";

interface OutsideClickContainerProps {
  children: ReactNode;
  onOutsideClick: () => void;
}

function OutsideClickContainer({
  children,
  onOutsideClick,
}: OutsideClickContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as HTMLDivElement)
      ) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  return <div ref={containerRef}>{children}</div>;
}

export default OutsideClickContainer;
