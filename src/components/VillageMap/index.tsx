import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import ReactMapGl, {
  Layer,
  MapRef,
  MapLayerMouseEvent,
  Popup,
  Source,
  SourceProps,
  LayerProps,
  NavigationControl,
} from "react-map-gl";
import {
  Map as MapboxMap,
  MapboxGeoJSONFeature,
  MapSourceDataEvent,
} from "mapbox-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useSource from "hooks/use-source";
import useLayer from "hooks/use-layer";
import { useDebouncedCallback } from "hooks/use-debounced-callback";
import { MapPopupInfo } from "components/Map";
import useMediaQuery from "hooks/use-media-query";
import { MediaQueries } from "utils/media-queries";
import { division } from "models/divisions";
import { DataViews } from "models/data-view";
import CopyLinkVillagesButton from "components/CopyLinkButton/CopyLinkVillages";
import useActionsNavigationControl from "hooks/use-actions-navigation-control";
import { useTranslation } from "react-i18next";

interface Props {
  mapId?: string;
  settings?: any;
  deepdiveMap?: boolean;
  width?: number;
  height?: number | string;
  bounds?: number[] | number[][];
  map: MapboxMap | undefined;
  setMap: Dispatch<SetStateAction<MapboxMap | undefined>>;
  loaded: boolean;
  setLoaded: Dispatch<SetStateAction<boolean>>;
  onIdle?: () => void;
  showPopupInfo?: MapPopupInfo | null;
  onClickFeature?: (feature?: MapboxGeoJSONFeature) => void;
  dataView?: DataViews;
  indId?: number;
  divisions?: division[];
  deciles?: Array<number>;
}

const VillageMap: FC<Props> = ({
  mapId,
  map,
  setMap,
  loaded,
  setLoaded,
  height,
  width,
  bounds,
  settings,
  onIdle = () => {},
  showPopupInfo,
  onClickFeature,
  indId,
  dataView,
  divisions,
  deciles,
}) => {
  const { source: villageSource } = useSource({
    divisionType: DivisionTypes.Village,
  });
  const { globalState } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  useActionsNavigationControl({
    map,
    divisionType: globalState.divisionType,
    ids: [globalState.selectedDivision?.division?.id!],
  });
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [, setClickedStateId] = useState<MapboxGeoJSONFeature>();
  const [hoveredStateId, setHoveredStateId] = useState<MapboxGeoJSONFeature>();
  const villageLayers = useLayer({
    source: villageSource,
    divisionType: DivisionTypes.Village,
    isDeepDiveMap: false,
  });
  const districtSource: SourceProps = {
    id: "district-tiles",
    type: "vector",
    url: `${process.env.REACT_APP_MAP_SOURCE_URL}/districts.json`,
    promoteId: "id",
  };
  const layer: LayerProps = {
    type: "line",
    paint: {
      "line-color": "#000000",
      "line-width": 2,
    },
    layout: { visibility: "visible" },
    id: "districts-line",
    source: "district-tiles",
    "source-layer": "districts",
    minzoom: 0,
    maxzoom: 10,
  };
  const mapRef = useRef<MapRef>();

  const handleEventoToIdle = useDebouncedCallback(onIdle, 250);

  const onSourceData = ({
    target: map,
    isSourceLoaded,
  }: MapSourceDataEvent) => {
    setMap(map);
    if (
      loaded !== (isSourceLoaded && map.isStyleLoaded() && map.areTilesLoaded())
    ) {
      setLoaded(isSourceLoaded && map.isStyleLoaded() && map.areTilesLoaded());
    }
  };

  const onClick = ({ target: map, point }: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(point);
    const village = features.at(0);
    setClickedStateId((prev) => {
      if (prev) map.setFeatureState(prev, { clicked: false });
      if (village) map.setFeatureState(village, { clicked: true });
      return village;
    });

    onClickFeature!(village);
  };

  const onMouseMove = ({ target: map, point }: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(point);
    const division = features
      .filter((f) => f.sourceLayer !== "districts")
      ?.at(0);

    if (!division) {
      if (!!hoveredStateId)
        map.setFeatureState(hoveredStateId, { hover: false });
      return;
    }

    setHoveredStateId((lastHoveredFeature) => {
      if (!!lastHoveredFeature)
        map.setFeatureState(lastHoveredFeature, { hover: false });
      map.setFeatureState(division, { hover: true });
      return division;
    });
  };

  const onMouseLeave = ({ target: map }: MapLayerMouseEvent) => {
    setHoveredStateId((lastHoveredFeature) => {
      if (!!lastHoveredFeature)
        map.setFeatureState(lastHoveredFeature, { hover: false });
      return undefined;
    });
  };

  return (
    <div>
      {isDesktop && globalState.navigation.feature !== "DEEP_DIVE" && (
        <CopyLinkVillagesButton
          indId={indId}
          dataView={dataView}
          lang={i18n.language}
          atlasDivisions={{
            stateId: globalState.selectedDivision?.stateId!,
            districtId: globalState.selectedDivision?.division?.id!,
            villages: divisions!,
          }}
          deciles={deciles}
        />
      )}
      <ReactMapGl
        id={mapId}
        {...settings}
        dragRotate={false}
        mapLib={maplibregl}
        ref={mapRef}
        initialViewState={{
          longitude: 78.9629, //68.203125,
          latitude: 20.5937, //23.88424,
          zoom: 3,
          bounds: (bounds as [number, number]) ?? [
            68.186249, 6.755953, 97.415292, 37.078268,
          ],
        }}
        style={{
          width: width ?? "100%",
          height: height ?? "calc(100vh - 77px)",
          position: "relative",
        }}
        trackResize
        attributionControl={false}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onSourceData={onSourceData}
        onZoomEnd={handleEventoToIdle}
        maxZoom={10}
        minZoom={3}
        onBoxZoomEnd={handleEventoToIdle}
        preserveDrawingBuffer>
        {isDesktop && (
          <NavigationControl
            position="bottom-right"
            style={{
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.24)",
              borderRadius: "6px",
              width: "40px",
              height: "95px",
              margin: "0 33px 70px 0",
            }}
          />
        )}

        <Source {...districtSource}>
          <Layer key={layer.id} {...layer} />
        </Source>
        <Source {...villageSource}>
          {villageLayers.map((layer) => (
            <Layer key={layer.id} {...layer} />
          ))}
        </Source>

        {showPopupInfo && (
          <Popup
            longitude={showPopupInfo.lngLat.lng}
            latitude={showPopupInfo.lngLat.lat}
            closeButton={false}
            style={{
              background: "#565656",
              border: "2px solid #ffffff",
              borderRadius: "4px",
              width: "fit-content",
              padding: "4px 11px",
            }}>
            <span
              style={{
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "17px",
                color: "white",
              }}>
              {showPopupInfo.name}
            </span>
          </Popup>
        )}
      </ReactMapGl>
    </div>
  );
};

export default VillageMap;
