import bbox from "@turf/bbox";
import { DivisionTypes } from "context/globalContext";
import { MapboxGeoJSONFeature, LngLatBounds } from "mapbox-gl";
import { MapboxMap } from "react-map-gl";

export const initialCoords: [number, number, number, number] = [
  68.186249, 6.755953, 97.415292, 37.078268,
];

export const getBoundingBox = (features: MapboxGeoJSONFeature[]) => {
  if (!features || features.length === 0)
    return new LngLatBounds(initialCoords);

  const feature = features[0];

  // Create a 'LngLatBounds' with both corners at the first coordinate.
  const [minLng, minLat, maxLng, maxLat] = bbox(feature);
  const bounds = new LngLatBounds([minLng, minLat, maxLng, maxLat]);

  if (features.length < 2) return bounds;

  features.shift();
  // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
  for (const feat of features) {
    const [minLng, minLat, maxLng, maxLat] = bbox(feat);
    bounds.extend([minLng, minLat, maxLng, maxLat]);
  }
  return bounds;
};

export enum sourceLayerIds {
  "States" = "states",
  "Districts" = "Districts",
  "Assembly Constituencies" = "acs",
  "Parliamentary Constituencies" = "pcs",
  "Villages" = "villages",
}

export enum sourceLayers {
  "States" = "states",
  "Districts" = "districts",
  "Assembly Constituencies" = "acs",
  "Parliamentary Constituencies" = "pcs",
  "Villages" = "villages",
}

export const findSmallFeatures = (
  map: MapboxMap,
  stateId: number,
  divisionId: number,
  setFeatureAux: any,
  divisionType: string,
  styles?: any
) => {
  const isVillages = divisionType === DivisionTypes.Village;
  const states = map?.querySourceFeatures(
    isVillages ? "district-tiles" : "tiles",
    {
      sourceLayer: `${isVillages ? "districts" : "states"}`,
    }
  )!;
  const state = states.find((st) => {
    return Number(st.id) === Number(stateId);
  });

  if (state) {
    const [minLng, minLat, maxLng, maxLat] = bbox(state);

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 20, duration: 500 }
    );
  } else if (states.length !== 0) {
    return;
  }
  if (state && isVillages) {
    setTimeout(() => {
      map.setZoom(8);
    }, 500);
  }
  setTimeout(() => {
    const features = map?.querySourceFeatures("tiles", {
      sourceLayer: sourceLayers[divisionType as keyof typeof sourceLayers],
    });
    const feature = features.find((feat) => {
      return feat.id === divisionId;
    });
    if (!feature && !isVillages) return;
    if (feature) {
      const [featMinLng, featMinLat, featMaxLng, featMaxLat] = bbox(feature);
      map.fitBounds(
        [
          [featMinLng, featMinLat],
          [featMaxLng, featMaxLat],
        ],
        { padding: 20, duration: 1000 }
      );
      setFeatureAux(overrideFeature(feature, divisionType));
      map.setFeatureState(overrideFeature(feature, divisionType), {
        decile: "#A51C30",
      });
    } else {
      setFeatureAux(undefined);
    }
  }, 750);
};

export const zoomToBoundingBox = (
  map: MapboxMap,
  ids: number[],
  layer?: string
) => {
  // Reset zoom to initial position
  map.setZoom(3);
  const layerFilter = (x: MapboxGeoJSONFeature) => {
    if (layer) {
      return (
        x.sourceLayer === layer && ids.find((i) => Number(i) === Number(x.id))
      );
    } else {
      return ids.find((i) => Number(i) === Number(x.id));
    }
  };

  // Timeout is to give time for the map to make all india visible
  // queryRenderedFeatures only queries what is visible on screen
  setTimeout(() => {
    const features = map
      ?.queryRenderedFeatures()!
      .filter((x) => layerFilter(x));
    const uniqueFeatures = getUniqueFeatures(features, "id");
    const bounds = getBoundingBox(uniqueFeatures);
    // Then zoom to new bounds
    map.fitBounds(bounds, { padding: 20, duration: 1000 });
  }, 1000);
};

export const zoomToBoundingBoxState = (map: MapboxMap, ids: number[]) => {
  map.setZoom(3);

  setTimeout(() => {
    const features = map
      ?.queryRenderedFeatures()!
      .filter((f) => f.sourceLayer === "states")
      .filter((x) => ids.find((i) => String(i) === String(x.id)));

    const uniqueFeatures = getUniqueFeatures(features, "id");

    const bounds = getBoundingBox(uniqueFeatures);
    // Then zoom to new bounds
    map.fitBounds(bounds, { padding: 20, duration: 1000 });
  }, 500);
};

// Because features come from tiled vector data,
// feature geometries may be split
// or duplicated across tile boundaries.
// As a result, features may appear
// multiple times in query results.
export const getUniqueFeatures = (
  features: MapboxGeoJSONFeature[],
  comparatorProperty: string
) => {
  const uniqueIds = new Set();
  const uniqueFeatures = [];
  for (const feature of features) {
    if (feature.properties) {
      const id = feature.properties[comparatorProperty];
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        uniqueFeatures.push(feature);
      }
    }
  }
  return uniqueFeatures;
};

export const calculatePolygonNorthWest = (feature: MapboxGeoJSONFeature) => {
  const [minLng, minLat, maxLng, maxLat] = bbox(feature);
  const bounds = new LngLatBounds([minLng, minLat, maxLng, maxLat]);
  return bounds.getNorthWest();
};

export const calculatePolygonCenter = (feature: MapboxGeoJSONFeature) => {
  const [minLng, minLat, maxLng, maxLat] = bbox(feature);
  const bounds = new LngLatBounds([minLng, minLat, maxLng, maxLat]);
  return bounds.getCenter();
};

export const divisionTypeFilterMapVillageImage = (
  divisionType: DivisionTypes,
  map: MapboxMap,
  id: number,
  districtId: number,
  stateId: number,
  colorDecile: string,
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setFoundShape?: React.Dispatch<React.SetStateAction<boolean>>,
  isVillage?: boolean
) => {
  const layer = map.getLayer(divisionType);
  const villageFilter = ["==", ["get", "id"], id];
  if (layer) {
    map.setPaintProperty("Villages", "fill-color", colorDecile);
    map.setFilter(divisionType, villageFilter);
  }

  const districtLayer = map.getLayer("districts");
  const districtFilter = ["==", ["get", "id"], districtId];
  if (districtLayer) {
    map.setFilter("districts", districtFilter);
  }

  const stateLayer = map.getLayer("states");
  const stateFilter = ["==", ["get", "id"], stateId];
  if (stateLayer) {
    map.setPaintProperty("states", "line-color", "transparent");
    map.setFilter("states", stateFilter);
  }
  map.setZoom(1.9);
  map.fitBounds(initialCoords, { padding: 50, duration: 0 });
  setTimeout(() => {
    const states = map.querySourceFeatures("district-tiles", {
      sourceLayer: "states",
    });
    const state = states.filter((item) => {
      return Number(item.id) === Number(stateId);
    });
    if (state!) {
      const bounds = getBoundingBox(state!);
      map.fitBounds(bounds, { padding: 20, duration: 0 });
    }

    const districts = map.querySourceFeatures("district-tiles", {
      sourceLayer: "districts",
    });

    featureFilterVillages(
      districts,
      map,
      id,
      districtId,
      setLoaded,
      setFoundShape,
      isVillage
    );
  }, 1000);
};

const featureFilterVillages = (
  districtFeatures: MapboxGeoJSONFeature[],
  mapAux: MapboxMap,
  id: number,
  districtId: number,
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setFoundShape?: React.Dispatch<React.SetStateAction<boolean>>,
  isVillage?: boolean
) => {
  const district = districtFeatures.filter((item) => {
    return Number(item.id) === Number(districtId);
  });
  if (district!) {
    const bounds = getBoundingBox(district!);
    mapAux.fitBounds(bounds, { padding: 20, duration: 0 });
  }
  if (mapAux.getZoom() < 8) {
    mapAux.setZoom(8);
  }
  if (isVillage && setFoundShape) {
    setTimeout(() => {
      const divisions = mapAux?.querySourceFeatures("tiles", {
        sourceLayer: "villages",
      });
      const division = divisions.filter((x) => {
        return Number(x.id) === Number(id);
      });
      if (division && division.length !== 0) {
        setFoundShape(true);
        const bounds = getBoundingBox(division!);
        mapAux.fitBounds(bounds, {
          padding: 30,
          duration: 0,
        });
        mapAux.setLayoutProperty("states", "visibility", "none");
        mapAux.setLayoutProperty("districts", "visibility", "none");
      }
    }, 1500);
  }
  setLoaded(true);
};

const featureFilter = (
  statesFeatures: MapboxGeoJSONFeature[],
  featuresArray: MapboxGeoJSONFeature[],
  mapAux: MapboxMap,
  divisionType: string,
  color: string,
  id: number,
  stateId?: number,
  isDistrict?: boolean
) => {
  const division = featuresArray.filter((item) => {
    return Number(item.id) === Number(id);
  });
  const state = statesFeatures.filter((item) => {
    return Number(item.id) === Number(stateId);
  });
  if (state!) {
    const bounds = getBoundingBox(state!);
    mapAux.fitBounds(bounds, {
      padding: 20,
      duration: 0,
    });
  }

  if (division!) {
    mapAux.setFeatureState(overrideFeature(division[0]!, divisionType), {
      decile: color,
    });
    if (isDistrict) {
      const bounds = getBoundingBox(division!);
      mapAux.fitBounds(bounds, {
        padding: 30,
        duration: 0,
      });
      mapAux.setLayoutProperty("states-line", "visibility", "none");
    }
  }
};

export const divisionTypeFilterMapDistrictImage = (
  divisionType: DivisionTypes,
  map: MapboxMap,
  id: number,
  stateId: number,
  colorDecile: string
) => {
  const layer = map.getLayer(divisionType);
  const districtFilter = ["==", ["get", "id"], id];
  if (layer) {
    map.setPaintProperty(divisionType, "fill-color", colorDecile);
    map.setFilter(divisionType, districtFilter);
  }
  const stateLayer = map.getLayer("states-line");
  const stateFilter = ["==", ["get", "id"], stateId];
  if (stateLayer) {
    map.setFilter("states-line", stateFilter);
  }
  map.setZoom(3);
  setTimeout(() => {
    const states = map.querySourceFeatures("tiles", { sourceLayer: "states" });
    const state = states.filter((item) => {
      return Number(item.id) === Number(stateId);
    });
    if (state!) {
      const bounds = getBoundingBox(state!);
      map.fitBounds(bounds, {
        padding: 20,
        duration: 0,
      });
    }
    setTimeout(() => {
      const features = map.querySourceFeatures("tiles", {
        sourceLayer: sourceLayers[divisionType as keyof typeof sourceLayers],
      });

      featureFilter(
        states,
        features,
        map,
        divisionType,
        colorDecile,
        id,
        stateId,
        true
      );
    }, 300);
  }, 500);
};

export const divisionTypeFilterMapStateImage = (
  divisionType: DivisionTypes,
  map: MapboxMap,
  id: number,
  stateId: number,
  colorDecile: string
) => {
  const layer = map.getLayer(divisionType);
  const filter = ["==", ["get", "id"], id];
  if (layer) {
    map.setFilter(divisionType, filter);
  }

  const stateLayer = map.getLayer("states");
  const stateFilter = ["==", ["get", "id"], stateId];
  if (stateLayer) {
    map.setPaintProperty("states", "fill-outline-color", "#3d4247");
    map.setFilter("states", stateFilter);
  }
  map.setZoom(3);
  setTimeout(() => {
    const states = map.querySourceFeatures("tiles", { sourceLayer: "states" });

    const features = map.querySourceFeatures("tiles", {
      sourceLayer: sourceLayers[divisionType as keyof typeof sourceLayers],
    });

    featureFilter(
      states,
      features,
      map,
      divisionType,
      colorDecile,
      id,
      stateId
    );
  }, 1000);
};

export const filterDistrictLayer = (map: MapboxMap, districtId: number) => {
  const districtLayer = map.getLayer("districts-line");
  const districtFilter = ["==", ["get", "id"], districtId ?? null];
  if (districtLayer) {
    map.setFilter("districts-line", districtFilter);
  }
};

export const overrideFeature = (feature: any, key: any) => {
  if (!feature?.source || !feature?.sourceLayer) {
    return {
      ...feature,
      source: "tiles",
      sourceLayer: sourceLayers[key as keyof typeof sourceLayers],
    };
  } else {
    return feature;
  }
};
export const filterById = (ids: Array<number>) => [
  "in",
  ["get", "id"],
  ["literal", ids],
];

export const filterVillageLayer = (map: MapboxMap, villageIds: number[]) => {
  const villageFilter = filterById(villageIds);
  const villageLayer = map.getLayer(DivisionTypes.Village);
  if (villageLayer) {
    map.setFilter(DivisionTypes.Village, villageFilter);
  }
};
