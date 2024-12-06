import {
  FC,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  Fragment,
} from "react";
import styles from "components/Modal/styles.module.scss";
import Checkbox from "components/Checkbox";
import { GlobalContext } from "context/globalContext/index";
import { division } from "models/divisions";
import { CompareActionType } from "context/compareContext";
import { dispatchGTMEvent } from "utils/tagManager";
import Tooltip from "components/Popup/Tooltip";
import Text from "components/Text";
import { useTranslation } from "react-i18next";

const CheckboxItem: FC<{
  item: division;
  title: string;
  id: number;
  setSelectedDivisions: Dispatch<
    SetStateAction<
      | {
          parent: {
            id: number;
            name: string;
          };
          division: division;
        }[]
      | undefined
    >
  >;
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
  divisionIndex?: { name: string; index: number } | null;
  setPendingDispatches?: Dispatch<
    SetStateAction<
      {
        type: any;
        payload?: any;
      }[]
    >
  >;
  selectedDivision?: string;
  setSelectedDivision?: Dispatch<SetStateAction<string | undefined>>;
}> = ({
  item,
  title,
  id,
  selectedDivisions,
  setSelectedDivisions,
  divisionIndex,
  setPendingDispatches,
  selectedDivision,
  setSelectedDivision,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const isDisabled = () => {
    if (
      divisionIndex !== undefined &&
      selectedDivisions &&
      selectedDivisions.length !== 0 &&
      selectedDivisions.find((it, index) => {
        return index !== divisionIndex?.index && item.id === it.division.id;
      })
    ) {
      return styles.disabled;
    }
  };
  return (
    <Fragment key={item.geoId}>
      {isDisabled() ? (
        <div style={{ position: "relative" }}>
          <Tooltip
            customStyles={{
              position: "absolute",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: "8px",
              borderRadius: "5px",
              right: 10,
              top: 10,
              fontSize: "12px",
              border: "1px solid #e7e7e7",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.24)",
            }}
            show={showTooltip}
            closeFromOutside={() => {
              setShowTooltip((pre) => !pre);
            }}>
            <Text>{t("already_selected")}</Text>
          </Tooltip>
        </div>
      ) : null}
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`${styles["modal-content-item"]} ${isDisabled()}`}>
        <Checkbox
          // if divisionIndex has value, then the user selected the edit option (in which case only one item should be checked)
          isChecked={
            globalState.navigation.feature !== "COMPARE"
              ? globalState.selectedDivision?.division.id === item.id
              : selectedDivisions &&
                selectedDivisions.length !== 0 &&
                divisionIndex === undefined
              ? selectedDivisions.some((division) => {
                  return division.division.name === item.name;
                })
              : selectedDivision === item.name && divisionIndex !== undefined
          }
          customStyles={isDisabled() ? { cursor: "not-allowed" } : {}}
          onClick={() => {
            if (divisionIndex) {
              if (selectedDivision !== item.name && !isDisabled()) {
                setSelectedDivision!(item.name);
                dispatchGTMEvent({
                  event: "region_select_click",
                  action: "Include",
                  value: `${item.nameEn}`,
                });
                setPendingDispatches!([
                  {
                    type: CompareActionType.EDIT_DIVISION,
                    payload: {
                      index: divisionIndex.index,
                      item: {
                        parent: { id, name: title },
                        division: item,
                      },
                    },
                  },
                ]);
              }
            } else {
              // If the item is already selected, unselect it
              if (
                selectedDivisions &&
                selectedDivisions.some((division) => {
                  return division.division.name === item.name;
                })
              ) {
                dispatchGTMEvent({
                  event: "region_select_click",
                  action: "Exclude",
                  value: `${item.nameEn}`,
                });
                setSelectedDivisions(
                  selectedDivisions.filter((division) => {
                    return division.division.id !== item.id;
                  })
                );
              } else {
                // add the unselected item to the list of selected
                if (
                  !selectedDivisions ||
                  (selectedDivisions && selectedDivisions.length < 4)
                ) {
                  dispatchGTMEvent({
                    event: "region_select_click",
                    action: "Include",
                    value: `${item.nameEn}`,
                  });
                  setSelectedDivisions([
                    ...selectedDivisions!,
                    {
                      parent: { id, name: title },
                      division: item,
                    },
                  ]);
                }
              }
            }
          }}
        />

        <p>{item.name}</p>
      </div>
    </Fragment>
  );
};

export default CheckboxItem;
