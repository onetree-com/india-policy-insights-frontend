import { getIndicatorData } from "api/getIndicatorData";
import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import Checkbox from "components/Checkbox";
import styles from "components/Modal/styles.module.scss";
import Radio from "components/Radio";
import Text from "components/Text";
import { CompareActionType } from "context/compareContext/index";
import { CreateReportActionType } from "context/createReportContext/index";
import { DeepDiveActionType } from "context/deepDiveContext";
import { GlobalActionType, GlobalContext } from "context/globalContext/index";
import { division } from "models/divisions";
import { indicator } from "models/indicator";
import { RouteList } from "models/routes";
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateColumn } from "utils/updateTable";

interface CommonProps {
  title: string;
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
}

type ConditionalProps =
  | {
      items: division[];
      id: number;
      filterByAspirationalDistricts?: boolean;
      selectedDivisions?: {
        parent: { id: number; name: string };
        division: division;
      }[];
      divisionIndex?: { name: string; index: number } | null;
      allIndicators?: never;
      indicatorsSelected?: never;
      dispatch: ({
        type,
        payload,
      }:
        | {
            type: GlobalActionType;
            payload: any;
          }
        | {
            type: CompareActionType;
            payload: any;
          }) => void;
    }
  | {
      items?: never;
      id?: number;
      filterByAspirationalDistricts?: never;
      selectedDivisions?: {
        parent: { id: number; name: string };
        division: division;
      }[];
      divisionIndex?: never;
      allIndicators: indicator[];
      indicatorsSelected?: indicator[];
      dispatch: ({
        type,
        payload,
      }:
        | {
            type: DeepDiveActionType;
            payload: any;
          }
        | {
            type: CreateReportActionType;
            payload: any;
          }
        | {
            type: CompareActionType;
            payload: any;
          }) => void;
    };

type Props = CommonProps & ConditionalProps;

const ModalContent: FC<Props> = ({
  title,
  id,
  type,
  items,
  allIndicators,
  indicatorsSelected,
  dispatch,
  filterByAspirationalDistricts,
  selectedDivisions,
  divisionIndex,
  setPendingDispatches,
  pendingDispatches,
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);
  const { pathname } = useLocation();
  const { globalState } = useContext(GlobalContext)!;
  const [indicatorsSelectedCln, setIndicatorsSelectedCln] =
    useState(indicatorsSelected);

  function handleAddIndicatorCompare(indicator: indicator) {
    if (selectedDivisions && selectedDivisions.length !== 0) {
      Promise.all(
        selectedDivisions!.map((item) => {
          return getIndicatorData<{
            region: indicator[];
            state: indicator[];
            allIndia: indicator[];
          }>({
            RegionType: globalState.divisionType,
            RegionId: item.division.id,
            Year: 2016,
            YearEnd: 2021,
            indicators: [indicator.indId!],
          });
        })
      ).then((data) => {
        let inds = [indicator];
        data.flat(1).forEach((item, index) => {
          switch (true) {
            case index === 0:
              inds = updateColumn(
                item.region,
                item.state,
                item.allIndia,
                inds,
                `row${index + 1}`
              );
              break;
            case index === 1:
              inds = updateColumn(
                item.region,
                item.state,
                item.allIndia,
                inds,
                `row${index + 1}`
              );
              break;
            case index === 2:
              inds = updateColumn(
                item.region,
                item.state,
                item.allIndia,
                inds,
                `row${index + 1}`
              );
              break;
            case index === 3:
              inds = updateColumn(
                item.region,
                item.state,
                item.allIndia,
                inds,
                `row${index + 1}`
              );
              break;

            default:
              break;
          }
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

  return (
    <>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-content-title"]}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {type === "checkbox" &&
            pathname !== RouteList.DEEP_DIVE &&
            typeof items === "string" ? (
              <Checkbox
                isChecked={items === itemsSelected}
                onClick={(): void => {
                  if (items === itemsSelected) setItemsSelected([]);
                  else setItemsSelected(items!);
                }}
              />
            ) : null}
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
        {expand && items
          ? items!.map((item) => {
              return filterByAspirationalDistricts ? (
                item.aspirational! === true ? (
                  <Item
                    key={item.id}
                    item={item}
                    title={title}
                    dispatch={dispatch}
                    type={type}
                    pathname={pathname}
                    id={id}
                    selectedDivisionsc={selectedDivisions}
                    divisionIndex={divisionIndex}
                  />
                ) : null
              ) : (
                <Item
                  key={item.id}
                  item={item}
                  title={title}
                  dispatch={dispatch}
                  type={type}
                  pathname={pathname}
                  id={id}
                  selectedDivisionsc={selectedDivisions}
                  divisionIndex={divisionIndex}
                />
              );
            })
          : null}
        {expand &&
        pathname !== RouteList.ATLAS &&
        allIndicators &&
        indicatorsSelectedCln
          ? allIndicators!.map((item) => (
              <div key={item!.indId} className={styles["modal-content-item"]}>
                <Checkbox
                  isChecked={
                    indicatorsSelectedCln
                      ? indicatorsSelectedCln!.findIndex((indicator) => {
                          return (
                            indicator.indId === item.indId &&
                            (indicator.deleted === false ||
                              indicator.deleted === undefined)
                          );
                        }) !== -1
                      : false
                  }
                  onClick={() => {
                    if (
                      indicatorsSelectedCln!.findIndex((indicator) => {
                        return (
                          indicator.indId === item.indId &&
                          (indicator.deleted === false ||
                            indicator.deleted === undefined)
                        );
                      }) !== -1
                    ) {
                      setIndicatorsSelectedCln(
                        indicatorsSelectedCln!.map((indicator) => {
                          return indicator.indId !== item.indId
                            ? { ...indicator }
                            : { ...indicator, deleted: true };
                        })
                      );
                      switch (true) {
                        case pathname === RouteList.CREATE_REPORT:
                          setPendingDispatches!([
                            ...pendingDispatches!,
                            {
                              type: CreateReportActionType.DESELECT_INDICATOR,
                              payload: {
                                categoryTitle: title,
                                itemName: item.indName,
                              },
                            },
                          ]);
                          break;
                        case pathname === RouteList.DEEP_DIVE:
                          setPendingDispatches!([
                            ...pendingDispatches!,
                            {
                              type: DeepDiveActionType.DESELECT_INDICATOR,
                              payload: { catId: id, item },
                            },
                          ]);
                          break;
                        case pathname === RouteList.COMPARE:
                          setPendingDispatches!([
                            ...pendingDispatches!,
                            {
                              type: CompareActionType.DESELECT_INDICATOR,
                              payload: { indId: item.indId },
                            },
                          ]);
                          break;
                        default:
                          break;
                      }
                    } else {
                      setIndicatorsSelectedCln(
                        indicatorsSelectedCln!.map((indicator) => {
                          return indicator.indId !== item.indId
                            ? { ...indicator }
                            : { ...indicator, deleted: false };
                        })
                      );
                      switch (true) {
                        case pathname === RouteList.CREATE_REPORT:
                          setPendingDispatches!([
                            ...pendingDispatches!,
                            {
                              type: CreateReportActionType.SELECT_INDICATOR,
                              payload: item,
                            },
                          ]);
                          break;
                        case pathname === RouteList.DEEP_DIVE:
                          setPendingDispatches!([
                            ...pendingDispatches!,
                            {
                              type: DeepDiveActionType.SELECT_INDICATOR,
                              payload: { catId: id, item },
                            },
                          ]);
                          break;
                        case pathname === RouteList.COMPARE:
                          handleAddIndicatorCompare(item);
                          break;
                        default:
                          break;
                      }
                    }
                  }}
                />

                <p>{item.indName}</p>
              </div>
            ))
          : null}
      </div>
    </>
  );
};

export default ModalContent;

const Item: FC<{
  item: division;
  dispatch: ({
    type,
    payload,
  }:
    | {
        type: GlobalActionType;
        payload: any;
      }
    | {
        type: CompareActionType;
        payload: any;
      }) => void;
  pathname: string;
  title: string;
  type: "radio" | "checkbox";
  id: number;
  selectedDivisionsc?: {
    parent: { id: number; name: string };
    division: division;
  }[];
  divisionIndex?: { name: string; index: number } | null;
}> = ({
  item,
  title,
  dispatch,
  pathname,
  type,
  id,
  selectedDivisionsc,
  divisionIndex,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  return (
    <div key={item.geoId} className={styles["modal-content-item"]}>
      {type === "radio" ? (
        <Radio
          value={item.geoId}
          onChange={() => {
            dispatch({
              type: GlobalActionType.SELECT_DIVISION,
              payload: {
                parentId: id,
                division: item,
              },
            });
          }}
        />
      ) : (
        <Checkbox
          isChecked={
            pathname !== RouteList.COMPARE
              ? globalState.selectedDivision?.division.id === item.id
              : selectedDivisionsc &&
                selectedDivisionsc.length !== 0 &&
                divisionIndex === undefined
              ? selectedDivisionsc.some((division) => {
                  return division.division.name === item.name;
                })
              : false
          }
          onClick={() => {
            pathname !== RouteList.COMPARE
              ? dispatch!({
                  type: GlobalActionType.SELECT_DIVISION,
                  payload: {
                    parentId: id,
                    division: item,
                  },
                })
              : dispatch!(
                  divisionIndex
                    ? {
                        type: CompareActionType.EDIT_DIVISION,
                        payload: {
                          index: divisionIndex.index,
                          item: {
                            parent: { id, name: title },
                            division: item,
                          },
                        },
                      }
                    : {
                        type: CompareActionType.SELECT_DIVISION,
                        payload: {
                          parent: { id, name: title },
                          division: item,
                        },
                      }
                );
          }}
        />
      )}
      <p>{item.name}</p>
    </div>
  );
};
