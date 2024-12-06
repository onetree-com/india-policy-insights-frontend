import { getIndicatorRegions } from "api/getIndicatorRegions";
import { getRegionMeasurementsChange } from "api/getRegionMeasurementsChange";
import Map, { MapPopupInfo } from "components/Map";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { RankingActionType, RankingContext } from "context/rankingContext";
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
import {
  calculatePolygonNorthWest,
  sourceLayers,
  zoomToBoundingBox,
} from "utils/mapbox";

const RankingMap: FC = () => {
  const [map, setMap] = useState<MapboxMap>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;
  const [popup, setPopup] = useState<MapPopupInfo | null>(null);
  const [selectedFeature, setSelectedFeature] =
    useState<MapboxGeoJSONFeature>();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const bounds = [
    [56.186249, 6.955953],
    [124.415292, 37.078268],
  ];

  useEffect(() => {
    if (!map || !selectedFeature) return;
    //clear feature map state whenever user changes divisions
    setPopup(null);
    map?.setFeatureState(selectedFeature!, { clicked: false });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankingState.selectedDivisions]);

  const measurements = useMemo(
    () =>
      rankingState.divisionsMeasurements
        .filter((x) =>
          rankingState.selectedDeciles.includes(
            globalState.selectedMetric === "prevalence"
              ? x.prevalenceDecile
              : x.headcountDecile
          )
        )
        .reduce<{
          [key: number]: DivisionMeasurement;
        }>((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
    [
      rankingState.divisionsMeasurements,
      rankingState.selectedDeciles,
      globalState.selectedMetric,
    ]
  );

  const measurementsChanges = useMemo(
    () =>
      rankingState.divisionsMeasurementsChanges
        ?.filter((x) =>
          rankingState.selectedDecilesChanges?.includes(x.changeHex)
        )
        .reduce<{
          [key: number]: DivisionMeasurementChanges;
        }>((acc, curr) => ({ ...acc, [curr.regionId]: curr }), {}),
    [
      rankingState.divisionsMeasurementsChanges,
      rankingState.selectedDecilesChanges,
    ]
  );

  const repaint = useCallback(
    (map?: MapboxMap) => {
      if (!map || !loaded) return;

      var features = map.queryRenderedFeatures(undefined);
      if (rankingState.dataView.year === 2016 && measurementsChanges) {
        features?.forEach((feature: any) => {
          var measurementChange = measurementsChanges[Number(feature.id!)];
          var decile = !measurementChange
            ? "transparent"
            : globalState.selectedMetric === "prevalence"
            ? measurementChange.changeHex
            : "transparent";

          map.setFeatureState(feature, { decile });
        });
      } else {
        features?.forEach((feature: any) => {
          var measurement = measurements[Number(feature.id!)];
          var decile = !measurement
            ? "transparent"
            : globalState.selectedMetric === "prevalence"
            ? measurement.prevalenceColor
            : measurement.headcountColor;

          map.setFeatureState(feature, { decile });
        });
      }
    },
    [
      globalState.selectedMetric,
      measurements,
      measurementsChanges,
      rankingState.dataView.year,
      loaded,
    ]
  );

  const fetchSelectedDistrict = (id: number) => {
    var controller = new AbortController();
    getIndicatorRegions({
      regionType: globalState.divisionType,
      regionsId: [id],
      indId: rankingState?.selectedIndicator?.indId!,
      year: rankingState.dataView.year,
      yearEnd: rankingState.dataView.yearEnd ?? 0,
      currentLanguage,
      controller,
    }).then((data: any) => {
      const { max, maxEnd, median, medianEnd, min, minEnd, divisions } = data;
      const { name, prevalence, headcount } = divisions.at(0);
      rankingDispatch({
        type: RankingActionType.SELECTED_DISTRICT_MAP,
        payload: {
          max,
          maxEnd,
          median,
          medianEnd,
          min,
          minEnd,
          headcount,
          prevalence,
          name,
        },
      });
    });
  };

  const fetchSelectedDistrictChange = (
    id: number,
    feature: MapboxGeoJSONFeature,
    center: any
  ) => {
    var controller = new AbortController();
    getRegionMeasurementsChange({
      RegCount: 1000,
      RegIgnored: 0,
      RegionType: globalState.divisionType,
      RegionsId: [id],
      Indicators: [rankingState?.selectedIndicator?.indId!],
      Year: rankingState.dataView.year,
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

      setPopup({
        feature: { ...feature, properties: { name, id } },
        lngLat: center!,
        stateAbbreviation: stateAbbreviation!,
      });
      rankingDispatch({
        type: RankingActionType.SELECTED_DISTRICT_MAP_CHANGES,
        payload: {
          prevalence,
          prevalenceChange,
          prevalenceEnd,
          changeHex,
        },
      });
    });
  };

  const onClick = (feature?: MapboxGeoJSONFeature) => {
    if (!map || !loaded) return;
    rankingDispatch!({
      type: RankingActionType.SELECTED_ROW_TABLE,
      payload: {
        id: feature?.id,
        name: feature?.properties?.name,
        fromMapToTable: true,
      },
    });

    const element = document.getElementById(feature?.id as string);
    element?.scrollIntoView({
      block: "center",
    });

    setPopup(null);
    setSelectedFeature((prev) => {
      if (prev) map.setFeatureState(prev, { clicked: false });
      if (feature) map.setFeatureState(feature, { clicked: true });
      return feature;
    });
  };

  useEffect(
    () => {
      if (!map || !loaded) return;
      map.setMaxBounds(bounds as LngLatBoundsLike);
      map.setLayoutProperty("bright", "visibility", "visible");
      map.setLayoutProperty("dark", "visibility", "visible");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, loaded]
  );

  useEffect(
    () => {
      if (!map || !loaded) return;
      map.resize();
      repaint(map);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      map,
      loaded,
      rankingState.divisionsMeasurements,
      rankingState.divisionsMeasurementsChanges,
      rankingState.selectedDeciles,
      rankingState.selectedDecilesChanges,
      globalState.selectedMetric,
    ]
  );

  useEffect(() => {
    if (!map) return;
    if (rankingState.selectedRowTable.id === "") return;
    if (rankingState.selectedRowTable.fromMapToTable) return;

    map.jumpTo({
      center: { lng: 82.8007705, lat: 22.75088462843118 },
      zoom: 3.1355544045808643,
      pitch: 0,
    });

    var timeout = setTimeout(() => {
      const feature = map
        .queryRenderedFeatures(undefined)
        .filter(
          (feature) =>
            Number(feature.id!) === Number(rankingState.selectedRowTable.id)
        )
        .at(0) as any;

      setPopup(null);
      setSelectedFeature((prev) => {
        if (prev) map.setFeatureState(prev, { clicked: false });
        if (feature) map.setFeatureState(feature, { clicked: true });
        return feature;
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, rankingState.selectedRowTable.id]);

  useEffect(
    () => {
      if (selectedFeature) {
        const center = calculatePolygonNorthWest(selectedFeature);

        fetchSelectedDistrict(Number(selectedFeature.id!));
        fetchSelectedDistrictChange(
          Number(selectedFeature.id!),
          selectedFeature,
          center
        );
      } else {
        rankingDispatch({
          type: RankingActionType.SELECTED_DISTRICT_MAP,
          payload: undefined,
        });
        rankingDispatch({
          type: RankingActionType.SELECTED_DISTRICT_MAP_CHANGES,
          payload: undefined,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFeature, currentLanguage]
  );

  useEffect(
    () => {
      if (!map) return;
      let totalDivisions = 0;
      globalState.allDivisions.forEach((d) => {
        totalDivisions += d.subregions.length;
      });
      if (rankingState.selectedDivisions.length === totalDivisions) return;

      if (globalState.divisionType !== DivisionTypes.Village) {
        const ids = rankingState.selectedDivisions.map((d) => d.id);

        zoomToBoundingBox(
          map,
          ids,
          sourceLayers[globalState.divisionType as keyof typeof sourceLayers]
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rankingState.selectedDivisions]
  );

  return (
    <>
      {globalState.divisionType && (
        <Map
          onClickFeature={onClick}
          map={map}
          setMap={setMap}
          setLoaded={setLoaded}
          onIdle={() => repaint(map!)}
          showPopupInfo={popup}
          dataView={
            rankingState.dataView.year === 2021 ? "2021" : "2016 - 2021"
          }
          indId={rankingState.selectedIndicator?.indId}
          divisions={rankingState.selectedDivisions}
          deciles={rankingState.selectedDeciles}
          decilesChange={rankingState.selectedDecilesChanges}
        />
      )}
    </>
  );
};

export default RankingMap;
