import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import DataView from "components/DataView";
import DeepDiveMap from "components/DeepDiveMap";
import styles from "components/DeepDiveSidebar/styles.module.scss";
import Indicator from "components/Indicator";
import PopulationProfile from "components/PopulationProfile";
import StateDistrictFilter from "components/StateDistrictFilter";
import Text from "components/Text";
import { DeepDiveContext } from "context/deepDiveContext";
import { useDeepDiveActions } from "context/deepDiveContext/useDeepDiveActions";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { FC, useContext, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import { calculateSelectedIndicatorCount } from "../../utils/calculateSelectedIndicatorN";
import { useTranslation } from "react-i18next";

const DeepDiveSidebar: FC<{ isPending: boolean }> = ({ isPending }) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [expand, setExpand] = useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;
  const { state, dispatch } = useContext(DeepDiveContext)!;
  const { updateDataview } = useDeepDiveActions();
  const { t } = useTranslation();

  const content = (
    <>
      <div className={styles.sidebar}>
        <DataView
          dataView={state.dataView || "2021"}
          setDataView={(payload) => {
            updateDataview(payload);
          }}
        />
        <StateDistrictFilter
          isPending={isPending}
          selectedDivision={
            state.selectedDivision &&
            Object.keys(state.selectedDivision).length !== 0
              ? {
                  parent: {
                    id: state.selectedDivision?.district?.id,
                    name: state.selectedDivision?.district?.name,
                  },
                  division: state.selectedDivision?.village,
                }
              : undefined
          }
        />
        <Indicator
          allIndicators={state.allIndicators}
          selectedIndicators={state.selectedIndicators}
          dispatch={dispatch}
        />
        {isDesktop ? (
          <>
            <DeepDiveMap mapWidth={370} />
            <PopulationProfile
              districtName={
                globalState.divisionType !== DivisionTypes.Village
                  ? globalState.selectedDivision?.division?.name!
                  : state.selectedDivision &&
                    Object.values(state.selectedDivision!).length !== 0
                  ? state.selectedDivision?.village?.name
                  : ""
              }
            />
          </>
        ) : null}
      </div>
    </>
  );
  const getDivisionName = () => {
    if (
      globalState.divisionType === DivisionTypes.Village &&
      state.selectedDivision?.village?.name
    ) {
      return state.selectedDivision.village.name;
    } else if (globalState.selectedDivision?.division?.name) {
      return globalState.selectedDivision?.division?.name;
    } else {
      return undefined;
    }
  };

  const getParsedDivisionType = () => {
    if (!globalState.divisionType) return;
    if (
      globalState.divisionType !== DivisionTypes.District &&
      globalState.divisionType !== DivisionTypes.Village
    ) {
      return `Select a ${t(globalState.divisionType.replace("ies", "y"))}`;
    } else {
      return `Select a ${globalState.divisionType.replace("ts", "t")}`;
    }
  };

  const indicatorsSelected = calculateSelectedIndicatorCount(
    state.selectedIndicators,
    state.allIndicators
  );
  return (
    <>
      <div
        style={{ padding: !isDesktop && !expand ? "16px" : "" }}
        className={styles.container}>
        {isDesktop ? (
          content
        ) : (
          <div className={styles.mobile}>
            {expand ? (
              content
            ) : (
              <>
                <Text
                  style={{ marginTop: "10px" }}
                  lineHeight="24px"
                  weight={400}
                  size="14px"
                  color="#3D4247">
                  {state.dataView}/{" "}
                  {getDivisionName() ?? getParsedDivisionType()} /{" "}
                  {indicatorsSelected} Indicator
                  {indicatorsSelected > 1 ? "s" : ""} selected
                </Text>
              </>
            )}
          </div>
        )}
      </div>
      {!isDesktop && (
        <div
          className={styles.bottomLine}
          onClick={(): void => setExpand(!expand)}>
          {expand ? (
            <ExpandUp color="#504F54" />
          ) : (
            <>
              <p className={styles.text}>Select</p>
              <ExpandDown color="#242328" />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default DeepDiveSidebar;
