import CloseModalIcon from "assets/icons/CloseModalIcon";
import SearchIcon from "assets/icons/SearchIcon";
import styles from "components/Modal/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { DeepDiveActionType, DeepDiveContext } from "context/deepDiveContext";
import { indicator, indicatorCategory } from "models/indicator";
import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  calculateSelectedIndicatorCount,
  getSelectedIndicatorNames,
} from "utils/calculateSelectedIndicatorN";
import ModalContentIndicators from "./ModalContentIndicators";
import { dispatchGTMEvent } from "utils/tagManager";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  subtitle: string;
  show: boolean;
  onClose: () => void;
  allIndicators: indicatorCategory[];
  selectedIndicators?: indicatorCategory[];
  dispatch: any;
}
const ModalIndicatorsDeepDive: FC<Props> = ({
  show,
  onClose,
  title,
  subtitle,
  allIndicators,
  selectedIndicators,
  dispatch,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef(null);
  const { t } = useTranslation();
  const { state } = useContext(DeepDiveContext)!;

  const [seeSelectedIndicatorsActive, setSeeSelectedIndicatorsActive] =
    useState<boolean>(false);
  const [searchIndicators, setSearchIndicators] = useState<string>("");

  const [selectedIndicatorsCln, setSelectedIndicatorsCln] = useState(
    selectedIndicators!
  );
  useEffect(() => {
    setSelectedIndicatorsCln(state.selectedIndicators);
  }, [state.selectedIndicators]);
  const [selectedIndicatorsFlatCln, setSelectedIndicatorsFlatCln] = useState<
    any[] | undefined
  >(undefined);
  const [pendingDispatches, setPendingDispatches] = useState<
    { type: any; payload?: any }[]
  >([]);

  useEffect(() => {
    if (show) {
      setSearchIndicators("");
      setSeeSelectedIndicatorsActive(false);
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
    setSelectedIndicatorsFlatCln([]);
    setSelectedIndicatorsCln([]);
    setPendingDispatches([
      ...pendingDispatches,
      {
        type: DeepDiveActionType.DESELECT_ALL_INDICATORS,
      },
    ]);
  };

  return (
    <div ref={modalRef} className={`${styles.modal__wrap}`}>
      <div className={styles.modal}>
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
                dispatchGTMEvent({
                  event: "indicator_select_cancel",
                });
                onClose();
                if (selectedIndicatorsFlatCln) {
                  setSelectedIndicatorsFlatCln(undefined);
                } else {
                  setSelectedIndicatorsCln([...selectedIndicators!]);
                }
                setPendingDispatches([]);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className={styles.search}>
            <div className={styles.searchContainer}>
              <SearchIcon />
              <input
                type="text"
                placeholder={t("search")}
                value={searchIndicators}
                onChange={(ev) => {
                  setSearchIndicators(ev.target.value.toLowerCase());
                }}
              />
            </div>
          </div>

          <div className={styles.filter} ref={filterRef}>
            <Text color="#A51C30" weight={400} size="16px" lineHeight="24px">
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: filterRef.current!
                    ? `${
                        (filterRef.current! as HTMLElement).offsetWidth - 50
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
              <CloseModalIcon
                style={{ cursor: "pointer" }}
                onClick={onCloseModal}
              />
            </div>
          </div>

          <div className={styles.seeSelectedIndicators}>
            <Text color="#575A5C" size="12px" style={{ marginTop: "6px" }}>
              {t("total_selected")}:{" "}
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
                : (!selectedIndicatorsCln || !selectedIndicatorsCln.length) &&
                  selectedIndicatorsFlatCln
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
                        selectedDivisions={undefined}
                        seeSelectedIndicators={seeSelectedIndicatorsActive}
                        allIndicators={category.indicators}
                        indicatorsSelected={selectedIndicatorsFlatCln}
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
                        selectedDivisions={undefined}
                        seeSelectedIndicators={seeSelectedIndicatorsActive}
                        allIndicators={category.indicators}
                        indicatorsSelected={selectedIndicatorsFlatCln}
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
            disabled={
              selectedIndicatorsCln &&
              selectedIndicatorsCln.length === 0 &&
              selectedIndicatorsFlatCln &&
              selectedIndicatorsFlatCln.length === 0
            }
            id="modal-indicators-button"
            onClick={() => {
              if (
                selectedIndicatorsCln &&
                selectedIndicatorsCln.length === 0 &&
                selectedIndicatorsFlatCln &&
                selectedIndicatorsFlatCln.length === 0
              ) {
                dispatch({
                  type: DeepDiveActionType.SELECT_ALL_INDICATORS,
                });
              } else {
                pendingDispatches.forEach((dispatchObj) => {
                  dispatch(dispatchObj);
                });
              }

              onClose();
              setPendingDispatches([]);
              if (selectedIndicatorsFlatCln) {
                setSelectedIndicatorsFlatCln(undefined);
              }
            }}>
            {t("apply")}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalIndicatorsDeepDive;
