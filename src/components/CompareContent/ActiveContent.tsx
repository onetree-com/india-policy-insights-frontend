import { FC, useContext, Dispatch, SetStateAction, useEffect } from "react";
import styles from "./styles.module.scss";
import Text from "components/Text";
import Popup from "components/Popup";
import Information from "assets/icons/Information";
import MenuKebab from "assets/icons/MenuKebab";
import Trash from "assets/icons/Trash";
import { CompareActionType, CompareContext } from "context/compareContext";
import CompareTooltip from "./CompareTooltip";
import { useTranslation } from "react-i18next";

const ActiveContent: FC<{
  index: number;
  indId: number;
  indName: string;
  description?: string;
  descriptionHi?: string;
  setShowPopup: Dispatch<SetStateAction<boolean>>;
  showPopup: boolean;
  setActive: Dispatch<SetStateAction<number>>;
  active: number;
  isDesktop: boolean;
  infoRow:
    | {
        show: boolean;
        title: string;
        description: string;
        descriptionHi: string;
      }
    | undefined;
  setInfoRow: Dispatch<
    SetStateAction<
      | {
          show: boolean;
          title: string;
          description: string;
          descriptionHi: string;
        }
      | undefined
    >
  >;
}> = ({
  index,
  indId,
  setShowPopup,
  showPopup,
  isDesktop,
  active,
  setActive,
  setInfoRow,
  infoRow,
  indName,
  description,
  descriptionHi,
}) => {
  const { dispatch } = useContext(CompareContext)!;
  const { t } = useTranslation();
  const sectionStyles = () => {
    let styles: React.CSSProperties = {
      cursor: "pointer",
    };

    if (isDesktop) {
      styles = {
        ...styles,
        borderRight:
          active === index ? "1px solid #575A5C" : "1px solid transparent",
      };
    } else {
      styles = {
        ...styles,
        border:
          active === index ? "1px solid #575A5C" : "1px solid transparent",
      };
    }

    return styles;
  };
  useEffect(() => {
    setInfoRow(undefined);
  }, [active, setInfoRow]);

  return (
    <section
      onClick={(e) => {
        e.stopPropagation();
        if (infoRow === undefined) {
          setShowPopup(!showPopup);
        }
      }}
      className={styles.indicatorOptions}
      style={sectionStyles()}>
      {active === index ? (
        <>
          <MenuKebab />
          {infoRow && active === index && (
            <div className={styles.tooltipContainer}>
              <CompareTooltip
                title={infoRow.title}
                description={infoRow.description}
                descriptionHi={infoRow.descriptionHi}
                setInfoRow={setInfoRow}
              />
            </div>
          )}
        </>
      ) : null}

      <Popup
        show={showPopup && active === index}
        position={isDesktop ? "left" : "right"}>
        <div className={styles.popupContent}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setInfoRow({
                show: true,
                title: indName,
                description: description ?? "No description yet",
                descriptionHi: descriptionHi ?? "No description yet",
              });
              setShowPopup(false);
            }}>
            <Information />
            <Text weight={400} size="14px" lineHeight="24px">
              {t("info")}
            </Text>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                type: CompareActionType.DESELECT_INDICATOR,
                payload: { indId },
              });
              setShowPopup(false);
              setActive(-1);
            }}>
            <Trash />
            <Text weight={400} size="14px" lineHeight="24px">
              {t("delete")}
            </Text>
          </div>
        </div>
      </Popup>
    </section>
  );
};

export default ActiveContent;
