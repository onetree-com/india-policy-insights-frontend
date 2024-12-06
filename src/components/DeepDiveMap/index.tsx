/* eslint-disable react-hooks/exhaustive-deps */
import styles from "components/DeepDiveMap/styles.module.scss";
import Map from "components/Map";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { DeepDiveContext } from "context/deepDiveContext";
import { Map as MapboxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import { FC, MutableRefObject, useContext, useEffect, useState } from "react";
import { LayerProps, MapRef, SourceProps } from "react-map-gl";
import { findSmallFeatures, initialCoords } from "utils/mapbox";
import { useTranslation } from "react-i18next";

interface Props {
  mapWidth?: number;
  parentClassnameStyles?: boolean;
}
const districtSource: SourceProps = {
  id: "district-tiles",
  type: "vector",
  url: `${process.env.REACT_APP_MAP_SOURCE_URL}/districts.json`,
  promoteId: "id",
};
const layer: LayerProps = {
  type: "line",
  paint: {
    "line-color": "#93979C",
    "line-width": 1,
  },
  layout: { visibility: "visible" },
  id: "districts-line",
  source: "district-tiles",
  "source-layer": "districts",
  minzoom: 0,
  maxzoom: 10,
};

const DeepDiveMap: FC<Props> = ({ mapWidth, parentClassnameStyles }) => {
  const [map, setMap] = useState<MapboxMap>();
  const [, setLoaded] = useState<boolean>(false);
  const [mapRef, setMapRef] = useState<MutableRefObject<MapRef | undefined>>();
  const { state } = useContext(DeepDiveContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const [featureAux, setFeatureAux] = useState<
    MapboxGeoJSONFeature | undefined
  >();
  const { i18n, t } = useTranslation();

  const settings = {
    dragPan: false,
    dragRotate: false,
    scrollZoom: false,
    touchZoom: false,
    touchRotate: false,
    keyboard: false,
    doubleClickZoom: false,
    clickTolerance: false,
  };

  useEffect(() => {
    if (!map || !map?.setFeatureState || !mapRef?.current) return;
    map.fitBounds(initialCoords, {
      padding: 20,
      duration: 1000,
    });
    if (featureAux) map.removeFeatureState(featureAux);
    setTimeout(() => {
      if (globalState.divisionType === DivisionTypes.Village) {
        map?.setLayoutProperty(DivisionTypes.Village, "visibility", "visible");
        findSmallFeatures(
          map,
          state.selectedDivision?.district?.id!,
          state.selectedDivision?.village?.id!,
          setFeatureAux,
          globalState.divisionType,
          {
            disclaimer: styles.disclaimer,
            noMapDisclaimer: styles.noMapDisclaimer,
          }
        );
      } else {
        findSmallFeatures(
          map,
          globalState.selectedDivision?.stateId!,
          globalState.selectedDivision?.division?.id!,
          setFeatureAux,
          globalState.divisionType
        );
      }
    }, 2000);
  }, [
    map,
    globalState.selectedDivision?.division?.id,
    state.selectedDivision?.village?.id,
  ]);

  useEffect(() => {
    if (!map || !state.selectedDivision?.village?.id) return;
    const container = map!.getContainer();
    const disclaimer = document.createElement("div");
    disclaimer.id = "disclaimer";
    disclaimer.className = featureAux
      ? styles.disclaimer
      : styles.noMapDisclaimer;
    disclaimer.innerHTML = t(
      featureAux ? "map_is_best_approximation" : "no_map_available"
    );

    const oldDisclaimer = container?.querySelector("#disclaimer");
    oldDisclaimer?.remove();
    container?.appendChild(disclaimer);
  }, [i18n.language, map, state.selectedDivision, featureAux]);

  return (
    <>
      {globalState.divisionType && (
        <div className={styles.container}>
          <Map
            map={map}
            setMap={setMap}
            setLoaded={setLoaded}
            setMapRef={setMapRef}
            height={180}
            deepdiveMap
            hideControls
            extraLayer={
              globalState.divisionType !== DivisionTypes.Village
                ? undefined
                : { source: districtSource, data: layer }
            }
            bounds={
              globalState.selectedDivision?.stateId
                ? [
                    [75.71187589903721, 33.57817643886061],
                    [73.92860861789799, 32.85238949501506],
                  ]
                : [58.186249, 8.755953, 100.415292, 37.078268]
            }
            settings={settings}
            parentClassnameStyles={parentClassnameStyles}
            minZoom={1}
          />
        </div>
      )}
    </>
  );
};

export default DeepDiveMap;
