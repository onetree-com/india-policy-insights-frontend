/* eslint-disable react-hooks/exhaustive-deps */
import cx from "classnames";
import CopyLinkButton from "components/CopyLinkButton";
import styles from "components/Map/styles.module.scss";
import MetricToogleSwitch from "components/MetricToogleSwitch";
import { GlobalContext, DivisionTypes } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import useActionsNavigationControl from "hooks/use-actions-navigation-control";
import { useDebouncedCallback } from "hooks/use-debounced-callback";
import useLayer from "hooks/use-layer";
import useMediaQuery from "hooks/use-media-query";
import useSource from "hooks/use-source";
import mapboxgl from "mapbox-gl";
import {
  Map as MapboxMap,
  MapboxGeoJSONFeature,
  MapSourceDataEvent,
} from "mapbox-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { DataViews } from "models/data-view";
import { division } from "models/divisions";
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
  MutableRefObject,
} from "react";
import { useTranslation } from "react-i18next";
import ReactMapGl, {
  Layer,
  MapRef,
  MapboxEvent,
  MapLayerMouseEvent,
  NavigationControl,
  Popup,
  Source,
  SourceProps,
  LayerProps,
} from "react-map-gl";
import { initialCoords } from "utils/mapbox";
import { MediaQueries } from "utils/media-queries";

export interface MapPopupInfo {
  feature: MapboxGeoJSONFeature;
  lngLat: mapboxgl.LngLat;
  stateAbbreviation?: string;
  name?: string;
}

interface Props {
  mapId?: string;
  settings?: any;
  deepdiveMap?: boolean;
  width?: number;
  height?: number | string;
  bounds?: number[] | number[][];
  map: MapboxMap | undefined;
  setMap: Dispatch<SetStateAction<MapboxMap | undefined>>;
  setMapRef?: Dispatch<
    SetStateAction<MutableRefObject<MapRef | undefined> | undefined>
  >;
  setLoaded: Dispatch<SetStateAction<boolean>>;
  onIdle?: () => void;
  showPopupInfo?: MapPopupInfo | null;
  onClickFeature?: (
    feature?: MapboxGeoJSONFeature,
    stateAbbreviation?: string
  ) => void;
  hideControls?: boolean;
  parentClassnameStyles?: boolean;
  minZoom?: number;
  dataView?: DataViews;
  indId?: number;
  divisions?: division[];
  deciles?: Array<number>;
  decilesChange?: Array<string>;
  extraLayer?:
    | { source: SourceProps; data: LayerProps }
    | { source: SourceProps; data: LayerProps }[];
}

const Map: FC<Props> = ({
  mapId,
  map,
  setMap,
  setLoaded,
  setMapRef,
  deepdiveMap,
  height,
  width,
  bounds,
  settings,
  onIdle = () => {},
  showPopupInfo,
  onClickFeature,
  hideControls,
  parentClassnameStyles,
  minZoom,
  dataView,
  indId,
  divisions,
  deciles,
  decilesChange,
  extraLayer,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  const { resetZoomOnMap, hideLoadingScreen } = useGlobalActions();
  const { i18n } = useTranslation();
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [hoveredStateId, setHoveredStateId] = useState<MapboxGeoJSONFeature>();
  const [, setClickedStateId] = useState<MapboxGeoJSONFeature>();
  useActionsNavigationControl({ map, divisionType: globalState.divisionType });
  const mapRef = useRef<MapRef>();
  const { source } = useSource({ divisionType: globalState.divisionType });
  const layers = useLayer({
    source,
    divisionType: globalState.divisionType,
    isDeepDiveMap: deepdiveMap!,
  });

  const showHeadcount =
    dataView === "2021" &&
    (globalState.divisionType === DivisionTypes.District ||
      globalState.divisionType === DivisionTypes.Parlimentary_Constituencies);
  const isAssembly =
    globalState.divisionType === DivisionTypes.Assembly_Constituencies;

  /** Waits until the last triggered event arrives past some time */
  const handleEventoToIdle = useDebouncedCallback(onIdle, 250);

  const onMapLoad = ({ target: map }: MapboxEvent) => {
    !!map && setMap(map);
  };

  const onSourceData = ({
    target: map,
    isSourceLoaded,
  }: MapSourceDataEvent) => {
    setMap(map);
    setLoaded(isSourceLoaded && map.isStyleLoaded() && map.areTilesLoaded());
    setMapRef && setMapRef(mapRef);
  };

  const onMouseMove = ({ target: map, point }: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(point);
    const division = features.filter((f) => f.sourceLayer !== "states")?.at(0);

    if (!division) {
      if (!!hoveredStateId && hoveredStateId.id)
        map.setFeatureState(hoveredStateId, { hover: false });
      return;
    }

    setHoveredStateId((lastHoveredFeature) => {
      if (!!lastHoveredFeature && lastHoveredFeature.id)
        map.setFeatureState(lastHoveredFeature, { hover: false });
      if (division.id) map.setFeatureState(division, { hover: true });
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

  const onClick = ({ target: map, point }: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(point);
    const division = features.filter((f) => f.sourceLayer !== "states")?.at(0);

    setClickedStateId((prev) => {
      if (prev) map.setFeatureState(prev, { clicked: false });
      if (division) map.setFeatureState(division, { clicked: true });
      return division;
    });
    onClickFeature!(division);
  };

  useEffect(() => {
    if (globalState.resetMapZoom && map) {
      resetZoomOnMap(false);
      map.fitBounds(initialCoords, {
        padding: 20,
        duration: 1000,
      });
      if (globalState.divisionType === DivisionTypes.Assembly_Constituencies) {
        setTimeout(() => {
          hideLoadingScreen();
        }, 1000);
      }
    }
  }, [globalState.resetMapZoom]);

  return (
    <div className={cx(!parentClassnameStyles && styles.container)}>
      {!hideControls && (
        <MetricToogleSwitch
          onChange={handleEventoToIdle}
          showHeadcount={showHeadcount}
          isAssembly={isAssembly}
        />
      )}
      {(isDesktop || !hideControls) &&
        globalState.navigation.feature !== "DEEP_DIVE" && (
          <CopyLinkButton
            lang={i18n.language}
            indId={indId}
            dataView={dataView}
            divisions={divisions}
            deciles={deciles}
            decilesChange={decilesChange}
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
          zoom: 3.5,
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
        onLoad={onMapLoad}
        onSourceData={onSourceData}
        onDragEnd={handleEventoToIdle}
        onMoveEnd={handleEventoToIdle}
        onZoomEnd={handleEventoToIdle}
        maxZoom={10}
        minZoom={minZoom ?? (!isDesktop && 3)}
        onBoxZoomEnd={handleEventoToIdle}
        preserveDrawingBuffer>
        {isDesktop && !hideControls && (
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
        {!Array.isArray(extraLayer) &&
        extraLayer?.source !== undefined &&
        extraLayer.data !== undefined ? (
          <Source {...extraLayer.source}>
            <Layer key={extraLayer.data.id} {...extraLayer.data} />
          </Source>
        ) : Array.isArray(extraLayer) ? (
          extraLayer.map((sourceLayer, key) => {
            return (
              <Source key={key} {...sourceLayer.source}>
                <Layer key={sourceLayer.data.id} {...sourceLayer.data} />
              </Source>
            );
          })
        ) : null}
        <Source {...source}>
          {layers.map((layer) => (
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
              {showPopupInfo.stateAbbreviation
                ? `${showPopupInfo.feature?.properties?.name}, ${showPopupInfo.stateAbbreviation}`
                : showPopupInfo.feature?.properties?.name}
            </span>
          </Popup>
        )}
      </ReactMapGl>
    </div>
  );
};

export default Map;
