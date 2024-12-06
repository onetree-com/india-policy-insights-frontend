import ArrowDropDouble from "assets/icons/ArrowDropDouble";
import ArrowDropDoubleSort from "assets/icons/ArrowDropDoubleSort";
import ArrowPlayRight from "assets/icons/ArrowPlayRight";
import CloseModalIcon from "assets/icons/CloseModalIcon";
import EditIcon from "assets/icons/EditIcon";
import { DataViewBtnContainer } from "components/DataView";
import Indicator from "components/Indicator";
import StateDistrictFilter from "components/StateDistrictFilter";
import Text from "components/Text";
import { CompareActionType, CompareContext } from "context/compareContext";
import { DivisionTypes } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import ActiveContent from "./ActiveContent";
import DisplayValues from "./DisplayValues";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { roundPrevalence } from "utils/roundPrevalences";
import Tooltip from "components/Tooltip";

const TableContent: FC<{
  setShowEditDivision: Dispatch<SetStateAction<boolean>>;
  setDivisionIndex: Dispatch<
    SetStateAction<{
      name: string;
      index: number;
    } | null>
  >;
  divisionType: DivisionTypes;
  isDesktop: boolean;
}> = ({ setShowEditDivision, setDivisionIndex, divisionType, isDesktop }) => {
  const { state, dispatch } = useContext(CompareContext)!;
  const { rankingToCompareInfo } = useGlobalActions();
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{
    ascending: boolean;
    row: number;
  } | null>(null);

  useEffect(() => {
    if (sortConfig !== null) {
      setTimeout(() => {
        dispatch({
          type: CompareActionType.SORT_INDICATORS,
          payload: {
            ...sortConfig,
            ascending: sortConfig?.ascending,
          },
        });
      }, 750);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dataView]);

  const [active, setActive] = useState<number>(-1);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [infoRow, setInfoRow] = useState<
    | {
        show: boolean;
        title: string;
        description: string;
        descriptionHi: string;
      }
    | undefined
  >();
  const [showTooltip, setShowTooltip] = useState<{
    show: boolean;
    index: number;
  } | null>(null);

  return (
    <table className={styles.main} style={{ position: "initial" }}>
      <thead className={styles.header}>
        {!isDesktop ? <tr className={styles.placeholder}></tr> : null}
        {isDesktop ? (
          <tr className={styles.dataView} style={{ marginLeft: 16 }}>
            <Text
              color="#3d4247"
              weight={300}
              lineHeight="11px"
              size="10px"
              style={{ marginBottom: 8 }}>
              {t("data_view")}
            </Text>
            <DataViewBtnContainer
              dataView={state.dataView}
              setDataView={(payload) => {
                dispatch({
                  type: CompareActionType.UPDATE_DATAVIEW,
                  payload,
                });
              }}
              noText
            />
          </tr>
        ) : null}
        {state.selectedDivisions && state.selectedDivisions.length !== 0
          ? state.selectedDivisions.map((item, index) => {
              return (
                <tr
                  key={item.division?.id}
                  className={styles.divisions}
                  style={{
                    justifyContent: `${
                      item.division?.aspirational === true
                        ? "space-between"
                        : ""
                    }`,
                    gap: `${
                      item.division?.aspirational === true ? "" : "15px"
                    }`,
                  }}>
                  {isDesktop ? (
                    <>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CloseModalIcon
                          onClick={() => {
                            dispatch({
                              type: CompareActionType.DESELECT_DIVISION,
                              payload: item.division?.id,
                            });
                            rankingToCompareInfo(undefined);
                          }}
                        />
                        <EditIcon
                          size={22}
                          style={{ marginLeft: "20px" }}
                          onClick={() => {
                            setDivisionIndex({
                              name: item.division?.name,
                              index,
                            });
                            setShowEditDivision(true);
                          }}
                        />
                      </div>
                      <div
                        onMouseEnter={() => {
                          setShowTooltip({ show: true, index });
                        }}
                        onMouseLeave={() => {
                          setShowTooltip({ show: false, index });
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}>
                        <Text size="14px" className={styles.title}>
                          <span
                            className={
                              styles.parent
                            }>{`${item.division?.name}, `}</span>
                          <span className={styles.division}>
                            {item.parent?.name}
                          </span>
                        </Text>
                        <Tooltip
                          top="70px"
                          style={{
                            fontSize: "12px",
                            padding: "7px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "1px solid #e7e7e7",
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.24)",
                          }}
                          show={
                            showTooltip?.show && showTooltip.index === index
                          }
                          arrow={false}
                          label={`${item.division?.name}, ${item.parent?.name}`}
                        />
                        {sortConfig !== null && sortConfig.row === index + 1 ? (
                          <ArrowDropDoubleSort
                            onClick={() => {
                              setSortConfig({
                                ...sortConfig,
                                ascending: !sortConfig?.ascending,
                              });
                              dispatch({
                                type: CompareActionType.SORT_INDICATORS,
                                payload: {
                                  ...sortConfig,
                                  ascending: !sortConfig?.ascending,
                                },
                              });
                            }}
                            ascending={sortConfig?.ascending}
                          />
                        ) : (
                          <ArrowDropDouble
                            onClick={() => {
                              setSortConfig({
                                row: index + 1,
                                ascending: true,
                              });
                              dispatch({
                                type: CompareActionType.SORT_INDICATORS,
                                payload: { row: index + 1, ascending: true },
                              });
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          // justifyContent: "space-between",
                        }}>
                        <Text size="14px" className={styles.title}>
                          <span
                            className={
                              styles.parent
                            }>{`${item.division?.name}, `}</span>
                        </Text>
                        <Text size="10px" className={styles.title}>
                          {item.parent?.name}
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}>
                        <CloseModalIcon
                          onClick={() => {
                            dispatch({
                              type: CompareActionType.DESELECT_DIVISION,
                              payload: item.division?.id,
                            });
                            rankingToCompareInfo(undefined);
                          }}
                        />
                        <EditIcon
                          size={22}
                          style={{ marginRight: "20px" }}
                          onClick={() => {
                            setDivisionIndex({
                              name: item.division?.name,
                              index,
                            });
                            setShowEditDivision(true);
                          }}
                        />
                        {sortConfig !== null && sortConfig.row === index + 1 ? (
                          <ArrowDropDoubleSort
                            onClick={() => {
                              setSortConfig({
                                ...sortConfig,
                                ascending: !sortConfig?.ascending,
                              });
                              dispatch({
                                type: CompareActionType.SORT_INDICATORS,
                                payload: {
                                  ...sortConfig,
                                  ascending: !sortConfig?.ascending,
                                },
                              });
                            }}
                            ascending={sortConfig?.ascending}
                          />
                        ) : (
                          <ArrowDropDouble
                            onClick={() => {
                              setSortConfig({
                                row: index + 1,
                                ascending: true,
                              });
                              dispatch({
                                type: CompareActionType.SORT_INDICATORS,
                                payload: { row: index + 1, ascending: true },
                              });
                            }}
                          />
                        )}
                      </div>
                    </>
                  )}

                  {item.division?.aspirational === true ? (
                    <Text
                      weight={400}
                      size="12px"
                      lineHeight="16.8px"
                      color="#7E7E7E">
                      Aspirational District
                    </Text>
                  ) : null}
                </tr>
              );
            })
          : null}
        {state.selectedDivisions && state.selectedDivisions.length < 4 ? (
          <tr style={{ padding: `10px ${isDesktop ? "24px" : "15px"}` }}>
            <StateDistrictFilter
              dispatch={dispatch}
              selectedDivisions={state.selectedDivisions}
            />
          </tr>
        ) : null}
        {state.selectedDivisions && state.selectedDivisions.length === 0 ? (
          <>
            <tr></tr>
            <tr></tr>
            <tr></tr>
          </>
        ) : state.selectedDivisions && state.selectedDivisions.length === 1 ? (
          <>
            <tr></tr>
            <tr></tr>
          </>
        ) : state.selectedDivisions && state.selectedDivisions.length === 2 ? (
          <tr></tr>
        ) : null}
      </thead>

      <tbody>
        {state.selectedIndicators
          ? state.selectedIndicators.map((indicator, index) => {
              return (
                <tr
                  style={{
                    position: `${isDesktop ? "static" : "initial"}`,
                    borderRadius: "4px",
                    overflow: "visible",
                    border:
                      active === index
                        ? "1px solid #575A5C"
                        : "1px solid transparent",
                  }}
                  key={indicator.indId}
                  onClick={() => {
                    setActive(active === index ? -1 : index);
                    setShowPopup(false);
                  }}>
                  <th
                    style={
                      !isDesktop
                        ? {
                            backgroundColor: `${
                              index % 2 === 0 ? "#f5f4f4" : "#eee"
                            }`,
                            borderRadius: "4px",
                            border:
                              active === index
                                ? "1px solid #575A5C"
                                : "1px solid transparent",
                            borderRight: "none",
                            minWidth: "118px",
                          }
                        : {}
                    }
                    className={styles.indicatorTitle}>
                    {isDesktop ? (
                      <ActiveContent
                        index={index}
                        indId={indicator.indId!}
                        indName={indicator.indName!}
                        description={indicator.indDescription}
                        descriptionHi={indicator.indDescriptionHi}
                        setShowPopup={setShowPopup}
                        showPopup={showPopup}
                        setActive={setActive}
                        active={active}
                        isDesktop={isDesktop}
                        setInfoRow={setInfoRow}
                        infoRow={infoRow}
                      />
                    ) : null}

                    <section
                      style={
                        isDesktop
                          ? {
                              marginLeft: `${
                                active === index ? "7px" : "31px"
                              }`,
                            }
                          : {}
                      }>
                      <Text weight={400} size="14px" lineHeight="16px">
                        {indicator.indName}
                      </Text>
                      <section className={styles.indPercentage}>
                        <ArrowPlayRight />
                        <Text weight={300} size="15px" lineHeight="10.5px">
                          {indicator.allIndia
                            ? `${roundPrevalence(indicator.allIndia)}%`
                            : "no data"}
                        </Text>
                      </section>
                    </section>
                  </th>

                  {!isDesktop ? (
                    <ActiveContent
                      index={index}
                      indId={indicator.indId!}
                      indName={indicator.indName!}
                      description={indicator.indDescription}
                      descriptionHi={indicator.indDescriptionHi}
                      setShowPopup={setShowPopup}
                      showPopup={showPopup}
                      setActive={setActive}
                      active={active}
                      isDesktop={isDesktop}
                      setInfoRow={setInfoRow}
                      infoRow={infoRow}
                    />
                  ) : null}

                  <th className={styles.indicatorValue}>
                    {indicator.row1 !== undefined ? (
                      <DisplayValues
                        lowerValue={indicator.row1.lowerValue}
                        higherValue={indicator.row1.higherValue}
                        prevalence={indicator.row1.prevalence}
                        prevalenceEnd={indicator.row1.prevalenceEnd}
                        stateValue={indicator.row1.stateValue}
                        color={indicator.row1.color}
                        indReadingStrategy={indicator.indReadingStrategy!}
                        isDesktop={isDesktop}
                      />
                    ) : null}
                  </th>

                  <th className={styles.indicatorValue}>
                    {indicator.row2 !== undefined ? (
                      <DisplayValues
                        lowerValue={indicator.row2.lowerValue}
                        higherValue={indicator.row2.higherValue}
                        prevalence={indicator.row2.prevalence}
                        prevalenceEnd={indicator.row2.prevalenceEnd}
                        stateValue={indicator.row2.stateValue}
                        color={indicator.row2.color}
                        indReadingStrategy={indicator.indReadingStrategy!}
                        isDesktop={isDesktop}
                      />
                    ) : null}
                  </th>
                  <th className={styles.indicatorValue}>
                    {indicator.row3 !== undefined ? (
                      <DisplayValues
                        lowerValue={indicator.row3.lowerValue}
                        higherValue={indicator.row3.higherValue}
                        prevalence={indicator.row3.prevalence}
                        prevalenceEnd={indicator.row3.prevalenceEnd}
                        stateValue={indicator.row3.stateValue}
                        color={indicator.row3.color}
                        indReadingStrategy={indicator.indReadingStrategy!}
                        isDesktop={isDesktop}
                      />
                    ) : null}
                  </th>
                  <th className={styles.indicatorValue}>
                    {indicator.row4 !== undefined ? (
                      <DisplayValues
                        lowerValue={indicator.row4.lowerValue}
                        higherValue={indicator.row4.higherValue}
                        prevalence={indicator.row4.prevalence}
                        prevalenceEnd={indicator.row4.prevalenceEnd}
                        stateValue={indicator.row4.stateValue}
                        color={indicator.row4.color}
                        indReadingStrategy={indicator.indReadingStrategy!}
                        isDesktop={isDesktop}
                      />
                    ) : null}
                  </th>
                </tr>
              );
            })
          : null}

        <tr className={styles.indicatorSelectorRow}>
          <th className={styles.indicatorSelector}>
            <Indicator
              allIndicators={state.allIndicators}
              selectedDivisions={state.selectedDivisions}
              selectedIndicatorsFlat={state.selectedIndicators}
              dispatch={dispatch}
              stylesCompare={{
                width: "70%",
                height: "72%",
              }}
            />
          </th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </tbody>
    </table>
  );
};

export default TableContent;
