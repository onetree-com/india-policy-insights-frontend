/* eslint-disable react-hooks/exhaustive-deps */
import Map from "components/Map";
import {
  CreateReportActionType,
  CreateReportContext,
} from "context/createReportContext";
import { GlobalContext } from "context/globalContext";
import { Map as MapboxMap } from "mapbox-gl";
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateCanvasURL } from "utils/generate-canvas-url";
import {
  divisionTypeFilterMapDistrictImage,
  initialCoords,
} from "utils/mapbox";

interface Props {
  setImage: Dispatch<SetStateAction<string>>;
  colorDecile: string;
  mapId: string;
}

const MapDistrict: FC<Props> = ({ setImage, colorDecile, mapId }) => {
  const [map, setMap] = useState<MapboxMap>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { dispatch } = useContext(CreateReportContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const width = 160;
  const height = 200;

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
      map.setZoom(3);
      map.fitBounds(initialCoords, { padding: 50, duration: 0 });
      map.setLayoutProperty("states", "visibility", "none");
      map.setLayoutProperty("states-line", "visibility", "visible");

      setTimeout(() => {
        divisionTypeFilterMapDistrictImage(
          globalState.divisionType,
          map,
          globalState.selectedDivision?.division?.id!,
          globalState.selectedDivision?.state?.id!,
          colorDecile
        );
      }, 750);

      setTimeout(() => {
        generateCanvasURL(mapId, { height, width }).then((result) =>
          setImage(String(result))
        );
      }, 3500);
    }
  }, [
    map,
    globalState.selectedDivision?.stateId,
    globalState.selectedDivision?.division?.id,
  ]);

  return (
    <>
      {globalState.divisionType && (
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
            globalState.selectedDivision?.stateId
              ? [
                  [75.71187589903721, 33.57817643886061],
                  [73.92860861789799, 32.85238949501506],
                ]
              : [58.186249, 8.755953, 100.415292, 37.078268]
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

export default MapDistrict;
