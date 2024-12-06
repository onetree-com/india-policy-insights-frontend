import { FC, Dispatch, SetStateAction } from "react";
import styles from "components/Modal/styles.module.scss";
import Radio from "components/Radio";
import { GlobalActionType } from "context/globalContext/index";
import { division } from "models/divisions";
import { dispatchGTMEvent } from "utils/tagManager";

const RadioItem: FC<{
  item: division;
  title: string;
  id: number;
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
  setPendingDispatches,
  selectedDivision,
  setSelectedDivision,
}) => {
  return (
    <div key={item.geoId} className={styles["modal-content-item"]}>
      <Radio
        isChecked={item.name === selectedDivision}
        value={item.geoId}
        onChange={() => {
          setSelectedDivision!(item.name);
          dispatchGTMEvent({
            event: "region_select_click",
            action: item.name === selectedDivision ? "Exclude" : "Include",
            value: `${item.nameEn}`,
          });
          setPendingDispatches!([
            {
              type: GlobalActionType.SELECT_DIVISION,
              payload: {
                parent: { id, name: title },
                division: item,
              },
            },
          ]);
        }}
      />
      <p>{item.name}</p>
    </div>
  );
};

export default RadioItem;
