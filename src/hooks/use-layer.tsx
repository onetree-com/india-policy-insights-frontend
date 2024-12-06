import { DivisionTypes } from "context/globalContext";
import { useMemo } from "react";
import { LayerProps, LineLayer, SourceProps } from "react-map-gl";
type LayerStyleProps = LayerProps & {
  "source-layer": string;
  source: string;
};

interface Props {
  divisionType: DivisionTypes;
  source: SourceProps;
  isDeepDiveMap: boolean;
}

const proto: any = {
  type: "fill",
  paint: {
    "fill-color": ["to-color", ["feature-state", "decile"], "transparent"],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      0.5,
      1,
    ],
    "fill-outline-color": "#000000",
  },
  minzoom: 1,
  maxzoom: 20,
  layout: { visibility: "visible" },
};

const states: any = (sourceId: string, isDeepDiveMap: boolean) => {
  return [
    {
      type: "fill",
      source: sourceId,
      "source-layer": "states",
      id: "states",
      paint: {
        "fill-outline-color": "#000",
        "fill-color": "transparent",
      },
      minzoom: 1,
      maxzoom: 20,
    },
    {
      type: "line",
      paint: {
        "line-color": "#3d4247",
        "line-width": 2,
      },
      layout: { visibility: isDeepDiveMap ? "none" : "visible" },
      id: "states-line",
      source: sourceId,
      "source-layer": "states",
      minzoom: 1,
      maxzoom: 20,
    },
  ];
};

const bright: any = {
  id: "bright",
  type: "line",
  paint: {
    "line-color": "#ffffff",
    "line-width": 8,
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "clicked"], false],
      1,
      0,
    ],
  },
  minzoom: 1,
  maxzoom: 20,
  layout: { visibility: "none" },
};

const dark: Partial<LineLayer> = {
  id: "dark",
  type: "line",
  paint: {
    "line-color": "#565656",
    "line-width": 4,
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "clicked"], false],
      1,
      0,
    ],
  },
  minzoom: 1,
  maxzoom: 20,
  layout: { visibility: "none" },
};

function useLayer({ divisionType, source, isDeepDiveMap }: Props) {
  const fill = {
    "fill-outline-color": isDeepDiveMap ? "#93979C" : "#000000",
  };
  const layers = useMemo<Array<LayerStyleProps>>(() => {
    return {
      [DivisionTypes.Assembly_Constituencies]: [
        {
          ...proto,
          id: DivisionTypes.Assembly_Constituencies,
          source: source.id!,
          "source-layer": "acs",
          paint: {
            ...proto.paint,
            ...fill,
          },
        },
        {
          ...bright,
          source: source.id!,
          "source-layer": "acs",
        },
        {
          ...dark,
          source: source.id!,
          "source-layer": "acs",
        },
        ...states(source.id!, isDeepDiveMap),
      ],
      [DivisionTypes.Parlimentary_Constituencies]: [
        {
          ...proto,
          id: DivisionTypes.Parlimentary_Constituencies,
          source: source.id!,
          "source-layer": "pcs",
          paint: {
            ...proto.paint,
            ...fill,
          },
        },
        {
          ...bright,
          source: source.id!,
          "source-layer": "pcs",
        },
        {
          ...dark,
          source: source.id!,
          "source-layer": "pcs",
        },
        ...states(source.id!, isDeepDiveMap),
      ],
      [DivisionTypes.District]: [
        {
          ...proto,
          id: DivisionTypes.District,
          source: source.id!,
          "source-layer": "districts",
          paint: {
            ...proto.paint,
            ...fill,
          },
        },
        ...states(source.id!, isDeepDiveMap),
        {
          ...bright,
          source: source.id!,
          "source-layer": "districts",
        },
        {
          ...dark,
          source: source.id!,
          "source-layer": "districts",
        },
      ],
      [DivisionTypes.Village]: [
        {
          ...proto,
          id: DivisionTypes.District,
          source: source.id!,
          "source-layer": "districts",
          paint: {
            "fill-outline-color": "#000",
            "fill-color": "transparent",
          },
          layout: { visibility: "none" },
        },
        {
          ...proto,
          id: DivisionTypes.Village,
          source: source.id!,
          "source-layer": "villages",
          paint: {
            ...proto.paint,
            ...fill,
          },
          layout: { visibility: "none" },
        },
        {
          ...bright,
          source: source.id!,
          "source-layer": "villages",
        },
        {
          ...dark,
          source: source.id!,
          "source-layer": "villages",
        },
      ],
    }[divisionType];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisionType, source.id, isDeepDiveMap]);

  return layers;
}

export default useLayer;
