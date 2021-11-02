import { Children } from "react";
import { NamesTrie, State, StatesObject, States } from "../../App.types";
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

import { arrayWrapper, objectWrapper } from "../StateTree";

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
  states,
  isVariable,
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
      currentStateName: path,
      states,
      isVariable,
    });
  });
  return paths;
};

const makeVariable = ({
  trieTreeCollection,
  stateTree,
  states,
  isVariable,
  variableId,
}: any): any => {
  if ("value" in stateTree) {
    const value = stateTree["value"];
    if (
      isNull(value) ||
      isBoolean(value) ||
      isNumber(value) ||
      isString(value) ||
      (isArray(value) && value.length === 0) ||
      (isObject(value) && Object.keys(value).length === 0)
    ) {
      states[variableId] = { ...states[variableId], value };
      return variableId;
    }
  } else if (isArray(stateTree)) {
    states[variableId] = stateTree.map((element: any, i: number) =>
      makeState({
        trieTreeCollection,
        stateTree: stateTree[i],
        currentStateName: `${i}`,
        states,
        isVariable,
      })
    );
    return variableId;
  } else if (isObject(stateTree)) {
    // console.log("only one");
    states[variableId] = Object.keys(stateTree).reduce(
      (acc: any, curr: string) => {
        acc[curr] = makeState({
          trieTreeCollection,
          stateTree: stateTree[curr],
          currentStateName: curr,
          states,
          isVariable,
        });
        return acc;
      },
      {}
    );
    return variableId;
  } else {
    return -1;
  }
  // returns to makeState called with "variables" key
};

const makeState = ({
  trieTreeCollection,
  stateTree,
  currentStateName,
  states,
  isVariable,
}: any): any => {
  if (isVariable) {
    const variableId = Object.keys(states).length;
    trieTreeCollection.push({
      name: currentStateName,
      variableId,
    });
    states[variableId] = { name: currentStateName };
    return makeVariable({
      trieTreeCollection,
      stateTree,
      states,
      isVariable,
      variableId,
    });
    // returns to makeState called with "variables" key
  }
  if ("state" in stateTree) {
    const currentState = stateTree["state"];
    const stateId = Object.keys(states).length;
    trieTreeCollection.push({
      name: currentStateName,
      stateId,
    });
    states[stateId] = { name: currentStateName };
    if ("functionCode" in currentState) {
      states[stateId] = {
        ...states[stateId],
        functionCode: currentState?.functionCode,
      };
    }
    if ("next" in currentState) {
      states[stateId] = { ...states[stateId], next: currentState?.next };
    }
    if ("start" in currentState) {
      states[stateId] = { ...states[stateId], start: currentState?.start };
    }
    if ("value" in currentState) {
      states[stateId] = { ...states[stateId], value: currentState?.value };
    }
    states[stateId] = { ...states[stateId], id: stateId };
    if ("children" in currentState) {
      let paths: string[][] = traverseContexts({
        trieTreeCollection,
        stateTree: currentState?.children,
        states,
        isVariable,
      });

      states[stateId] = {
        ...states[stateId],
        children: paths,
      };
    }
    if ("variables" in currentState) {
      states[stateId] = {
        ...states[stateId],
        variables: Object.keys(currentState?.variables).reduce(
          (acc: any, variableName: string) => {
            acc[variableName] = makeState({
              trieTreeCollection,
              stateTree: currentState?.variables?.[variableName],
              currentStateName: variableName,
              states,
              isVariable: true,
            });
            return acc;
          },
          {}
        ),
      };
    }
  } else {
    traverseContexts({
      trieTreeCollection,
      stateTree,
      states,
      isVariable,
    });
  }
};
const makeArrays = (stateTree: any) => {
  /*
  read the full state name
  save all the state attributes except for 
  */
  let states2 = {};
  let trieTreeCollection: any = [];
  console.log("run makeState");
  makeState({
    trieTreeCollection: trieTreeCollection,
    stateTree,
    currentStateName: [],
    states: states2,
    isVariable: false,
  });
  console.log({ states2, trieTreeCollection });

  // trieTreeCollection.forEach((trieEntryItem: any) => {
  //   console.log(
  //     `${trieEntryItem.name.join(" | ")} id: ${trieEntryItem.stateId}`
  //   );
  // });
  return {};
  // get the state names
  let names: string[][] = [];
  // needs to be {} for O(1) adding, updating, and deleting
  let statesObject: StatesObject = { maxStateId: -1, states: {} };

  // getStateNames(stateTree, [], names, statesObject);
  // console.log({ names, states: statesObject.states });
  // console.log({ keys: Object.keys(names) });
  // names.forEach((nameArray: any, i: number) => {
  //   namesTrie = insertName({
  //     names: namesTrie,
  //     name: nameArray,
  //     stateId: i,
  //   });
  //   // console.log({ updatedName });
  //   // console.log({ tree, updatedName });
  // });
  // console.log({ namesTrie, statesObject });
  console.log("start");
  setIds({
    stateTree,
    idObject: { id: 0 },
  });
  console.log("end");

  console.log({ stateTree });

  // trie tree
  // states array
  // variables added to states array

  let stateNames: any = [];
  getStateNames2({ stateTree, stateName: [], stateNames });
  console.log({ stateNames });
  // put in trie tree
  let namesTrie: any = {};

  stateNames.forEach((name: any) => {
    namesTrie = insertName({
      names: namesTrie,
      name: name.stateName,
      stateId: name.id,
    });
  });
  console.log({ namesTrie });
  // messing up code that runs before this runs
  let states: State[] = [];
  getStates({ stateTree, states });
  console.log({ states });

  // replace with a non modifying function
  setNames({ names: stateNames, states });
  console.log("states with names", { states });
  let json = {
    "run state machine": {
      calculator: {
        bottom: {
          state: {
            children: {
              x: [{ something: { y: 0 } }, { a: { b: {} } }],
              "level 0": {
                "timeLine 0": {
                  state: {
                    children: {},
                    variables: {
                      nextStates: [],
                      winningStateName: [],
                      previousSiblingWinningStateName: [],
                      j: 0,
                    },
                  },
                },
              },
            },
            variables: {
              i: 0,
            },
          },
          // reinterpret as a variable data structure
        },
      },
    },
  };
  // array indicies for the states interfeer with the indicies for the variables
  // visit each tree of variable indecies and add state.length to them
  /*
  visit each variable tree
  each new variable found maps to an id
  need lots of small clean algorithms or debugging will be very bad
  make flat tree of variables for each variable tree(from json tree to array)
    function style version of parent child(current node)
  */
  let variables: any = { maxStateId: -1, states: {} };
  // getVariables({
  //   json: json["run state machine"],
  //   jsonName: "run state machine",
  //   variables,
  // });
  // console.log({ variables });
  // let x: States = {};
  // let statesObjects2: StatesObject = {
  //   states: {},
  //   maxStateId: states.length - 1,
  // };
  // // console.log({ length: states.length });
  // states.forEach((state: State, i: number) => {
  //   // add state
  //   let stateVariables: any = {};
  //   statesObjects2.states = {
  //     ...statesObjects2.states,
  //     [i]: { ...state, variables: stateVariables },
  //   };
  //   if (state.variables) {
  //     const variables: any = Object.keys(state.variables) as any;

  //     statesObjects2.states[i].variables = variables.reduce(
  //       (acc: any, variableName: any): string => {
  //         acc[variableName] = getVariables({
  //           json: state.variables[variableName],
  //           jsonName: variableName,
  //           variables: statesObjects2,
  //         });
  //         return acc;
  //       },
  //       {}
  //     );
  //   }
  // });
  let statesObjects2: StatesObject = {
    states: {},
    maxStateId: states.length - 1,
  };
  // console.log({ length: states.length });
  statesObjects2.states = states.reduce(
    (acc: any, state: State, i: number): States => {
      // add state
      let stateVariables: any = {};
      // statesObjects2.states = {
      //   ...statesObjects2.states,
      //   [i]: { ...state, variables: stateVariables },
      // };
      acc[i] = { ...state, variables: stateVariables };
      if (state.variables) {
        const variables: any = Object.keys(state.variables) as any;

        acc[i].variables = variables.reduce(
          (acc2: any, variableName: any): string => {
            acc2[variableName] = getVariables({
              json: state.variables[variableName],
              jsonName: variableName,
              variables: statesObjects2,
            });
            return acc2;
          },
          {}
        );
      }
      return acc;
    },
    {}
  );
  console.log({ statesObjects2 });
  let operators = statesObjects2.states[48];
  console.log({ operators });
  console.log(operators.mapWrapperState);
  console.log(operators.get?.(0));
  let multiplyVar = statesObjects2.states[operators.get?.(0)];
  multiplyVar.setValue?.("passes");
  console.log(multiplyVar);
  // makeArrays doesn't scale for concatenating multiple state trees into 2 arrays
  // (for trie and for states)
  // arrayWrapper is inside a state type and therefore accessible but unusable
  // (operators as typeof arrayWrapper).mapWrapperState;
  let newArray = operators.mapWrapperState?.(
    (x: any, i: number, y: any) => x.value + "passes",
    statesObjects2.states
  );
  console.log({ result: newArray.value });

  // if (operators) {
  //   operators?.mapWrapperState(
  //     (x: any, i: number, y: any) => x + "passes",
  //     statesObjects2.states
  //   );
  // }

  return { namesTrie, statesObject };
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

export { insertName, setAttribute, getStateNames, makeArrays };
