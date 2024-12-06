import CloseModalIcon from "assets/icons/CloseModalIcon";
import SearchIcon from "assets/icons/SearchIcon";
import Loader from "components/Loader";
import styles from "components/Modal/styles.module.scss";
import Portal from "components/Portal";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { CompareActionType } from "context/compareContext";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { division } from "models/divisions";
import {
  CSSProperties,
  FC,
  ReactNode,
  UIEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ModalContentDivisions from "./ModalContentDivisions";
import { dispatchGTMEvent } from "utils/tagManager";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import useMediaQuery from "hooks/use-media-query";
import { MediaQueries } from "utils/media-queries";

interface Props {
  modalStyle?: CSSProperties;
  show: boolean;
  loading?: boolean;
  onClose: () => void;
  backdropStyle?: CSSProperties;
  showFilterByAspirationalDistricts: boolean;
  customSearch?: ReactNode;
  customFilter?: ReactNode;
  customButton?: ReactNode;
  filterByAspirationalDistricts?: boolean;
  setFilterByAspirationalDistricts?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  selectedDivision?: string;
  setSearchDivisions?: React.Dispatch<React.SetStateAction<string>>;
  searchDivisions?: string;
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
  btnDisabled?: boolean;
  dispatch: any;
  divisionIndex?: { name: string; index: number } | null;
  handleScroll?: (ev: any) => any;
  loadingInfiniteScroll?: boolean;
}

const ModalDivisions: FC<Props> = ({
  modalStyle,
  show,
  loading,
  onClose,
  divisionIndex,
  backdropStyle,
  dispatch,
  showFilterByAspirationalDistricts,
  filterByAspirationalDistricts,
  selectedDivision,
  setFilterByAspirationalDistricts,
  setSearchDivisions,
  searchDivisions,
  selectedDivisions,
  customSearch,
  customFilter,
  handleScroll,
  loadingInfiniteScroll,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const isTablet = useMediaQuery(MediaQueries.TABLET);
  const isPhone = !(isTablet || isDesktop);

  const { globalState } = useContext(GlobalContext)!;
  const allDivisions = [...globalState.allDivisions].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const { t } = useTranslation();

  const [selectedDivisionCln, setSelectedDivisionCln] = useState<
    string | undefined
  >();

  const [selectedDivisionsCln, setSelectedDivisionsCln] = useState<
    | {
        parent: { id: number; name: string };
        division: division;
      }[]
    | undefined
  >([]);
  const [pendingDispatches, setPendingDispatches] = useState<
    { type: any; payload?: any }[]
  >([]);

  useEffect(() => {
    setSelectedDivisionsCln(selectedDivisions);
  }, [selectedDivisions]);

  useEffect(() => {
    setSelectedDivisionCln(selectedDivision);
  }, [selectedDivision]);

  useEffect(() => {
    if (show) {
      modalRef.current?.classList.add(styles.visible);
    } else {
      modalRef.current?.classList.remove(styles.visible);
    }
  }, [show]);

  const getTitle = () => {
    const keys: { [key in DivisionTypes]: string } = {
      [DivisionTypes.Assembly_Constituencies]: `${t(
        globalState.divisionType
      )} ${t("filter")}`,
      [DivisionTypes.Parlimentary_Constituencies]: `${t(
        globalState.divisionType
      )} ${t("filter")}`,
      [DivisionTypes.District]: `${t("state")}-${t("District")} ${t("filter")}`,
      [DivisionTypes.Village]: `${t("District")}-${t("Village")} ${t(
        "filter"
      )}`,
    };
    return keys[globalState.divisionType];
  };

  const getSubtitle = (t: TFunction) => {
    return globalState.divisionType
      ? t("select") + ` ${t(globalState.divisionType)} ` + t("via_search")
      : t("districts_via_search");
  };

  const applyChanges = () => {
    pendingDispatches.forEach((dispatchObj) => {
      dispatch(dispatchObj);
    });

    if (
      globalState.navigation.feature === "COMPARE" &&
      divisionIndex === undefined
    ) {
      dispatch({
        type: CompareActionType.SELECT_DIVISIONS,
        payload: selectedDivisionsCln,
      });
    }

    onClose();
    setPendingDispatches([]);
  };

  return (
    <Portal>
      <div
        ref={modalRef}
        style={backdropStyle}
        className={`${styles.modal__wrap}`}>
        <div style={modalStyle} className={styles.modal}>
          <header className={styles.header}>
            <div className={styles.headerTitle}>
              <div>
                <Text
                  color="#A51C30"
                  weight={400}
                  size="18px"
                  lineHeight="24px">
                  {getTitle()}
                </Text>
                <Text
                  color="#575A5C"
                  weight={400}
                  size="12px"
                  lineHeight="17px">
                  {getSubtitle(t)}
                </Text>
              </div>
              <CloseModalIcon
                onClick={() => {
                  onClose();
                  dispatchGTMEvent({
                    event: "region_select_cancel",
                  });
                  setSelectedDivisionsCln(selectedDivisions);
                  setPendingDispatches([]);
                  setSelectedDivisionCln(selectedDivision);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
            {customSearch ?? (
              <div className={styles.search}>
                {showFilterByAspirationalDistricts && (
                  <div className={styles.filterByAspirationalDistricts}>
                    <Text
                      weight={400}
                      color="#575A5C"
                      size="12px"
                      lineHeight="17px">
                      {t("filter_aspirational")}
                    </Text>
                    <ToogleSwitch
                      value={filterByAspirationalDistricts!}
                      customSetter={setFilterByAspirationalDistricts}
                    />
                  </div>
                )}

                <div className={styles.searchContainerDivisions}>
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder={t("search")}
                    value={searchDivisions}
                    onChange={(ev) => {
                      setSearchDivisions!(ev.target.value);
                    }}
                  />
                </div>
              </div>
            )}
            {customFilter ?? (
              <div className={styles.filter}>
                <Text
                  color="#A51C30"
                  weight={400}
                  size="16px"
                  lineHeight="24px">
                  {globalState.navigation.feature !== "COMPARE" ||
                  selectedDivision
                    ? selectedDivisionCln
                    : selectedDivisionsCln && selectedDivisionsCln.length > 1
                    ? `${selectedDivisionsCln.length} ${t(
                        `${globalState.divisionType}`
                      )} ${t("selected")}`
                    : selectedDivisionsCln && selectedDivisionsCln!.length === 1
                    ? selectedDivisionsCln![0]?.division.name
                    : ""}
                </Text>
                <div className={styles.wrapper}>
                  {globalState.navigation.feature === "COMPARE" ? (
                    <>
                      {divisionIndex === undefined ? (
                        <Text
                          size="16px"
                          lineHeight="10.5px"
                          style={{ marginRight: "5px" }}>
                          <span className={styles.bold}>
                            {selectedDivisionsCln
                              ? selectedDivisionsCln.length
                              : 0}
                          </span>{" "}
                          / 4
                        </Text>
                      ) : null}
                    </>
                  ) : null}
                  <CloseModalIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (globalState.navigation.feature !== "COMPARE") {
                        setSelectedDivisionCln(undefined);
                      } else if (divisionIndex !== undefined) {
                        setSelectedDivisionCln(undefined);
                      } else {
                        setSelectedDivisionsCln([]);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </header>
          <div
            onScroll={handleScroll as unknown as UIEventHandler<HTMLDivElement>}
            className={styles.modalCustom}
            style={{
              height: `${
                showFilterByAspirationalDistricts || isPhone
                  ? "calc(100% - 308px)"
                  : "calc(100% - 272px)"
              }`,
            }}>
            {globalState.allDivisions
              ? allDivisions.map((division) => {
                  return (
                    <ModalContentDivisions
                      key={division.geoId}
                      title={division.name}
                      id={division.id}
                      search={searchDivisions!}
                      filterByAspirationalDistricts={
                        filterByAspirationalDistricts
                      }
                      setSelectedDivision={setSelectedDivisionCln}
                      selectedDivision={selectedDivisionCln}
                      items={division.subregions}
                      setSelectedDivisions={setSelectedDivisionsCln}
                      selectedDivisions={selectedDivisionsCln}
                      divisionIndex={divisionIndex}
                      setPendingDispatches={setPendingDispatches}
                    />
                  );
                })
              : null}
            {loadingInfiniteScroll ? (
              <div
                style={{
                  width: "100%",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}>
                <Loader
                  customStyle={{ size: 20, thickness: 2.5, color: "#383838" }}
                />
              </div>
            ) : null}
          </div>
          <footer className={styles.footer}>
            <button
              id="modal-divisions-button"
              className={`${loading ? styles.loading : null}`}
              disabled={
                (globalState.navigation.feature !== "COMPARE" &&
                  !selectedDivisionCln) ||
                (globalState.navigation.feature === "COMPARE" &&
                  selectedDivisionsCln?.length === 0 &&
                  divisionIndex === undefined)
              }
              onClick={applyChanges}>
              {loading && <Loader />}
              {loading ? "Applying" : t("apply")}
            </button>
          </footer>
        </div>
      </div>
    </Portal>
  );
};

export default ModalDivisions;
