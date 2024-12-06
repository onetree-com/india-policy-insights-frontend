import { getMeasurements } from "api/getMeasurements";
import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import cx from "classnames";
import Checkbox from "components/Checkbox";
import styles from "components/Modal/styles.module.scss";
import Radio from "components/Radio";
import stylesRadio from "components/Radio/styles.module.scss";
import Text from "components/Text";
import { CompareActionType, CompareContext } from "context/compareContext";
import { GlobalContext } from "context/globalContext";
import { division } from "models/divisions";
import { indicator } from "models/indicator";
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { filterIndicators } from "utils/calculateSelectedIndicatorN";
import { dispatchGTMEvent } from "utils/tagManager";
import { updateColumn } from "utils/updateTable";

interface Props {
  title: string;
  search: string;
  type: "radio" | "checkbox";
  btnDisabled: boolean;
  setBtnDisabled: Function;
  pendingDispatches?: { type: any; payload?: any }[];
  setPendingDispatches?: Dispatch<
    SetStateAction<
      {
        type: any;
        payload?: any;
      }[]
    >
  >;
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
  id?: number;
  allIndicators: indicator[];
  seeSelectedIndicators: boolean;
  indicatorsSelected?: indicator[];
  setIndicatorsSelected?: (deleted: boolean, indicator: indicator) => void;
}

const ModalContentIndicatorsCompare: FC<Props> = ({
  title,
  id,
  type,
  allIndicators,
  seeSelectedIndicators,
  indicatorsSelected,
  setIndicatorsSelected,
  selectedDivisions,
  search,
  setPendingDispatches,
  pendingDispatches,
  btnDisabled,
  setBtnDisabled,
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;
  const { state } = useContext(CompareContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const indicatorsFiltered = useMemo<Array<indicator>>(() => {
    return filterIndicators(search, title, allIndicators, setExpand);
  }, [allIndicators, title, search]);

  function handleAddIndicatorCompare(indicator: indicator) {
    Promise.all(
      selectedDivisions!.map((item) => {
        return getMeasurements<{
          region: indicator[];
          state: indicator[];
          allIndia: indicator[];
        }>({
          RegCount: 1000,
          RegIgnored: 0,
          RegionType: globalState.divisionType,
          RegionId: item.division.id,
          StateId: item.parent.id,
          Year: state.dataView === "2016 - 2021" ? 2016 : 2021,
          YearEnd: state.dataView === "2016 - 2021" ? 2021 : 0,
          Indicators: [indicator.indId!],
          currentLanguage,
        });
      })
    )
      .then((data) => {
        let inds = [indicator];
        data.flat(1).forEach((item, index) => {
          const parsedRegionInd: indicator[] = [];
          if (item.region.length === 0) {
            parsedRegionInd.push({ ...indicator });
          } else {
            parsedRegionInd.push(item.region[0]);
          }
          inds = updateColumn(
            parsedRegionInd,
            item.state,
            item.allIndia,
            inds,
            `row${index + 1}`,
            state.dataView ?? "2021"
          );
        });
        setPendingDispatches!([
          ...(pendingDispatches! ?? []),
          {
            type: CompareActionType.SELECT_INDICATOR,
            payload: { ...inds[0] },
          },
        ]);
        setBtnDisabled(false);
      })
      .catch((err) => {
        setBtnDisabled(false);
      });
  }

  const onClickIndicator = (indicator: indicator) => {
    setBtnDisabled(true);
    if (
      indicatorsSelected!.findIndex((item) => {
        return (
          item.indId === indicator.indId &&
          (item.deleted === false || item.deleted === undefined)
        );
      }) !== -1
    ) {
      dispatchGTMEvent({
        event: "indicator_select_click",
        action: "Exclude",
        value: indicator.indNameEn,
      });
      setIndicatorsSelected!(true, indicator);
      setPendingDispatches!([
        ...pendingDispatches!,
        {
          type: CompareActionType.DESELECT_INDICATOR,
          payload: { indId: indicator.indId },
        },
      ]);
      setBtnDisabled(false);
    } else {
      if (indicatorsSelected?.length! < 25) {
        dispatchGTMEvent({
          event: "indicator_select_click",
          action: "Include",
          value: indicator.indNameEn,
        });
        setIndicatorsSelected!(false, indicator);
      }
      handleAddIndicatorCompare(indicator);
    }
  };

  const isIndicatorChecked = (item: indicator) => {
    return indicatorsSelected
      ? indicatorsSelected!.findIndex((indicator) => {
          return (
            indicator.indId === item.indId &&
            (indicator.deleted === false || indicator.deleted === undefined)
          );
        }) !== -1
      : false;
  };

  const indicatorInput = (item: indicator) => {
    return (
      <div key={item!.indId} className={styles["modal-content-item"]}>
        {type === "checkbox" ? (
          <Checkbox
            isChecked={isIndicatorChecked(item)}
            onClick={() => {
              if (!btnDisabled) {
                onClickIndicator(item);
              }
            }}
          />
        ) : (
          <Radio
            customDot={
              <div
                className={cx(
                  isIndicatorChecked(item) && stylesRadio["radio-inner-circle"]
                )}
              />
            }
            value={item.indName!}
            onChange={() => onClickIndicator(item)}
          />
        )}

        <p>{item.indName}</p>
      </div>
    );
  };

  return (
    <>
      <div className={styles["modal-content"]}>
        {search === "" ||
        title.toLowerCase().includes(search.trim().toLowerCase()) ||
        indicatorsFiltered.some((i) =>
          i.indName?.toLowerCase().includes(search.trim().toLowerCase())
        ) ? (
          <div className={styles["modal-content-title"]}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text weight={300} size="16px" lineHeight="24px" color="#A51C30">
                {title}
              </Text>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={(): void => setExpand(!expand)}>
              {expand ? (
                <ExpandUp color="#565656" />
              ) : (
                <ExpandDown color="#565656" />
              )}
            </div>
          </div>
        ) : null}
        {expand && indicatorsFiltered
          ? indicatorsFiltered!.map((item) => {
              return seeSelectedIndicators
                ? isIndicatorChecked(item)
                  ? indicatorInput(item)
                  : null
                : indicatorInput(item);
            })
          : null}
      </div>
    </>
  );
};

export default ModalContentIndicatorsCompare;
