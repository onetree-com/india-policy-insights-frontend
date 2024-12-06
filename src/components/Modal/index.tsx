import CloseModalIcon from "assets/icons/CloseModalIcon";
import SearchIcon from "assets/icons/SearchIcon";
import Loader from "components/Loader";
import styles from "components/Modal/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { division } from "models/divisions";
import { indicator, indicatorCategory } from "models/indicator";
import {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { calculateSelectedIndicatorCount, calculateSelectedIndicatorN } from "utils/calculateSelectedIndicatorN";
import { DeepDiveActionType } from "../../context/deepDiveContext/index";
import { RouteList } from "../../models/routes";
import ModalContent from "./ModalContent";

interface CommonProps {
  modalStyle?: CSSProperties;
  show: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  backdropStyle?: CSSProperties;
  title: string;
  subtitle: string;
  showFilterByAspirationalDistricts?: boolean;
  loading?: boolean;
  customSearch?: ReactNode;
  customFilter?: ReactNode;
  customButton?: ReactNode;
}
type ConditionalProps =
  | {
      seeSelectedIndicators?: boolean;
      allIndicators: indicatorCategory[];
      selectedIndicators?: indicatorCategory[];
      children?: never;
      setSearchDivisions?: never;
      selectedDivisions?: {
        parent: { id: number; name: string };
        division: division;
      }[];
      searchDivisions?: never;
      filterByAspirationalDistricts?: never;
      setFilterByAspirationalDistricts?: never;
      selectedDivision?: never;
      btnDisabled?: never;
      selectedIndicatorsFlat?: indicator[];
      dispatch: any;
    }
  | {
      children?: ReactNode;
      filterByAspirationalDistricts?: boolean;
      setFilterByAspirationalDistricts?: React.Dispatch<
        React.SetStateAction<boolean>
      >;
      selectedDivision?: string;
      setSearchDivisions?: React.Dispatch<React.SetStateAction<string>>;
      searchDivisions?: string;
      selectedDivisions?: never;
      btnDisabled?: boolean;
      seeSelectedIndicators?: never;
      allIndicators?: never;
      selectedIndicators?: never;
      selectedIndicatorsFlat?: never;
      dispatch?: never;
    };
type Props = CommonProps & ConditionalProps;
const Modal: FC<Props> = ({
  loading,
  modalStyle,
  children,
  show,
  onClose,
  onSubmit,
  backdropStyle,
  title,
  subtitle,
  showFilterByAspirationalDistricts,
  filterByAspirationalDistricts,
  seeSelectedIndicators,
  allIndicators,
  selectedIndicators,
  dispatch,
  selectedDivision,
  btnDisabled,
  setFilterByAspirationalDistricts,
  setSearchDivisions,
  searchDivisions,
  selectedIndicatorsFlat,
  selectedDivisions,
  customSearch,
  customFilter,
  customButton,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (show) {
      modalRef.current?.classList.add(styles.visible);
    } else {
      modalRef.current?.classList.remove(styles.visible);
    }
  }, [show]);
  const [seeSelectedIndicatorsActive, setSeeSelectedIndicatorsActive] =
    useState<boolean>(false);
  const [searchIndicators, setSearchIndicators] = useState<string>("");
  const [filteredIndicators, setFilteredIndicators] = useState<
    indicatorCategory[] | any
  >([]);
  const [pendingDispatches, setPendingDispatches] = useState<
    { type: any; payload?: any }[]
  >([]);
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        seeSelectedIndicatorsActive &&
        selectedIndicators &&
        searchIndicators !== ""
      ) {
        setFilteredIndicators(
          selectedIndicators.map((item) => {
            return {
              ...item,
              indicators: item.indicators.filter((indicator) => {
                return (
                  indicator.indName?.match(
                    new RegExp(searchIndicators, "gi")
                  ) !== null
                );
              }),
            };
          })
        );
      } else if (allIndicators) {
        setFilteredIndicators(
          allIndicators.map((item) => {
            return {
              ...item,
              indicators: item.indicators.filter((indicator) => {
                return (
                  indicator.indName?.match(
                    new RegExp(searchIndicators, "gi")
                  ) !== null
                );
              }),
            };
          })
        );
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    searchIndicators,
    seeSelectedIndicatorsActive,
    selectedIndicators,
    allIndicators,
  ]);

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
                setPendingDispatches([]);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
          {customSearch ?? (
            <div
              className={styles.search}
              style={{
                padding: showFilterByAspirationalDistricts ? "0px" : "11px",
              }}>
              {showFilterByAspirationalDistricts && (
                <div className={styles.filterByAspirationalDistricts}>
                  <Text
                    weight={400}
                    color="#575A5C"
                    size="12px"
                    lineHeight="17px">
                    Filter by Aspirational Districts
                  </Text>
                  <ToogleSwitch
                    value={filterByAspirationalDistricts!}
                    customSetter={setFilterByAspirationalDistricts}
                  />
                </div>
              )}

              <div
                style={{
                  padding: !showFilterByAspirationalDistricts
                    ? "0px"
                    : " 0 11px 11px 11px",
                  marginLeft: !showFilterByAspirationalDistricts
                    ? "0px"
                    : " 11px",
                }}
                className={styles.searchContainer}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search"
                  value={
                    (selectedIndicators || selectedIndicatorsFlat) &&
                    !selectedDivision
                      ? searchIndicators
                      : searchDivisions
                  }
                  onChange={(ev) => {
                    (selectedIndicators || selectedIndicatorsFlat) &&
                    !selectedDivision
                      ? setSearchIndicators(ev.target.value)
                      : setSearchDivisions!(ev.target.value);
                  }}
                />
              </div>
            </div>
          )}
          {customFilter ?? (
            <div className={styles.filter}>
              <Text color="#A51C30" weight={400} size="16px" lineHeight="24px">
                {selectedIndicators && !selectedDivision
                  ? calculateSelectedIndicatorN(
                      selectedIndicators,
                      allIndicators
                    )
                  : selectedDivision}
              </Text>
              <CloseModalIcon
                onClick={() => {
                  if (allIndicators) {
                    switch (true) {
                      case pathname === RouteList.DEEP_DIVE:
                        setPendingDispatches([
                          ...pendingDispatches,
                          {
                            type: DeepDiveActionType.DESELECT_ALL_INDICATORS,
                          },
                        ]);
                        break;

                      default:
                        break;
                    }
                  }
                }}
              />
            </div>
          )}
          {seeSelectedIndicators && (
            <div className={styles.seeSelectedIndicators}>
              <Text color="#575A5C" size="12px" style={{ marginTop: "6px" }}>
                Total selected: {
    calculateSelectedIndicatorCount(selectedIndicators ?? [],
      allIndicators)}
              </Text>
              <ToogleSwitch
                value={seeSelectedIndicatorsActive}
                customSetter={setSeeSelectedIndicatorsActive}
              />
            </div>
          )}
        </header>
        <div
          className={styles.modalCustom}
          style={{
            height: `${
              seeSelectedIndicators && !showFilterByAspirationalDistricts
                ? "calc(100% - 333px)"
                : showFilterByAspirationalDistricts
                ? "calc(100% - 308px)"
                : "calc(100% - 292px)"
            }`,
          }}>
          {seeSelectedIndicators ? (
            seeSelectedIndicatorsActive ? (
              <>
                {selectedIndicators &&
                searchIndicators === "" &&
                !selectedIndicatorsFlat ? (
                  selectedIndicators!.map((category: indicatorCategory) => {
                    return category.indicators.length !== 0 ? (
                      <ModalContent
                        id={category.catId}
                        key={category.catName}
                        type="checkbox"
                        title={category.catName}
                        allIndicators={category.indicators}
                        indicatorsSelected={category.indicators}
                        dispatch={dispatch}
                      />
                    ) : null;
                  })
                ) : filteredIndicators && !selectedIndicatorsFlat ? (
                  filteredIndicators.map(
                    (category: indicatorCategory, categoryIndex: number) => {
                      return category.indicators.length !== 0 ? (
                        <ModalContent
                          id={category.catId}
                          key={category.catName}
                          type="checkbox"
                          title={category.catName}
                          allIndicators={category.indicators}
                          indicatorsSelected={
                            selectedIndicators![categoryIndex].indicators
                              .length !== 0
                              ? selectedIndicators![categoryIndex].indicators
                              : []
                          }
                          dispatch={dispatch}
                        />
                      ) : null;
                    }
                  )
                ) : (
                  <ModalContent
                    type="checkbox"
                    title=""
                    allIndicators={selectedIndicatorsFlat!}
                    selectedDivisions={selectedDivisions}
                    indicatorsSelected={selectedIndicatorsFlat}
                    dispatch={dispatch}
                  />
                )}
              </>
            ) : (
              <>
                {allIndicators &&
                searchIndicators === "" &&
                !selectedIndicatorsFlat
                  ? allIndicators!.map(
                      (category: indicatorCategory, categoryIndex: number) => {
                        return (
                          <ModalContent
                            id={category.catId}
                            key={category.catName}
                            type="checkbox"
                            title={category.catName}
                            allIndicators={category.indicators}
                            indicatorsSelected={
                              selectedIndicators![categoryIndex] &&
                              Object.values(selectedIndicators![categoryIndex])
                                .length !== 0
                                ? selectedIndicators![categoryIndex].indicators
                                : []
                            }
                            pendingDispatches={pendingDispatches}
                            setPendingDispatches={setPendingDispatches}
                            dispatch={dispatch}
                          />
                        );
                      }
                    )
                  : filteredIndicators && !selectedIndicatorsFlat
                  ? filteredIndicators.map(
                      (category: indicatorCategory, categoryIndex: number) => {
                        return category.indicators.length !== 0 ? (
                          <ModalContent
                            id={category.catId}
                            key={category.catName}
                            type="checkbox"
                            title={category.catName}
                            allIndicators={category.indicators}
                            indicatorsSelected={
                              selectedIndicators![categoryIndex].indicators
                            }
                            dispatch={dispatch}
                          />
                        ) : null;
                      }
                    )
                  : allIndicators!.map((category) => {
                      return (
                        <ModalContent
                          id={category.catId}
                          key={category.catId}
                          type="checkbox"
                          title={category.catName}
                          selectedDivisions={selectedDivisions}
                          allIndicators={category.indicators}
                          indicatorsSelected={selectedIndicatorsFlat}
                          dispatch={dispatch}
                        />
                      );
                    })}
              </>
            )
          ) : (
            children
          )}
        </div>
        <footer className={styles.footer}>
          <button
            id="modal-button"
            className={`${loading ? styles.loading : null}`}
            disabled={btnDisabled}
            onClick={() => {
              //! disable clearing all deep dive indicators if there isn't a SELECT_INDICATOR dispatch right after it.
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

export default Modal;
