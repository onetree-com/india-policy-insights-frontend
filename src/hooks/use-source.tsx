import { DivisionTypes } from "context/globalContext";
import { useMemo } from "react";
import { SourceProps } from "react-map-gl";

interface Props {
  divisionType: DivisionTypes;
}

function useSource({ divisionType }: Props) {
  const source = useMemo<SourceProps>(() => {
    var url = process.env.REACT_APP_MAP_SOURCE_URL;

    const sources: { [key in DivisionTypes]: SourceProps } = {
      [DivisionTypes.Assembly_Constituencies]: {
        id: "tiles",
        type: "vector",
        url: `${url}/acs.json`,
        promoteId: "id",
      },
      [DivisionTypes.Parlimentary_Constituencies]: {
        id: "tiles",
        type: "vector",
        url: `${url}/pcs.json`,
        promoteId: "id",
      },
      [DivisionTypes.District]: {
        id: "tiles",
        type: "vector",
        url: `${url}/districts.json`,
        promoteId: "id",
      },
      [DivisionTypes.Village]: {
        id: "tiles",
        type: "vector",
        url: `${url}/villages.json`,
        promoteId: "id",
      },
    };

    return sources[divisionType];
  }, [divisionType]);

  return { source };
}

export default useSource;
