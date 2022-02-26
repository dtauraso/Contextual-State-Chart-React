import { NamesTrie } from "../../App.types";

interface InsertNameParameters {
  names: NamesTrie;
  name: string[];
  stateId: number;
}
const insertName = ({ names, name, stateId }: InsertNameParameters): any => {
  if (name.length === 0) {
    // console.log("base case");
    if ("id" in names) {
      // console.log("names duplicate key", { names });
      // it's the same key
      return names;
    }
    return {
      ...names,
      id: stateId,
    };
  } else {
    let trie: any = !(name[0] in names) ? {} : names[name[0]];
    return {
      ...names,
      [name[0]]: insertName({
        names: trie,
        name: name.slice(1, name.length),
        stateId,
      }),
    };
  }
};
interface SearchNameParameters {
  names: NamesTrie;
  name: string[];
}
const searchName = ({ names, name }: SearchNameParameters): boolean => {
  if (names === undefined) {
    return false;
  }
  if (name.length === 0) {
    return "id" in names;
  } else if (name[0] in names) {
    return searchName({
      names: names[name[0]],
      name: name.slice(1, name.length),
    });
  } else {
    return false;
  }
};
const getStateId = ({ names, name }: SearchNameParameters): number => {
  if (names === undefined) {
    return -1;
  }
  if (name.length === 0) {
    if ("id" in names) {
      return names["id"] as number;
    } else {
      return -1;
    }
  } else if (name[0] in names) {
    return getStateId({
      names: names[name[0]],
      name: name.slice(1, name.length),
    });
  } else {
    return -1;
  }
};
export { insertName, searchName, getStateId };
