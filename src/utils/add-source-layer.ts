import { Map as MapboxMap, MapboxGeoJSONFeature } from "mapbox-gl";

export const addSourceLayerRankingMap = (
  map: MapboxMap,
  feature: MapboxGeoJSONFeature,
  name: string
) => {
  map.addSource(name, {
    type: "geojson",
    data: feature,
  });
  map.addLayer({
    id: `${name}-1`,
    type: "line",
    source: name,
    layout: {},
    paint: {
      "line-color": "#ffffff",
      "line-width": 8,
    },
  });
  map.addLayer({
    id: name,
    type: "line",
    source: name,
    layout: {},
    paint: {
      "line-color": "#565656",
      "line-width": 4,
    },
  });
};
