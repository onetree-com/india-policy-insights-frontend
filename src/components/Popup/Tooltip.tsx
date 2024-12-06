import { FC, ReactNode, useEffect, useRef } from "react";

const Tooltip: FC<{
  children: ReactNode;
  classname?: string;
  customStyles: React.CSSProperties;
  show: boolean;
  closeFromOutside: any;
}> = ({ children, classname, show, closeFromOutside, customStyles }) => {
  const wrapperRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeFromOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, closeFromOutside]);

  return show ? (
    <section ref={wrapperRef} style={customStyles} className={`${classname}`}>
      {children}
    </section>
  ) : null;
};

export default Tooltip;
