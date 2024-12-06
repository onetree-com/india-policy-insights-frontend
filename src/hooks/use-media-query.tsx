import { useEffect, useState } from "react";

function useMediaQuery(width: number): boolean {
  const [desktopDevice, setDesktopDevice] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
    const isDesktop = window.innerWidth >= width;
    setDesktopDevice(isDesktop);
    const handleResize = () => setDeviceWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [deviceWidth, width]);

  return desktopDevice;
}
export default useMediaQuery;
