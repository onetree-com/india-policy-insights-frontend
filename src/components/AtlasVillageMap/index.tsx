import { FC, useCallback, useContext, useEffect, useState } from "react";
import { MapPopupInfo } from "components/Map";
import styles from "./tooltipStyles.module.scss";
import VillageMap from "components/VillageMap";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { Map as MapboxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import {
  calculatePolygonNorthWest,
  filterById,
  filterDistrictLayer,
  filterVillageLayer,
  getUniqueFeatures,
  initialCoords,
  zoomToBoundingBox,
} from "utils/mapbox";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { useTranslation } from "react-i18next";

const overrideFeatureData = (feature: any) => {
  if (!feature.source || !feature.sourceLayer) {
    return { ...feature, source: "tiles", sourceLayer: "villages" };
  } else {
    return feature;
  }
};

const AtlasVillageMap: FC = () => {
  // const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState } = useContext(GlobalContext)!;
  const { hideLoadingScreen } = useGlobalActions();
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const [map, setMap] = useState<MapboxMap>();
  const { t, i18n } = useTranslation();

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (loaded) {
      atlasDispatch({
        type: AtlasActionType.SET_IS_MAP_LOADED,
        payload: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  useEffect(() => {
    if (!map) return;
    if (atlasState.mapNotAvailable) {
      const container = map.getContainer();
      const disclaimer = document.createElement("div");
      disclaimer.id = "disclaimer";
      disclaimer.className = styles.tooltip;
      disclaimer.innerHTML = t("no_map_available_atlas");

      container.appendChild(disclaimer);
    } else {
      const container = map.getContainer();
      const oldDisclaimer = container.querySelector("#disclaimer");
      oldDisclaimer?.remove();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atlasState.mapNotAvailable, map, i18n.language]);

  const [selectedDivision, setSelectedDivision] = useState<number | undefined>(
    globalState.selectedDivision?.division?.id
  );

  const [popup, setPopup] = useState<MapPopupInfo | null>(null);

  const onClick = (feature?: MapboxGeoJSONFeature) => {
    if (!map || !loaded) return;

    if (feature) {
      const northWest = calculatePolygonNorthWest(feature);
      const village = atlasState.allDistrictVillages.find(
        (v) => v.id === feature.properties?.id
      );
      setPopup(null);
      setTimeout(() => {
        if (village) {
          setPopup({
            feature,
            lngLat: northWest!,
            name: village.name,
          });
        }
      }, 100);
      // bring selected village info
      fetchSelectedVillage(feature.properties?.id);
    }
  };

  const fetchSelectedVillage = (id: number) => {
    const data = atlasState.divisionsMeasurements.find((item) => {
      return item.id === id;
    });
    if (!data) return;

    const { name, prevalence } = data;
    atlasDispatch({
      type: AtlasActionType.SELECTED_VILLAGE_MAP,
      payload: {
        prevalence,
        name,
        regionId: id,
      },
    });
  };

  const repaint = useCallback(
    (map?: MapboxMap, selectedDeciles?: number[]) => {
      if (!map || !loaded) return;

      const villageFilter = filterById(
        atlasState.allDistrictVillages.map((v) => v.id)
      );
      var sourceFeatures = map.querySourceFeatures("tiles", {
        sourceLayer: "villages",
        filter: villageFilter,
      });
      const uniqueFeatures = getUniqueFeatures(sourceFeatures, "id");
      const measurements = atlasState.divisionsMeasurements;
      const deciles = atlasState.indicatorDeciles;
      uniqueFeatures?.forEach((feature: any) => {
        const data = measurements.find((m) => m.id === feature.properties.id);
        const decileIndex = data?.prevalenceDecile
          ? data.prevalenceDecile / 10
          : 0;
        let decile = deciles?.prevalenceHx[decileIndex]?.trim();

        if (selectedDeciles!.length !== 10) {
          if (selectedDeciles?.includes(data?.prevalenceDecile!)) {
            map.setFeatureState(overrideFeatureData(feature), { decile });
          } else {
            decile = "transparent";
            map.setFeatureState(overrideFeatureData(feature), { decile });
          }
        } else {
          map.setFeatureState(overrideFeatureData(feature), { decile });
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, loaded, atlasState.divisionsMeasurements]
  );

  useEffect(
    () => {
      if (!map || !loaded) return;
      repaint(map, atlasState.selectedDeciles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, loaded, atlasState.divisionsMeasurements, atlasState.selectedDeciles]
  );

  useEffect(() => {
    if (!map || !loaded) return;

    // filter layer to show selected district
    filterDistrictLayer(map, globalState.selectedDivision?.division?.id!);
    // filter village layer by district
    filterVillageLayer(
      map,
      atlasState.allDistrictVillages.map((v) => v.id)
    );

    if (globalState.selectedDivision?.division?.id !== selectedDivision) {
      map.fitBounds(initialCoords);
      map.setLayoutProperty(DivisionTypes.Village, "visibility", "none");
    }

    setSelectedDivision(globalState.selectedDivision?.division?.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, globalState.selectedDivision?.division?.id]);

  useEffect(() => {
    if (!map || !selectedDivision) return;

    zoomToBoundingBox(map, [selectedDivision]);
    map.setLayoutProperty(DivisionTypes.Village, "visibility", "visible");
    map.setPaintProperty("districts-line", "line-color", "#f5f4f4");
    repaint(map, atlasState.selectedDeciles);

    hideLoadingScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDivision, map]);

  return (
    <>
      <VillageMap
        map={map}
        setMap={setMap}
        loaded={loaded}
        setLoaded={setLoaded}
        onIdle={() => {
          map?.triggerRepaint();
          if (map?.getZoom()! < 8 && map?.getZoom() !== 3) {
            map?.setZoom(8);
          }
        }}
        showPopupInfo={popup}
        onClickFeature={onClick}
        indId={atlasState.selectedIndicator?.indId}
        divisions={atlasState.selectedDivisions}
        dataView={atlasState.dataView.year === 2021 ? "2021" : "2016 - 2021"}
        deciles={atlasState.selectedDeciles}
      />
    </>
  );
};

export default AtlasVillageMap;
