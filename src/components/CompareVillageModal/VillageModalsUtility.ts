import { getDivisions } from "api/divisions";
import { getDistrictVillages } from "api/getDistrictVillages";
import { DivisionTypes, GlobalActionType } from "context/globalContext";
import { ParentChildren, division } from "models/divisions";
import { sortAlphabetically } from "utils/list-utility";

export const handleSearch = (
  text: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  REGCOUNT: number,
  currentLanguage: string,
  setSearchResults: React.Dispatch<React.SetStateAction<ParentChildren[]>>
) => {
  const abortController = new AbortController();
  setLoading(true);
  getDistrictVillages<division[]>({
    RegCount: REGCOUNT,
    RegIgnored: 0,
    filter: text,
    controller: abortController,
    currentLanguage,
  })
    .then((data) => {
      const results = data as ParentChildren[];
      const sortedList = sortAlphabetically(results);
      sortedList.map((item) => {
        item.subregions = sortAlphabetically(item.subregions);
        item.isVillages = true;
        return item;
      });
      setSearchResults(sortedList);
    })
    .finally(() => {
      setLoading(false);
      abortController.abort();
    });
};

export const loadDistrictVillages = (
  villages: division[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  district: ParentChildren,
  currentLanguage: string,
  globalDispatch: React.Dispatch<{
    type: GlobalActionType;
    payload: any;
  }>,
  search?: string,
  searchResults?: ParentChildren[],
  setSearchResults?: React.Dispatch<React.SetStateAction<ParentChildren[]>>
) => {
  if (villages.length > 1) return;
  if (search !== "" && villages.length === 1 && villages[0].name !== "") return;
  let controller = new AbortController();
  setLoading(true);
  getDivisions({
    RegCount: 5000,
    RegIgnored: 0,
    RegionType: DivisionTypes.Village,
    StateId: 0,
    RegionID: district.id,
    SubregionID: 0,
    controller,
    currentLanguage,
  })
    .then((data: any) => {
      if (data) {
        if (
          search &&
          search !== "" &&
          searchResults &&
          searchResults.length !== 0 &&
          setSearchResults
        ) {
          const sortedList = sortAlphabetically(data[0].subregions ?? []);
          setSearchResults([
            ...searchResults?.map((result) => {
              return result.id !== district.id
                ? result
                : { ...result, subregions: sortedList, isVillages: true };
            }),
          ]);
        } else {
          globalDispatch({
            type: GlobalActionType.LOAD_DISTRICT_VILLAGES,
            payload: {
              districtId: district.id,
              data: [{ subregions: data[0]?.subregions ?? [] }],
              isVillages: true,
            },
          });
        }
      }
    })
    .catch(() => {
      controller.abort();
    })

    .finally(() => setLoading(false));
};
