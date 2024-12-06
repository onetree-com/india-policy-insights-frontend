import React, { FC, useState, useMemo } from "react";
import styles from "components/Modal/styles.module.scss";
import Checkbox from "components/Checkbox";
import Text from "components/Text";
import ExpandUp from "assets/icons/ExpandUp";
import ExpandDown from "assets/icons/ExpandDown";
import { division } from "models/divisions";
import { dispatchGTMEvent } from "utils/tagManager";

const ModalContent: FC<{
  id: number;
  title: string;
  titleEn: string;
  items: division[];
  search: string;
  filterByAspirationalDistricts?: boolean;
  selectedDivisions: division[];
  setSelectedDivisions: React.Dispatch<
    React.SetStateAction<{ [parent: string]: division[] }>
  >;
}> = ({
  id,
  title,
  titleEn,
  items,
  search,
  filterByAspirationalDistricts,
  selectedDivisions,
  setSelectedDivisions,
}) => {
  const [expand, setExpand] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    let result = items || [];
    result =
      search === "" || title.toLowerCase().includes(search)
        ? result
        : result.filter((i) => i.name.toLowerCase().includes(search));

    result = !filterByAspirationalDistricts
      ? result
      : result.filter(
          (i) =>
            i.aspirational === filterByAspirationalDistricts &&
            i.name.toLowerCase().includes(search)
        );

    if (
      search !== "" &&
      result.some((i) => i.name.toLowerCase().includes(search))
    ) {
      setExpand(true);
    } else {
      setExpand(false);
    }
    return result;
  }, [items, search, title, filterByAspirationalDistricts]);

  const selectParent = (id: number, checked: boolean) => {
    dispatchGTMEvent({
      event: "region_group_select_click",
      action: checked ? "Exclude" : "Include",
      value: `${titleEn}`,
    });
    setSelectedDivisions((prev) => ({
      ...prev,
      [id]: checked ? [] : filteredItems,
    }));
  };

  const selectDivision = (id: number, item: division, checked: boolean) => {
    setSelectedDivisions((prev) => {
      var divisions = prev[id] || [];
      return {
        ...prev,
        [id]: checked
          ? divisions.concat(item)
          : divisions.filter((i) => i.id !== item.id),
      };
    });
  };

  const showModalContent = () => {
    if (filterByAspirationalDistricts) {
      return (
        search === "" ||
        title.toLowerCase().includes(search) ||
        filteredItems.some((i) => i.name.toLowerCase().includes(search))
      );
    } else {
      return (
        search === "" ||
        title.toLowerCase().includes(search) ||
        items.some((i) => i.name.toLowerCase().includes(search))
      );
    }
  };

  return (
    <>
      <div className={styles["modal-content"]}>
        {showModalContent() ? (
          <div className={styles["modal-content-title"]}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                isChecked={
                  filteredItems.length === selectedDivisions.length &&
                  selectedDivisions.length !== 0
                }
                onClick={(checked) => selectParent(id, checked)}
              />
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
        ) : null}
        {expand && filteredItems.length
          ? filteredItems.map((item) => (
              <Item
                titleEn={titleEn}
                key={item.id}
                item={item}
                itemSelected={selectedDivisions.includes(item)}
                setItemSelected={({ item, checked }) =>
                  selectDivision(id, item, checked)
                }
              />
            ))
          : null}
      </div>
    </>
  );
};

const Item: FC<{
  titleEn: string;
  item: division;
  itemSelected: boolean;
  setItemSelected: ({
    item,
    checked,
  }: {
    item: division;
    checked: boolean;
  }) => void;
}> = ({ item, itemSelected, setItemSelected, titleEn }) => {
  return (
    <div className={styles["modal-content-item"]}>
      <Checkbox
        isChecked={itemSelected}
        onClick={() => {
          dispatchGTMEvent({
            event: "region_select_click",
            action: itemSelected ? "Exclude" : "Include",
            value: `${titleEn} - ${item.nameEn}`,
          });
          setItemSelected({ item, checked: !itemSelected });
        }}
      />
      <p>{item.name}</p>
    </div>
  );
};

export default ModalContent;
