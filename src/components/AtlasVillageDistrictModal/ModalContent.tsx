import React, { FC, useState, useMemo } from "react";
import styles from "./styles.module.scss";
import Text from "components/Text";
import ExpandUp from "assets/icons/ExpandUp";
import ExpandDown from "assets/icons/ExpandDown";
import { ParentChildren, ParentDivision, division } from "models/divisions";
import RadioUnchecked from "assets/icons/RadioUnchecked";
import RadioChecked from "assets/icons/RadioChecked";

const ModalContent: FC<{
  division: ParentChildren;
  search: string;
  filterByAspirationalDistricts?: boolean;
  selectedDivision: ParentDivision;
  setSelectedDivision: React.Dispatch<
    React.SetStateAction<ParentDivision | undefined>
  >;
}> = ({
  division,
  search,
  filterByAspirationalDistricts,
  selectedDivision,
  setSelectedDivision,
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const { name: title, subregions: items } = division;

  const filteredItems = useMemo(() => {
    let result = items || [];
    result =
      search === "" || title.toLowerCase().includes(search)
        ? result
        : result.filter((i) => i.name.toLowerCase().includes(search));

    result = !filterByAspirationalDistricts
      ? result
      : result.filter((i) => i.aspirational === filterByAspirationalDistricts);

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

  return (
    <>
      <div className={styles["modal-content"]}>
        {search === "" ||
        title.toLowerCase().includes(search) ||
        items.some((i) => i.name.toLowerCase().includes(search)) ? (
          <div className={styles["modal-content-title"]}>
            <div style={{ display: "flex", alignItems: "center" }}>
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
                key={item.id}
                item={item}
                itemSelected={item?.id === selectedDivision?.division?.id}
                setItemSelected={(item) => {
                  if (item?.id === selectedDivision?.division?.id) {
                    setSelectedDivision(undefined);
                  } else {
                    setSelectedDivision({
                      parent: {
                        id: division.id,
                        name: division.name,
                        abbreviation: division.abbreviation,
                      },
                      division: item,
                    });
                  }
                }}
              />
            ))
          : null}
      </div>
    </>
  );
};

const Item: FC<{
  item: division;
  itemSelected: boolean;
  setItemSelected: (item: division) => void;
}> = ({ item, itemSelected, setItemSelected }) => {
  return (
    <div className={styles["modal-content-item"]}>
      {itemSelected ? (
        <div
          onClick={() => {
            setItemSelected(item);
          }}
          className={styles.item}>
          <RadioChecked />
        </div>
      ) : (
        <div
          className={styles.item}
          onClick={() => {
            setItemSelected(item);
          }}>
          <RadioUnchecked />
        </div>
      )}
      <p style={{ marginLeft: "8px" }}>{item.name}</p>
    </div>
  );
};

export default ModalContent;
