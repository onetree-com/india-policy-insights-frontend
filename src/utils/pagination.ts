import { ParentChildren } from "models/divisions";

export const addPaginatedItems = (
  source: ParentChildren[],
  newItems: any[]
) => {
  for (const item of newItems) {
    const index = source.findIndex((a) => a.id === item.id);
    if (index >= 0) {
      return [
        ...source.slice(0, index),
        {
          ...source[index],
          subregions: source[index].subregions.concat(item.subregions),
        },
        ...source.slice(index + 1),
      ];
      //   source[index].subregions = source[index].subregions.concat(
      //     item.subregions
      //   );
    } else {
      source = [...source, item];
    }
  }
  return source;
};
