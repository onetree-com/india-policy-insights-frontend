import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import styles from "components/Modal/styles.module.scss";
import Text from "components/Text";
import { division } from "models/divisions";
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import RadioItem from "./createReport/RadioItem";
import CheckboxItem from "./compare/CheckboxItem";
import { GlobalContext } from "context/globalContext";

interface Props {
  id: number;
  title: string;
  search: string;
  filterByAspirationalDistricts?: boolean;
  setPendingDispatches?: Dispatch<
    SetStateAction<
      {
        type: any;
        payload?: any;
      }[]
    >
  >;
  items: division[];
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
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
  divisionIndex?: { name: string; index: number } | null;
  selectedDivision?: string;
  setSelectedDivision?: Dispatch<SetStateAction<string | undefined>>;
}

const ModalContentDivisions: FC<Props> = ({
  title,
  id,
  items,
  search,
  filterByAspirationalDistricts,
  selectedDivisions,
  setSelectedDivisions,
  divisionIndex,
  setPendingDispatches,
  selectedDivision,
  setSelectedDivision,
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;

  const itemsFiltered = useMemo<Array<division>>(() => {
    let result = items || [];

    result =
      search === "" || title.toLowerCase().includes(search.toLowerCase())
        ? items.sort((a, b) => (a.name > b.name ? 1 : -1))
        : items.filter((i) =>
            i.name?.toLowerCase().includes(search.toLowerCase())
          );

    if (
      search !== "" &&
      result.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    ) {
      setExpand(true);
    } else {
      setExpand(false);
    }

    return result;
  }, [items, title, search]);

  const renderItem = (item: division) =>
    globalState.navigation.feature !== "COMPARE" ? (
      <RadioItem
        key={item.id}
        id={id}
        item={item}
        title={title}
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
        setPendingDispatches={setPendingDispatches}
      />
    ) : (
      <CheckboxItem
        key={item.id}
        item={item}
        title={title}
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
        setPendingDispatches={setPendingDispatches}
        id={id}
        setSelectedDivisions={setSelectedDivisions}
        selectedDivisions={selectedDivisions}
        divisionIndex={divisionIndex}
      />
    );

  return (
    <>
      <div className={styles["modal-content"]}>
        {search === "" ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        items.some((i) =>
          i.name.toLowerCase().includes(search.toLowerCase())
        ) ? (
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

        {expand && itemsFiltered
          ? itemsFiltered!.map((item) => {
              return filterByAspirationalDistricts
                ? item.aspirational! === true
                  ? renderItem(item)
                  : null
                : renderItem(item);
            })
          : null}
      </div>
    </>
  );
};

export default ModalContentDivisions;
