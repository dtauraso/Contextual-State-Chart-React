import { Children } from "react";
import {
  Wrapper,
  NullState,
  BooleanState,
  NumberState,
  StringState,
  ArrayState,
  Variable,
  State,
  States,
  StatesObject,
  NamesTrie,
  Graph,
} from "../../App.types";
// f(stateTree) => names and states arrays
import { insertName } from "./TrieTree";
import {
  isNull,
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject,
  setAttribute,
  getSubStatePaths,
  // addState,
  specialPrint,
  setIds,
  getStateNames2,
  setNames,
  getStates,
  getVariables,
  getStateNames,
} from "./StatesObject";

import {
  nullWrapper,
  booleanWrapper,
  numberWrapper,
  stringWrapper,
  arrayWrapper,
  objectWrapper,
  stateWrapper,
  stateTree,
  getVariable,
} from "../StateTree";

interface GetSubStatePaths2Parameters {
  node: any;
  paths: string[][];
  currentPath: string[];
}
const getSubStatePaths2 = ({
  node,
  paths,
  currentPath,
}: GetSubStatePaths2Parameters) => {
  if (typeof node === "string") {
    return;
  } else if ("value" in node) {
    paths.push(currentPath);
  }
  if ("state" in node) {
    paths.push(currentPath);
  }
  Object.keys(node)
    .filter((key) => key !== "state")
    .forEach((stateNamePart: string) => {
      getSubStatePaths2({
        node: node[stateNamePart],
        paths,
        currentPath: [...currentPath, stateNamePart],
      });
    });
};
const traverseContexts = ({
  trieTreeCollection,
  stateTree,
  indexObject,
  graph,
}: any) => {
  let paths: string[][] = [];
  getSubStatePaths2({
    node: stateTree,
    paths,
    currentPath: [],
  });

  paths.forEach((path: string[]) => {
    let tracker = stateTree;
    path.forEach((contextName: string) => {
      tracker = tracker[contextName];
    });
    makeState({
      trieTreeCollection,
      stateTree: tracker,
      indexObject,
      currentStateName: path,
      graph,
    });
  });
  return paths;
};
const returnTrueShort = (value: any) => true;
const variableTypes: any = {
  "[object Null]": {
    cb: returnTrueShort,
    typeName: "null",
    wrapper: nullWrapper,
  },
  "[object Boolean]": {
    cb: returnTrueShort,
    typeName: "boolean",
    wrapper: booleanWrapper,
  },
  "[object Number]": {
    cb: returnTrueShort,
    typeName: "number",
    wrapper: numberWrapper,
  },
  "[object String]": {
    cb: returnTrueShort,
    typeName: "string",
    wrapper: stringWrapper,
  },
  "[object Array]": {
    cb: (value: any) => value.length === 0,
    typeName: "array",
    wrapper: arrayWrapper,
  },
  "[object Object]": {
    cb: (value: any) => Object.keys(value).length === 0,
    typeName: "object",
    wrapper: objectWrapper,
  },
};
// needs distintive type construction
const getTypeName = (item: any) => Object.prototype.toString.call(item);

const makeVariable = ({
  trieTreeCollection,
  stateTree,
  indexObject,
  name,
  graph,
}: any): any => {
  if ("value" in stateTree) {
    const value = stateTree["value"];
    const typeNameString = getTypeName(value);
    const variableId = indexObject.nextStateId;
    indexObject.nextStateId += 1;
    graph.statesObject.states[variableId] =
      variableTypes?.[typeNameString]?.wrapper();
    graph.statesObject.states[variableId].init(
      variableId,
      name,
      value,
      variableTypes?.[typeNameString]?.typeName
    );
    graph.statesObject.states[variableId].setGraph(graph);
    return variableId;
  } else if (isArray(stateTree)) {
    const value = stateTree.map((element: any, i: number) =>
      makeVariable({
        trieTreeCollection,
        stateTree: stateTree[i],
        indexObject,
        name: `${i}`,
        graph,
      })
    );
    const variableId = indexObject.nextStateId;
    indexObject.nextStateId += 1;
    graph.statesObject.states[variableId] = arrayWrapper();
    graph.statesObject.states[variableId].init(
      variableId,
      name,
      value,
      variableTypes?.["[object Array]"]?.typeName
    );
    graph.statesObject.states[variableId].setGraph(graph);
    return variableId;
  } else if (isObject(stateTree)) {
    const value = Object.keys(stateTree).reduce(
      (acc: any, variableName: string) => {
        acc[variableName] = makeVariable({
          trieTreeCollection,
          stateTree: stateTree[variableName],
          indexObject,
          name: variableName,
          graph,
        });
        return acc;
      },
      {}
    );
    const variableId = indexObject.nextStateId;
    indexObject.nextStateId += 1;
    graph.statesObject.states[variableId] = objectWrapper();
    graph.statesObject.states[variableId].init(
      variableId,
      name,
      value,
      variableTypes?.["[object Object]"]?.typeName
    );
    graph.statesObject.states[variableId].setGraph(graph);
    return variableId;
  } else {
    return -1;
  }
};
const makeState = ({
  trieTreeCollection,
  stateTree,
  indexObject,
  currentStateName,
  graph,
}: any): any => {
  if ("state" in stateTree) {
    const currentState = stateTree["state"];
    const stateId = indexObject.nextStateId;
    indexObject.nextStateId += 1;
    trieTreeCollection.push({
      name: currentStateName,
      stateId: stateId,
    });
    graph.statesObject.states[stateId] = {
      name: currentStateName,
      id: stateId,
      typeName: "state",
      ...(currentState?.functionCode
        ? { functionCode: currentState.functionCode }
        : {}),
      ...(currentState?.next ? { next: currentState.next } : {}),
      ...(currentState?.start ? { start: currentState.start } : {}),
      ...(currentState?.value ? { value: currentState.value } : {}),
      ...(currentState?.children
        ? {
            children: traverseContexts({
              trieTreeCollection,
              stateTree: currentState.children,
              indexObject,
              graph,
            }),
          }
        : {}),
      ...(currentState?.variables
        ? {
            variables: Object.keys(currentState.variables).reduce(
              (acc: any, variableName: string) => {
                acc[variableName] = makeVariable({
                  trieTreeCollection,
                  stateTree: currentState.variables?.[variableName],
                  indexObject,
                  name: variableName,
                  graph,
                });
                return acc;
              },
              {}
            ),
          }
        : {}),
      getVariable: getVariable,
      graph,
    };
  } else {
    traverseContexts({
      trieTreeCollection,
      stateTree,
      indexObject,
      graph,
    });
  }
};

const arrayState = (states: States, i: number) => states[i] as ArrayState;

const makeArrays = (stateTree: any, graph: Graph) => {
  /*
  read the full state name
  save all the state attributes except for 
  */

  let trieTreeCollection: any = [];
  makeState({
    trieTreeCollection: trieTreeCollection,
    stateTree,
    indexObject: graph.statesObject,
    currentStateName: [],
    graph, //: graph.statesObject.states,
  });

  trieTreeCollection.forEach((name: any) => {
    graph.namesTrie = insertName({
      names: graph.namesTrie,
      name: name.name,
      stateId: name.stateId,
    });
  });

  return graph;

  // console.log({ states2, trieTreeCollection });
  // let states3: States = Object.keys(states2).reduce((acc: any, curr: number) => {
  //   let x: State = {}
  //   x = getKeyValue<keyof states2, typeof states2>(0)(states2)
  //   // states2[curr]
  //   return acc[curr] = x
  // }, {})
  // console.log({
  //   number47: Object.prototype.toString.call(states2[47]),
  //   state47: states2[47],
  //   states2,
  // });
  // console.log({ states });

  // console.log("run map");
  // let x = arrayState(graph.statesObject, 55)
  //   .mapWrapper((item: any) => `${item} passes`)
  //   .mapWrapper((item: any) => `${item} passes 2`)
  //   .mapWrapper((item: any) => `${item} passes 3`);
  // console.log(x);
  // console.log(states2[x.value[0]]);
  // console.log(states2[x.value[1]]);

  // let namesTrie: any = {};

  // trieTreeCollection.forEach((trieEntryItem: any) => {
  //   console.log(
  //     `${trieEntryItem.name.join(" | ")} id: ${trieEntryItem.stateId}`
  //   );
  // });
  /*
  visit each variable tree
  each new variable found maps to an id
  need lots of small clean algorithms or debugging will be very bad
  make flat tree of variables for each variable tree(from json tree to array)
    function style version of parent child(current node)
  */
};
/*
state object -> stateId
childrenNames -> all paths from current state to the children keys

*/

/*
rules of states
each state must be able to access any other state in O(n); where n is the length of the path through
the trie tree
the user must be able to access each node in the context tree of each state
each state that has variables, can be n words but must have a unique path between all variables
the states has. this lets the user use the first word only to refer to it in code.
each state has children
a state cannot have variables but no children
variable names inside the state scope
  not allowed
  a
    b
      d
    c
  ----------
  allowed
  a
   b
    d
  c
all variables have unique id number
only 1 unique variable name per state function is allowed
role of variables
primitives
small data structures(js inbuilt data structures)
  hash table
  arrays, multidimential arrays
  adjaciency list
accessing a variable name takes O(p), where p is the number of name parts
root state for the search tries(26 tries)
    root
        search
            26 roots(a-z)
        random
            26 pivot states(a-z) for each trie
                branch pivot states for each unique path in the trie
    root/random/userLetter/a-z/[0, n]; for each branch pivot state
        each branch pivot state is orgainized by letter
    root/random/userLetter/a/[0, n]; all the nodes in the search

    c/{randomNumber/, ....}/title -> [title/{randomNumber/, ....}, ]
*/

export {
  insertName,
  setAttribute,
  getStateNames,
  makeArrays,
  makeState,
  makeVariable,
};
