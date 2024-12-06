import { useEffect } from "react";
import { Map as MapboxMap } from "mapbox-gl";
import { useTranslation } from "react-i18next";
import { DivisionTypes } from "context/globalContext";
import { zoomToBoundingBox } from "utils/mapbox";

interface Props {
  map: MapboxMap | undefined;
  divisionType: string;
  ids?: number[];
}

const useActionsNavigationControl = ({ map, divisionType, ids }: Props) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    if (!map) return;
    const handleRecenter = () => {
      if (divisionType !== DivisionTypes.Village && ids?.length !== 0) {
        map.jumpTo({
          center: { lng: 82.8007705, lat: 22.75088462843118 },
          zoom: 3.1355544045808643,
          pitch: 0,
        });
      } else {
        zoomToBoundingBox(map, ids!);
      }
    };

    if (i18n.language === "hi") {
      document.documentElement.classList.add("lang-hi");
      document.documentElement.classList.remove("lang-en");
    } else {
      document.documentElement.classList.add("lang-en");
      document.documentElement.classList.remove("lang-hi");
    }

    const compassBtn = document.querySelector(".mapboxgl-ctrl-compass")!;
    const zoomInBtn = document.querySelector(".mapboxgl-ctrl-zoom-in")!;
    const zoomOutBtn = document.querySelector(".mapboxgl-ctrl-zoom-out")!;
    if (zoomInBtn) zoomInBtn.removeAttribute("title");
    if (zoomOutBtn) zoomOutBtn.removeAttribute("title");
    if (compassBtn) {
      compassBtn.setAttribute("id", "recenter-map-button");
      compassBtn.addEventListener("click", handleRecenter);
      return () => {
        compassBtn.removeEventListener("click", handleRecenter);
        if (i18n.language === "hi") {
          document.documentElement.classList.remove("lang-hi");
        } else {
          document.documentElement.classList.remove("lang-en");
        }
      };
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ids, i18n.language]);
};

export default useActionsNavigationControl;
