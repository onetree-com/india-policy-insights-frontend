/* eslint-disable react-hooks/exhaustive-deps */
import Map from "components/Map";
import {
  CreateReportActionType,
  CreateReportContext,
} from "context/createReportContext";
import { DivisionTypes } from "context/globalContext";
import { Map as MapboxMap } from "mapbox-gl";
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { LayerProps, SourceProps } from "react-map-gl";
import { generateCanvasURL } from "utils/generate-canvas-url";
import { divisionTypeFilterMapVillageImage, initialCoords } from "utils/mapbox";

interface Props {
  setImage: Dispatch<SetStateAction<string>>;
  colorDecile: string;
  mapId: string;
  divisionType: DivisionTypes;
}

const districtSource: SourceProps = {
  id: "district-tiles",
  type: "vector",
  url: `${process.env.REACT_APP_MAP_SOURCE_URL}/districts.json`,
  promoteId: "id",
};
const stateLayer: LayerProps = {
  type: "line",
  paint: {
    "line-color": "#93979C",
    "line-width": 1,
  },
  layout: { visibility: "visible" },
  id: "states",
  source: "district-tiles",
  "source-layer": "states",
  minzoom: 0,
  maxzoom: 10,
};
const layer: LayerProps = {
  type: "line",
  paint: {
    "line-color": "#93979C",
    "line-width": 1,
  },
  layout: { visibility: "visible" },
  id: "districts",
  source: "district-tiles",
  "source-layer": "districts",
  minzoom: 0,
  maxzoom: 10,
};

const MapDistrictVillage: FC<Props> = ({
  setImage,
  colorDecile,
  mapId,
  divisionType,
}) => {
  const [map, setMap] = useState<MapboxMap>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { state, dispatch } = useContext(CreateReportContext)!;
  const width = 700;
  const height = 700;

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
      state.selectedDivision?.district?.id &&
      state.selectedDivision?.village?.id
    ) {
      setLoaded(false);
      map.setZoom(1.9);
      map.fitBounds(initialCoords, { padding: 50, duration: 0 });
      map.setLayoutProperty("states", "visibility", "visible");
      map.setLayoutProperty("districts", "visibility", "visible");
      map.setLayoutProperty("Villages", "visibility", "visible");

      setTimeout(() => {
        divisionTypeFilterMapVillageImage(
          divisionType,
          map,
          state.selectedDivision?.village?.id!,
          state.selectedDivision?.district?.id!,
          state.selectedDivision?.district?.parentId!,
          colorDecile,
          setLoaded
        );
      }, 750);
    }
  }, [
    map,
    state.selectedDivision?.district?.id,
    state.selectedDivision?.district?.parentId,
    state.selectedDivision?.village?.id,
  ]);

  useEffect(() => {
    if (
      state.selectedDivision?.district?.id &&
      state.selectedDivision?.district?.parentId &&
      state.selectedDivision?.village?.id
    ) {
      setTimeout(() => {
        generateCanvasURL(mapId, { height, width }).then((result) =>
          setImage(String(result))
        );
      }, 1000);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.mapLoaded,
    loaded,
    state.selectedDivision?.district?.id,
    state.selectedDivision?.district?.parentId,
    state.selectedDivision?.village?.id,
  ]);

  return (
    <>
      {divisionType && (
        <Map
          mapId={mapId}
          map={map}
          setMap={setMap}
          setLoaded={(value) => {
            setLoaded(value);
            dispatch({
              type: CreateReportActionType.MAP_LOADED,
              payload: value,
            });
          }}
          bounds={
            state.selectedDivision?.district
              ? [
                  [75.71187589903721, 33.57817643886061],
                  [73.92860861789799, 32.85238949501506],
                ]
              : [58.186249, 8.755953, 100.415292, 37.078268]
          }
          extraLayer={
            divisionType !== DivisionTypes.Village
              ? undefined
              : [
                  { source: districtSource, data: layer },
                  { source: districtSource, data: stateLayer },
                ]
          }
          settings={settings}
          width={width}
          height={height}
          hideControls
          parentClassnameStyles
        />
      )}
    </>
  );
};

export default MapDistrictVillage;
