import CloseModalIcon from "assets/icons/CloseModalIcon";
import SearchIcon from "assets/icons/SearchIcon";
import Loader from "components/Loader";
import styles from "components/Modal/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { CompareActionType } from "context/compareContext";
import { CreateReportActionType } from "context/createReportContext";
import { DeepDiveActionType } from "context/deepDiveContext";
import { GlobalContext } from "context/globalContext";
import { division } from "models/divisions";
import { indicator, indicatorCategory } from "models/indicator";
import {
  CSSProperties,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  calculateSelectedIndicatorCount,
  getSelectedIndicatorNames,
} from "utils/calculateSelectedIndicatorN";
import ModalContentIndicators from "./ModalContentIndicators";

interface Props {
  modalStyle?: CSSProperties;
  show: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  backdropStyle?: CSSProperties;
  title: string;
  subtitle: string;
  loading?: boolean;
  customSearch?: ReactNode;
  customFilter?: ReactNode;
  seeSelectedIndicators?: boolean;
  allIndicators: indicatorCategory[];
  selectedIndicators?: indicatorCategory[];
  btnDisabled?: never;
  selectedIndicatorsFlat?: indicator[];
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
  dispatch: any;
}
const ModalIndicators: FC<Props> = ({
  loading,
  modalStyle,
  show,
  onClose,
  backdropStyle,
  title,
  subtitle,
  allIndicators,
  selectedIndicators,
  dispatch,
  btnDisabled,
  selectedIndicatorsFlat,
  selectedDivisions,
  customSearch,
  customFilter,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { globalState } = useContext(GlobalContext)!;
  const filterRef = useRef(null);

  const [seeSelectedIndicatorsActive, setSeeSelectedIndicatorsActive] =
    useState<boolean>(false);
  const [searchIndicators, setSearchIndicators] = useState<string>("");

  const [selectedIndicatorsCln, setSelectedIndicatorsCln] = useState(
    selectedIndicators!
  );
  const [selectedIndicatorsFlatCln, setSelectedIndicatorsFlatCln] = useState(
    selectedIndicatorsFlat
  );
  const [pendingDispatches, setPendingDispatches] = useState<
    { type: any; payload?: any }[]
  >([]);

  useEffect(() => {
    if (show) {
      setSearchIndicators("");
      modalRef.current?.classList.add(styles.visible);
    } else {
      modalRef.current?.classList.remove(styles.visible);
    }
  }, [show]);

  const hydrateIndicators = (categoryIndex: number) => {
    setSelectedIndicatorsCln!(selectedIndicators!);
    return selectedIndicatorsCln[categoryIndex]?.indicators;
  };

  const onCloseModal = () => {
    switch (globalState.navigation.feature) {
      case "DEEP_DIVE":
        setSelectedIndicatorsFlatCln([]);
        setSelectedIndicatorsCln([]);
        setPendingDispatches([
          ...pendingDispatches,
          {
            type: DeepDiveActionType.DESELECT_ALL_INDICATORS,
          },
        ]);
        break;
      case "COMPARE":
        setSelectedIndicatorsFlatCln([]);
        setSelectedIndicatorsCln([]);
        setPendingDispatches([
          ...pendingDispatches,
          {
            type: CompareActionType.DESELECT_ALL_INDICATORS,
          },
        ]);
        break;
      case "CREATE_REPORT":
        setSelectedIndicatorsFlatCln([]);
        setSelectedIndicatorsCln([]);
        setPendingDispatches([
          ...pendingDispatches,
          {
            type: CreateReportActionType.DESELECT_ALL_INDICATORS,
          },
        ]);
        break;
      default:
        break;
    }
  };
  return (
    <div
      ref={modalRef}
      style={backdropStyle}
      className={`${styles.modal__wrap}`}>
      <div style={modalStyle} className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <div>
              <Text color="#A51C30" weight={400} size="18px" lineHeight="24px">
                {title}
              </Text>
              <Text color="#575A5C" weight={400} size="12px" lineHeight="17px">
                {subtitle}
              </Text>
            </div>
            <CloseModalIcon
              onClick={() => {
                onClose();
                if (selectedIndicatorsFlat) {
                  setSelectedIndicatorsFlatCln(selectedIndicatorsFlat);
                } else {
                  setSelectedIndicatorsCln([...selectedIndicators!]);
                }
                setPendingDispatches([]);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
          {customSearch ?? (
            <div className={styles.search}>
              <div className={styles.searchContainer}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchIndicators}
                  onChange={(ev) => {
                    setSearchIndicators(ev.target.value);
                  }}
                />
              </div>
            </div>
          )}
          {customFilter ?? (
            <div className={styles.filter} ref={filterRef}>
              <Text color="#A51C30" weight={400} size="16px" lineHeight="24px">
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: filterRef.current!
                      ? `${
                          (filterRef.current! as HTMLElement).offsetWidth - 100
                        }px`
                      : "200px",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}>
                  {getSelectedIndicatorNames(
                    selectedIndicatorsCln ?? [],
                    selectedIndicatorsFlatCln || []
                  )}
                </div>
              </Text>

              <div className={styles.wrapper}>
                {globalState.navigation.feature === "CREATE_REPORT" ? (
                  <Text
                    size="16px"
                    lineHeight="10.5px"
                    style={{ marginRight: "5px" }}>
                    <span className={styles.bold}>
                      {selectedIndicatorsFlatCln
                        ? selectedIndicatorsFlatCln.length
                        : 0}
                    </span>{" "}
                    / 25
                  </Text>
                ) : null}

                <CloseModalIcon
                  style={{ cursor: "pointer" }}
                  onClick={onCloseModal}
                />
              </div>
            </div>
          )}
          <div className={styles.seeSelectedIndicators}>
            <Text color="#575A5C" size="12px" style={{ marginTop: "6px" }}>
              Total selected:{" "}
              {selectedIndicatorsCln && !selectedIndicatorsFlatCln
                ? calculateSelectedIndicatorCount(
                    selectedIndicatorsCln ?? selectedIndicators,
                    allIndicators
                  )
                : selectedIndicatorsFlatCln?.length}
            </Text>
            <ToogleSwitch
              value={seeSelectedIndicatorsActive}
              customSetter={setSeeSelectedIndicatorsActive}
            />
          </div>
        </header>
        <div className={styles.modalCustom}>
          {seeSelectedIndicatorsActive ? (
            <>
              {selectedIndicatorsCln && !selectedIndicatorsFlatCln
                ? selectedIndicatorsCln!.map(
                    (category: indicatorCategory, index) => {
                      return category.indicators.some((indicator) => {
                        return (
                          indicator.deleted === false ||
                          indicator.deleted === undefined
                        );
                      }) ? (
                        <ModalContentIndicators
                          search={searchIndicators}
                          id={category.catId}
                          key={category.catName}
                          type="checkbox"
                          title={category.catName}
                          seeSelectedIndicators={seeSelectedIndicatorsActive}
                          allIndicators={
                            category.indicators ??
                            selectedIndicators![index].indicators
                          }
                          pendingDispatches={pendingDispatches}
                          setPendingDispatches={setPendingDispatches}
                          indicatorsSelected={
                            category.indicators ??
                            selectedIndicators![index].indicators
                          }
                          setIndicatorsSelected={(
                            deleted: boolean,
                            indicator: indicator
                          ) => {
                            setSelectedIndicatorsCln(
                              selectedIndicatorsCln.map((value) => {
                                if (value.catId !== category.catId) {
                                  return value;
                                } else {
                                  return {
                                    ...value,
                                    indicators: value.indicators.map((item) => {
                                      return item.indId === indicator.indId
                                        ? { ...item, deleted }
                                        : { ...item };
                                    }),
                                  };
                                }
                              })
                            );
                          }}
                        />
                      ) : null;
                    }
                  )
                : !selectedIndicatorsCln && selectedIndicatorsFlatCln
                ? allIndicators!.map((category) => {
                    return selectedIndicatorsFlatCln.some((indicator) => {
                      return indicator.catId === category.catId;
                    }) ? (
                      <ModalContentIndicators
                        search={searchIndicators}
                        id={category.catId}
                        key={category.catId}
                        type="checkbox"
                        title={category.catName}
                        selectedDivisions={selectedDivisions}
                        seeSelectedIndicators={seeSelectedIndicatorsActive}
                        allIndicators={category.indicators}
                        indicatorsSelected={
                          selectedIndicatorsFlatCln ?? selectedIndicatorsFlat
                        }
                        setIndicatorsSelected={(
                          deleted: boolean,
                          indicator: indicator
                        ) => {
                          if (deleted) {
                            setSelectedIndicatorsFlatCln([
                              ...selectedIndicatorsFlatCln!.filter((value) => {
                                return value.indId !== indicator.indId;
                              }),
                            ]);
                          } else {
                            setSelectedIndicatorsFlatCln([
                              ...selectedIndicatorsFlatCln!,
                              { ...indicator },
                            ]);
                          }
                        }}
                        pendingDispatches={pendingDispatches}
                        setPendingDispatches={setPendingDispatches}
                      />
                    ) : null;
                  })
                : null}
            </>
          ) : (
            <>
              {allIndicators && !selectedIndicatorsFlatCln
                ? allIndicators!.map(
                    (category: indicatorCategory, categoryIndex: number) => {
                      return (
                        <ModalContentIndicators
                          search={searchIndicators}
                          id={category.catId}
                          key={category.catName}
                          type="checkbox"
                          title={category.catName}
                          seeSelectedIndicators={seeSelectedIndicatorsActive}
                          allIndicators={category.indicators}
                          indicatorsSelected={
                            selectedIndicatorsCln![categoryIndex] &&
                            Object.values(selectedIndicatorsCln![categoryIndex])
                              .length !== 0
                              ? selectedIndicatorsCln![categoryIndex].indicators
                              : hydrateIndicators(categoryIndex)
                          }
                          setIndicatorsSelected={(
                            deleted: boolean,
                            indicator: indicator
                          ) => {
                            setSelectedIndicatorsCln(
                              selectedIndicatorsCln.map((value) => {
                                if (value.catId !== category.catId) {
                                  return value;
                                } else {
                                  return {
                                    ...value,
                                    indicators: value.indicators.map((item) => {
                                      return item.indId === indicator.indId
                                        ? { ...item, deleted }
                                        : { ...item };
                                    }),
                                  };
                                }
                              })
                            );
                          }}
                          pendingDispatches={pendingDispatches}
                          setPendingDispatches={setPendingDispatches}
                        />
                      );
                    }
                  )
                : allIndicators!.map((category) => {
                    return (
                      <ModalContentIndicators
                        search={searchIndicators}
                        id={category.catId}
                        key={category.catId}
                        type="checkbox"
                        title={category.catName}
                        selectedDivisions={selectedDivisions}
                        seeSelectedIndicators={seeSelectedIndicatorsActive}
                        allIndicators={category.indicators}
                        indicatorsSelected={
                          selectedIndicatorsFlatCln ?? selectedIndicatorsFlat
                        }
                        setIndicatorsSelected={(
                          deleted: boolean,
                          indicator: indicator
                        ) => {
                          if (deleted) {
                            setSelectedIndicatorsFlatCln([
                              ...selectedIndicatorsFlatCln!.filter((value) => {
                                return value.indId !== indicator.indId;
                              }),
                            ]);
                          } else {
                            setSelectedIndicatorsFlatCln([
                              ...selectedIndicatorsFlatCln!,
                              { ...indicator },
                            ]);
                          }
                        }}
                        pendingDispatches={pendingDispatches}
                        setPendingDispatches={setPendingDispatches}
                      />
                    );
                  })}
            </>
          )}
        </div>
        <footer className={styles.footer}>
          <button
            id="modal-indicators-button"
            className={`${loading ? styles.loading : null}`}
            disabled={btnDisabled}
            onClick={() => {
              pendingDispatches.forEach((dispatchObj) => {
                dispatch(dispatchObj);
              });
              onClose();
              setPendingDispatches([]);
            }}>
            {loading && <Loader />}
            {loading ? "Applying" : "Apply"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalIndicators;
