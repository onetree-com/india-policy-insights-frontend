import DataView from "components/DataView";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { DataViews } from "models/data-view";
import { FC, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AtlasDataView: FC = () => {
  const { atlasDispatch } = useContext(AtlasContext)!;
  const { state: navState } = useLocation();
  const [dataView, setDataView] = useState<DataViews>(
    navState && navState.dataView ? navState.dataView : "2021"
  );

  useEffect(() => {
    atlasDispatch({
      type: AtlasActionType.SET_DATA_VIEW,
      payload: {
        "2021": {
          year: 2021,
        },
        "2016 - 2021": {
          year: 2016,
          yearEnd: 2021,
        },
      }[dataView],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataView]);

  return <DataView dataView={dataView} setDataView={setDataView} />;
};

export default AtlasDataView;
