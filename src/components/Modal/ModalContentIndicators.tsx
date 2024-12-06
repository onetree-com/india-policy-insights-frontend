import { getMeasurements } from "api/getMeasurements";
import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import cx from "classnames";
import Checkbox from "components/Checkbox";
import styles from "components/Modal/styles.module.scss";
import Radio from "components/Radio";
import stylesRadio from "components/Radio/styles.module.scss";
import Text from "components/Text";
import { CompareActionType } from "context/compareContext";
import { CreateReportActionType } from "context/createReportContext";
import { DeepDiveActionType } from "context/deepDiveContext";
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

const ModalContentIndicators: FC<Props> = ({
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
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const indicatorsFiltered = useMemo<Array<indicator>>(() => {
    return filterIndicators(search, title, allIndicators, setExpand);
  }, [allIndicators, title, search]);

  function handleAddIndicatorCompare(indicator: indicator) {
    if (selectedDivisions && selectedDivisions.length !== 0) {
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
            Year: 2016,
            YearEnd: 2021,
            Indicators: [indicator.indId!],
            currentLanguage,
          });
        })
      ).then((data) => {
        let inds = [indicator];
        data.flat(1).forEach((item, index) => {
          inds = updateColumn(
            item.region,
            item.state,
            item.allIndia,
            inds,
            `row${index + 1}`
          );
        });
        setPendingDispatches!([
          ...(pendingDispatches! ?? []),
          {
            type: CompareActionType.SELECT_INDICATOR,
            payload: { ...inds[0] },
          },
        ]);
      });
    }
  }

  const onClickIndicator = (indicator: indicator) => {
    if (
      indicatorsSelected!.findIndex((item) => {
        return (
          item.indId === indicator.indId &&
          (item.deleted === false || item.deleted === undefined)
        );
      }) !== -1
    ) {
      setIndicatorsSelected!(true, indicator);
      switch (globalState.navigation.feature) {
        case "CREATE_REPORT":
          dispatchGTMEvent({
            event: "indicator_select_click",
            action: "Exclude",
            value: `${indicator.indNameEn}`,
          });
          setPendingDispatches!([
            ...pendingDispatches!,
            {
              type: CreateReportActionType.DESELECT_INDICATOR,
              payload: { indId: indicator.indId },
            },
          ]);
          break;
        case "DEEP_DIVE":
          dispatchGTMEvent({
            event: "indicator_select_click",
            action: "Exclude",
            value: indicator.indNameEn,
          });
          setPendingDispatches!([
            ...pendingDispatches!,
            {
              type: DeepDiveActionType.DESELECT_INDICATOR,
              payload: { catId: id, indicator },
            },
          ]);
          break;
        case "COMPARE":
          setPendingDispatches!([
            ...pendingDispatches!,
            {
              type: CompareActionType.DESELECT_INDICATOR,
              payload: { indId: indicator.indId },
            },
          ]);
          break;
        default:
          break;
      }
    } else {
      if (globalState.navigation.feature !== "CREATE_REPORT") {
        setIndicatorsSelected!(false, indicator);
      } else if (indicatorsSelected?.length! < 25) {
        setIndicatorsSelected!(false, indicator);
      }
      switch (globalState.navigation.feature) {
        case "CREATE_REPORT":
          dispatchGTMEvent({
            event: "indicator_select_click",
            action: "Include",
            value: `${indicator.indNameEn}`,
          });
          setPendingDispatches!([
            ...pendingDispatches!,
            {
              type: CreateReportActionType.SELECT_INDICATOR,
              payload: indicator,
            },
          ]);
          break;
        case "DEEP_DIVE":
          dispatchGTMEvent({
            event: "indicator_select_click",
            action: "Include",
            value: indicator.indNameEn,
          });
          setPendingDispatches!([
            ...pendingDispatches!,
            {
              type: DeepDiveActionType.SELECT_INDICATOR,
              payload: { catId: id, indicator },
            },
          ]);
          break;
        case "COMPARE":
          handleAddIndicatorCompare(indicator);
          break;
        default:
          break;
      }
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
              return seeSelectedIndicators ? (
                isIndicatorChecked(item) ? (
                  <div
                    key={item!.indId}
                    className={styles["modal-content-item"]}>
                    {type === "checkbox" ? (
                      <Checkbox
                        isChecked={isIndicatorChecked(item)}
                        onClick={() => {
                          onClickIndicator(item);
                        }}
                      />
                    ) : (
                      <Radio
                        customDot={
                          <div
                            className={cx(
                              isIndicatorChecked(item) &&
                                stylesRadio["radio-inner-circle"]
                            )}
                          />
                        }
                        value={item.indName!}
                        onChange={() => onClickIndicator(item)}
                      />
                    )}

                    <p>{item.indName}</p>
                  </div>
                ) : null
              ) : (
                <div key={item!.indId} className={styles["modal-content-item"]}>
                  {type === "checkbox" ? (
                    <Checkbox
                      isChecked={isIndicatorChecked(item)}
                      onClick={() => {
                        onClickIndicator(item);
                      }}
                    />
                  ) : (
                    <Radio
                      customDot={
                        <div
                          className={cx(
                            isIndicatorChecked(item) &&
                              stylesRadio["radio-inner-circle"]
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
            })
          : null}
      </div>
    </>
  );
};

export default ModalContentIndicators;
