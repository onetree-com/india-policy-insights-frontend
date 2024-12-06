import CloseModalIcon from "assets/icons/CloseModalIcon";
import SearchIcon from "assets/icons/SearchIcon";
import Loader from "components/Loader";
import styles from "components/Modal/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { CompareActionType } from "context/compareContext";
import useUrlParams from "hooks/use-url-params";
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
import ModalContentIndicatorsCompare from "./ModalContentIndicatorsCompare";
import {
  calculateSelectedIndicatorCount,
  getSelectedIndicatorNames,
} from "utils/calculateSelectedIndicatorN";
import { dispatchGTMEvent } from "utils/tagManager";
import { useTranslation } from "react-i18next";

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
  selectedIndicatorsFlat?: indicator[];
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
  dispatch: any;
}
const ModalIndicatorsCompare: FC<Props> = ({
  loading,
  modalStyle,
  show,
  onClose,
  backdropStyle,
  title,
  subtitle,
  allIndicators,
  dispatch,
  selectedIndicatorsFlat,
  selectedDivisions,
  customSearch,
  customFilter,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef(null);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const { t } = useTranslation();

  const [seeSelectedIndicatorsActive, setSeeSelectedIndicatorsActive] =
    useState<boolean>(false);
  const [searchIndicators, setSearchIndicators] = useState<string>("");
  const { searchParams } = useUrlParams();

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

  const onCloseModal = () => {
    setSelectedIndicatorsFlatCln([]);
    setPendingDispatches([
      ...pendingDispatches,
      {
        type: CompareActionType.DESELECT_ALL_INDICATORS,
      },
    ]);
  };

  useEffect(() => {
    if (selectedIndicatorsFlat)
      setSelectedIndicatorsFlatCln(selectedIndicatorsFlat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndicatorsFlat]);

  useEffect(() => {
    if (searchParams?.indIds) {
      const indIds = (searchParams.indIds as string).split(",").map((x) => +x);
      const result: indicator[] = [];
      allIndicators.forEach((item) => {
        item.indicators.forEach((indicator) => {
          if (indIds.includes(indicator.indId as number)) {
            result.push(indicator);
          }
        });
      });
      setSelectedIndicatorsFlatCln(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.indIds]);

  return (
    <div
      ref={modalRef}
      style={{
        ...backdropStyle,
        fontWeight: "normal",
      }}
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
                dispatchGTMEvent({
                  event: "indicator_select_cancel",
                });
                onClose();
                if (selectedIndicatorsFlat) {
                  setSelectedIndicatorsFlatCln(selectedIndicatorsFlat);
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
                  placeholder={t("search")}
                  value={searchIndicators}
                  onChange={(ev) => {
                    setSearchIndicators(ev.target.value.toLowerCase());
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
                          (filterRef.current! as HTMLElement).offsetWidth - 50
                        }px`
                      : "200px",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}>
                  {getSelectedIndicatorNames([], selectedIndicatorsFlatCln)}
                </div>
              </Text>
              <div className={styles.wrapper}>
                <CloseModalIcon
                  style={{ cursor: "pointer" }}
                  onClick={onCloseModal}
                />
              </div>
            </div>
          )}
          <div className={styles.seeSelectedIndicators}>
            <Text color="#575A5C" size="12px" style={{ marginTop: "6px" }}>
              {t("total_selected")}:{" "}
              {seeSelectedIndicatorsActive && !selectedIndicatorsFlatCln
                ? calculateSelectedIndicatorCount(
                    selectedIndicatorsFlatCln,
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
          {allIndicators!.map((category) => {
            return (
              <ModalContentIndicatorsCompare
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
                btnDisabled={btnDisabled}
                setBtnDisabled={setBtnDisabled}
              />
            );
          })}
        </div>
        <footer className={styles.footer}>
          <button
            id="modal-indicators-button-compare"
            className={`${loading ? styles.loading : null}`}
            disabled={
              btnDisabled ||
              (selectedIndicatorsFlatCln &&
                selectedIndicatorsFlatCln.length === 0)
            }
            onClick={() => {
              pendingDispatches.forEach((dispatchObj) => {
                dispatch(dispatchObj);
              });
              onClose();
              setPendingDispatches([]);
            }}>
            {loading && <Loader />}
            {loading ? "Applying" : t("apply")}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalIndicatorsCompare;
