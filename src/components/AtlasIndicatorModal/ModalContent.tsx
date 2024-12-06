import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import Radio from "components/Radio";
import { indicator } from "models/indicator";
import { FC, useMemo, useState } from "react";
import cx from "classnames";
import stylesModal from "components/Modal/styles.module.scss";
import stylesRadio from "components/Radio/styles.module.scss";

import Text from "components/Text";
import { filterIndicators } from "utils/calculateSelectedIndicatorN";

const ModalContent: FC<{
  title: string;
  items: Array<indicator>;
  search: string;
  selected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<indicator | undefined>>;
}> = ({ title, items, search, selected, setSelected }) => {
  const [expand, setExpand] = useState<boolean>(false);

  const itemsFiltered = useMemo<Array<indicator>>(() => {
    return filterIndicators(search, title, items, setExpand);
  }, [items, title, search]);

  const sortedItems = itemsFiltered.sort((a, b) => {
    if (a.indName === undefined || b.indName === undefined) {
      return 0;
    }
    return a.indName.localeCompare(b.indName);
  });
  return (
    <>
      <div className={stylesModal["modal-content"]}>
        {search === "" ||
        title.toLowerCase().includes(search.trim()) ||
        items.some((i) => i.indName?.toLowerCase().includes(search.trim())) ? (
          <div className={stylesModal["modal-content-title"]}>
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
        {expand && sortedItems.length
          ? sortedItems.map((item) => (
              <Item
                key={item.indId}
                item={item}
                selected={selected}
                setSelected={setSelected}
              />
            ))
          : null}
      </div>
    </>
  );
};

const Item = ({
  item,
  selected,
  setSelected,
}: {
  item: indicator;
  selected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<indicator | undefined>>;
}) => {
  return (
    <div key={item.indId} className={stylesModal["modal-content-item"]}>
      <Radio
        onChange={() => {
          setSelected(item);
        }}
        value={item.indName!}
        customDot={
          <div
            className={cx(
              selected === item.indId! && stylesRadio["radio-inner-circle"]
            )}
          />
        }
      />
      <p>{item.indName!}</p>
    </div>
  );
};

export default ModalContent;
