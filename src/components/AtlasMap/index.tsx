import { getRegionMeasurementsChange } from "api/getRegionMeasurementsChange";
import Map, { MapPopupInfo } from "components/Map";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import {
  LngLatBoundsLike,
  Map as MapboxMap,
  MapboxGeoJSONFeature,
} from "mapbox-gl";
import {
  DivisionMeasurement,
  DivisionMeasurementChanges,
} from "models/divisions";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { fetchSelectedDistrict } from "utils/district-utility";
import {
  calculatePolygonNorthWest,
  overrideFeature,
  sourceLayers,
  zoomToBoundingBox,
} from "utils/mapbox";
import { MediaQueries } from "utils/media-queries";

interface Props {
  height?: string;
}

const AtlasMap: FC<Props> = ({ height }) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState } = useContext(GlobalContext)!;
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const [map, setMap] = useState<MapboxMap>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [popup, setPopup] = useState<MapPopupInfo | null>(null);
  const [selectedFeature, setSelectedFeature] =
    useState<MapboxGeoJSONFeature>();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // LEFT -- DOWN
  // RIGHT -- UP
  const [bounds, setBounds] = useState<LngLatBoundsLike>([
    [45.186249, 5.755953],
    [120.415292, 37.078268],
  ]);
  useEffect(() => {
    if (!map || !selectedFeature) return;
    //clear feature map state whenever user changes divisions
    setPopup(null);
    map?.setFeatureState(selectedFeature!, { clicked: false });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atlasState.selectedDivisions]);

  /*  const bounds = isDesktop
    ? [
        [45.186249, 5.755953],
        [120.415292, 37.078268],
      ]
    : [
        [68.186249, 5.755953],
        [97.415292, 37.078268],
      ]; */

  const measurements = useMemo(
    () =>
      atlasState.divisionsMeasurements
        .filter((x) =>
          atlasState.selectedDeciles.includes(
            globalState.selectedMetric === "prevalence"
              ? x.prevalenceDecile
              : x.headcountDecile
          )
        )
        .reduce<{
          [key: number]: DivisionMeasurement;
        }>((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
    [
      atlasState.divisionsMeasurements,
      atlasState.selectedDeciles,
      globalState.selectedMetric,
    ]
  );

  const measurementsChanges = useMemo(
    () =>
      atlasState.divisionsMeasurementsChanges
        ?.filter((x) =>
          atlasState.selectedDecilesChanges?.includes(x.changeHex)
        )
        .reduce<{
          [key: number]: DivisionMeasurementChanges;
        }>((acc, curr) => ({ ...acc, [curr.regionId]: curr }), {}),
    [atlasState.divisionsMeasurementsChanges, atlasState.selectedDecilesChanges]
  );

  const repaint = useCallback(
    (map?: MapboxMap) => {
      if (!map || !loaded) return;
      var features = map.querySourceFeatures("tiles", {
        sourceLayer:
          sourceLayers[globalState.divisionType as keyof typeof sourceLayers],
      });
      if (atlasState.dataView.year === 2016 && measurementsChanges) {
        features?.forEach((feature: any) => {
          var measurementChange = measurementsChanges[Number(feature.id!)];
          var decile = !measurementChange
            ? "transparent"
            : globalState.selectedMetric === "prevalence"
            ? measurementChange.changeHex
            : "transparent";
          if (feature.id) {
            map.setFeatureState(
              overrideFeature(feature, globalState.divisionType),
              { decile }
            );
          }
        });
      } else {
        features?.forEach((feature: any) => {
          var measurement = measurements[Number(feature.id!)];
          var decile = !measurement
            ? "transparent"
            : globalState.selectedMetric === "prevalence"
            ? measurement.prevalenceColor
            : measurement.headcountColor;

          if (feature.id) {
            map.setFeatureState(
              overrideFeature(feature, globalState.divisionType),
              { decile }
            );
          }
        });
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [
      atlasState.dataView.year,
      globalState.selectedMetric,
      measurementsChanges,
      measurements,
      loaded,
    ]
  );

  const fetchSelectedDistrictChange = (
    id: number,
    dataviewChange: boolean,
    feature?: MapboxGeoJSONFeature,
    northWest?: any
  ) => {
    var controller = new AbortController();
    getRegionMeasurementsChange({
      RegCount:
        globalState &&
        globalState.divisionType === DivisionTypes.Assembly_Constituencies
          ? 4200
          : 1000,
      RegIgnored: 0,
      RegionType: globalState.divisionType,
      RegionsId: [id],
      Indicators: [atlasState?.selectedIndicator?.indId!],
      Year: atlasState.dataView.year,
      YearEnd: 2021,
      controller,
      currentLanguage,
    }).then((data: any) => {
      const {
        prevalence,
        prevalenceChange,
        prevalenceEnd,
        changeHex,
        name,
        id,
        stateAbbreviation,
      } = data.regionsChange.at(0);
      if (!dataviewChange && feature) {
        setSelectedFeature(feature);
        setPopup({
          feature: { ...feature, properties: { name, id } },
          lngLat: northWest!,
          stateAbbreviation,
        });
      }
      atlasDispatch({
        type: AtlasActionType.SELECTED_DISTRICT_MAP_CHANGES,
        payload: {
          prevalence,
          prevalenceChange,
          prevalenceEnd,
          changeHex,
          regionId: id,
        },
      });
    });
  };

  const onClick = (feature?: MapboxGeoJSONFeature) => {
    if (!map || !loaded) return;

    if (feature) {
      const northWest = calculatePolygonNorthWest(feature);

      setPopup(null);

      fetchSelectedDistrict(
        atlasDispatch,
        Number(feature?.id!),
        globalState.divisionType,
        atlasState?.selectedIndicator?.indId!,
        atlasState.dataView.year,
        currentLanguage,
        atlasState.dataView.yearEnd,
        feature,
        setSelectedFeature,
        setPopup,
        northWest
      );
      fetchSelectedDistrictChange(
        Number(feature?.id!),
        false,
        feature,
        northWest
      );
    } else {
      atlasDispatch({
        type: AtlasActionType.SELECTED_DISTRICT_MAP,
        payload: undefined,
      });
      atlasDispatch({
        type: AtlasActionType.SELECTED_DISTRICT_MAP_CHANGES,
        payload: undefined,
      });
    }
  };

  useEffect(
    () => {
      if (!map || !loaded) return;

      setBounds(
        isDesktop
          ? [
              [45.186249, 5.755953],
              [120.415292, 37.078268],
            ]
          : [
              [68.186249, 3.255953],
              [97.415292, 37.078268],
            ]
      );

      if (!map.getLayer("bright")) return;
      map.setLayoutProperty("bright", "visibility", "visible");
      map.setLayoutProperty("dark", "visibility", "visible");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, loaded]
  );

  useEffect(
    () => {
      if (!map || !loaded) return;
      map.setMaxBounds(bounds as LngLatBoundsLike);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, loaded, bounds]
  );

  useEffect(
    () => {
      if (!map || !loaded) return;
      repaint(map);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      map,
      loaded,
      atlasState.divisionsMeasurements,
      atlasState.divisionsMeasurementsChanges,
      atlasState.selectedDeciles,
      atlasState.selectedDecilesChanges,
      atlasState.selectedDivisions,
      globalState.selectedMetric,
    ]
  );

  useEffect(
    () => {
      if (!map) return;
      let totalDivisions = 0;
      globalState.allDivisions.forEach((d) => {
        totalDivisions += d.subregions.length;
      });
      if (atlasState.selectedDivisions.length === totalDivisions) return;

      const ids = atlasState.selectedDivisions.map((d) => d.id);
      zoomToBoundingBox(
        map,
        ids,
        sourceLayers[globalState.divisionType as keyof typeof sourceLayers]
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [atlasState.selectedDivisions]
  );

  useEffect(() => {
    if (atlasState.dataView.year === 2021 && atlasState.selectedDistrictMap) {
      fetchSelectedDistrict(
        atlasDispatch,
        atlasState.selectedDistrictMap.regionId,
        globalState.divisionType,
        atlasState?.selectedIndicator?.indId!,
        atlasState.dataView.year,
        currentLanguage,
        atlasState.dataView.yearEnd
      );
    } else if (
      atlasState.dataView.year === 2016 &&
      atlasState.selectedDistrictMapChanges
    ) {
      fetchSelectedDistrictChange(
        atlasState.selectedDistrictMapChanges.regionId,
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atlasState.dataView, currentLanguage]);

  return (
    <>
      {globalState.divisionType ? (
        <Map
          map={map}
          setMap={setMap}
          setLoaded={setLoaded}
          onIdle={() => repaint(map!)}
          showPopupInfo={popup}
          onClickFeature={onClick}
          height={height}
          indId={atlasState.selectedIndicator?.indId}
          divisions={atlasState.selectedDivisions}
          dataView={atlasState.dataView.year === 2021 ? "2021" : "2016 - 2021"}
          deciles={atlasState.selectedDeciles}
          decilesChange={atlasState.selectedDecilesChanges}
        />
      ) : null}
    </>
  );
};

export default AtlasMap;
