import { DataViews } from "models/data-view";
import { FC, useContext, useEffect, useState } from "react";
import { RankingActionType, RankingContext } from "context/rankingContext";
import { DataViewBtnContainer } from "components/DataView";
import { useLocation } from "react-router-dom";

const RankingDataView: FC = () => {
  const { rankingDispatch } = useContext(RankingContext)!;
  const { state: navState } = useLocation();
  const [dataView, setDataView] = useState<DataViews>(
    navState && navState.dataView ? navState.dataView : "2021"
  );

  useEffect(() => {
    setDataView(dataView);
    rankingDispatch({
      type: RankingActionType.SET_DATA_VIEW,
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

  return (
    <>
      <DataViewBtnContainer
        dataView={dataView}
        setDataView={setDataView}
        noText
      />
    </>
  );
};

export default RankingDataView;
