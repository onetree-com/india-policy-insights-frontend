/* eslint-disable react-hooks/exhaustive-deps */
import bbox from "@turf/bbox";
import cx from "classnames";
import CopyLinkButton from "components/CopyLinkButton";
import styles from "components/Map/styles.module.scss";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { Map, MapboxGeoJSONFeature, MapSourceDataEvent } from "mapbox-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMapGl, {
  Layer,
  LayerProps,
  MapboxEvent,
  MapLayerMouseEvent,
  MapLib,
  MapRef,
  NavigationControl,
  Source,
  SourceProps,
} from "react-map-gl";
import { MediaQueries } from "utils/media-queries";

export type LayerStyleProps = LayerProps & {
  "source-layer": string;
  source: string;
};
interface Props {
  source: SourceProps;
  layers: Array<LayerStyleProps>;
  onlyMap?: boolean;
  width?: number;
  bounds?: number[];
  height?: number;
}

const MapContainer: FC<Props> = ({
  source,
  layers,
  onlyMap,
  height,
  width,
  bounds,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  const mapRef = useRef<MapRef>(null);

  const [active, setActive] = useState<"prevalence" | "headcount">(
    "prevalence"
  );
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);

  const [map, setMap] = useState<Map>();
  const [layer, setLayer] = useState<LayerStyleProps>();
  const [, setHoveredStateId] = useState<MapboxGeoJSONFeature>();

  const palette = {
    0: "#086192",
    1: "#008dd2",
    2: "#44a3db",
    3: "#8bc4f2",
    4: "#abc4cc",
    5: "#ccb1b1",
    6: "#f4a294",
    7: "#ee7a62",
    8: "#e94e3a",
    9: "#e31e24",
  };

  const setCurrentLayer = useCallback(
    () => layers.find((l) => l.id === globalState.divisionType),
    [globalState.divisionType]
  );

  const setLayerVisibility = useCallback(
    (map: Map) => {
      layers
        .map((l) => l.id!)
        .forEach((id) => {
          map.setLayoutProperty(
            id,
            "visibility",
            id === layer?.id ? "visible" : "none"
          );
        });
    },
    [layer, layers]
  );
  const setFeaturePercentile = useCallback((map: Map) => {
    map.queryRenderedFeatures()?.forEach((feature) => {
      var i = Math.floor(Math.random() * 10);
      map.setFeatureState(feature, {
        percentile: Object.values(palette).at(i),
      });
    });
  }, []);
  useEffect(() => {
    if (!map) return;
    if (onlyMap) map.setZoom(3.29);
    if (layer?.id === DivisionTypes.Village) {
      var division = globalState.allDivisions?.at(0);
      var villages = division?.subregions || [];
      const filter = [
        "in",
        ["get", "id"],
        ["literal", villages.map((v) => v.id)],
      ];
      setLayerVisibility(map.setFilter(DivisionTypes.Village, filter));
    } else {
      setLayerVisibility(map);
    }
  }, [map, layer, globalState.allDivisions]);

  useEffect(() => setLayer(setCurrentLayer), [globalState.divisionType]);

  const onMapLoad = ({ target: map }: MapboxEvent) => {
    setMap(map);
  };

  const onSourceData = ({
    target: map,
    isSourceLoaded,
  }: MapSourceDataEvent) => {
    if (isSourceLoaded && map.isStyleLoaded() && map.areTilesLoaded()) {
      setFeaturePercentile(map);
      setLayerVisibility(map);
      setLayer(setCurrentLayer);
    }
  };

  const onMouseMove = ({ target: map, point }: MapLayerMouseEvent) => {
    const feature = map.queryRenderedFeatures(point)?.at(0);
    if (!feature) return;

    setHoveredStateId((lastHoveredFeature) => {
      if (!!lastHoveredFeature)
        map.setFeatureState(lastHoveredFeature, { hover: false });
      map.setFeatureState(feature, { hover: true });
      return feature;
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
    const feature = map.queryRenderedFeatures(point)?.at(0);
    if (!feature) return;

    const [minLng, minLat, maxLng, maxLat] = bbox(feature);
    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 80, duration: 1000 }
    );
  };

  return (
    <div className={styles.container}>
      {!onlyMap && (
        <>
          <div className={styles["map-displayed"]}>
            <p>Map displayed by:</p>
            <div className={styles["map-displayed-options"]}>
              <span
                id="prevalence"
                onClick={(): void => setActive("prevalence")}
                className={cx(active === "prevalence" && styles.active)}>
                Prevalence
              </span>
              <span
                id="headcount"
                onClick={(): void => setActive("headcount")}
                className={cx(active === "headcount" && styles.active)}>
                Headcount
              </span>
            </div>
          </div>
          {isDesktop && <CopyLinkButton />}
        </>
      )}
      <ReactMapGl
        ref={mapRef}
        mapLib={maplibregl as unknown as MapLib<Map>}
        initialViewState={{
          longitude: 68.203125,
          latitude: 23.88424,
          zoom: 3.29,
          bounds: (bounds as [number, number]) ?? [
            68.186249, 6.755953, 97.415292, 37.078268,
          ],
        }}
        style={{
          width: width ?? "100%",
          height: height ?? " calc(100vh - 77px)",
        }}
        mapStyle={"./style.json"}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onLoad={onMapLoad}
        onSourceData={onSourceData}>
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
        <Source {...source}>
          {layers.map((layer) => (
            <Layer key={layer.id} {...layer} />
          ))}
        </Source>
      </ReactMapGl>
    </div>
  );
};

export default MapContainer;
