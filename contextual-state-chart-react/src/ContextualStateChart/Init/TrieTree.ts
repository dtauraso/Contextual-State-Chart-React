import { NamesTrie } from "../../App.types";

interface InsertNameParameters {
  names: NamesTrie;
  name: string[];
  stateId: number;
}
const insertName = ({ names, name, stateId }: InsertNameParameters): any => {
  // console.log({ names, name, stateId });
  if (name.length === 0) {
    // console.log("base case");
    if ("id" in names) {
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

export { insertName };
