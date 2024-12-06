/* eslint-disable react-hooks/exhaustive-deps */
import bbox from "@turf/bbox";
import Map from "components/Map";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { Map as MapboxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateCanvasURL } from "utils/generate-canvas-url";
import { overrideFeature } from "utils/mapbox";

interface Props {
  setImage: Dispatch<SetStateAction<string>>;
  colorDecile: string;
  mapId: string;
}

const CreateReportMap: FC<Props> = ({ setImage, colorDecile, mapId }) => {
  const [map, setMap] = useState<MapboxMap>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;
  const [featureAux, setFeatureAux] = useState<
    MapboxGeoJSONFeature | undefined
  >();

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
    if (!map || !loaded) return;
    if (
      globalState.selectedDivision?.stateId &&
      globalState.selectedDivision?.division?.id
    ) {
      setTimeout(() => {
        generateCanvasURL(mapId, { height: 180, width: 370 }).then((result) =>
          setImage(String(result))
        );
      }, 2000);
    }
  }, [
    map,
    loaded,
    globalState.selectedDivision?.stateId,
    globalState.selectedDivision?.division?.id,
  ]);

  useEffect(() => {
    if (!map || !loaded) return;
    map?.setZoom(1.9);
    if (globalState.selectedDivision?.stateId) {
      const state = map
        .querySourceFeatures("tiles", { sourceLayer: "states" })
        .find((s) => {
          return (
            s.id?.toString() ===
            globalState.selectedDivision?.stateId?.toString()
          );
        });
      const [minLng, minLat, maxLng, maxLat] = bbox(state);
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 20, duration: 1000 }
      );

      if (featureAux)
        map.removeFeatureState(
          overrideFeature(featureAux, globalState.divisionType)
        );

      if (globalState.divisionType === DivisionTypes.District) {
        const division = map
          .querySourceFeatures("tiles", { sourceLayer: "districts" })
          .find((s) => s.id === globalState.selectedDivision?.division?.id);
        setFeatureAux(division);
        map.setFeatureState(
          overrideFeature(division, globalState.divisionType),
          { decile: colorDecile }
        );
      }
      if (
        globalState.divisionType === DivisionTypes.Parlimentary_Constituencies
      ) {
        const division = map
          .querySourceFeatures("tiles", { sourceLayer: "pcs" })
          .find((s) => s.id === globalState.selectedDivision?.division?.id);
        setFeatureAux(division);
        map.setFeatureState(
          overrideFeature(division, globalState.divisionType),
          { decile: colorDecile }
        );
      }
      if (globalState.divisionType === DivisionTypes.Assembly_Constituencies) {
        const division = map
          .querySourceFeatures("tiles", { sourceLayer: "acs" })
          .find((s) => s.id === globalState.selectedDivision?.division?.id);
        setFeatureAux(division);
        map.setFeatureState(
          overrideFeature(division, globalState.divisionType),
          { decile: colorDecile }
        );
      }
    }
  }, [
    map,
    loaded,
    globalState.selectedDivision?.stateId,
    globalState.divisionType,
    globalState.selectedDivision?.division?.id,
  ]);
  return (
    <>
      {globalState.divisionType && (
        <Map
          mapId={mapId}
          map={map}
          setMap={setMap}
          setLoaded={setLoaded}
          bounds={
            globalState.selectedDivision?.stateId
              ? [
                  [75.71187589903721, 33.57817643886061],
                  [73.92860861789799, 32.85238949501506],
                ]
              : [58.186249, 8.755953, 100.415292, 37.078268]
          }
          settings={settings}
          width={370}
          height={180}
          hideControls
          parentClassnameStyles
        />
      )}
    </>
  );
};

export default CreateReportMap;
