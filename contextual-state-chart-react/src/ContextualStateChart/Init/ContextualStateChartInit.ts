import { Children } from "react";
import { NamesTrie, State, StatesObject, States } from "../../App.types";
// f(stateTree) => names and states arrays
import { insertName } from "./TrieTree";
import {
  setAttribute,
  getSubStatePaths,
  addState,
  specialPrint,
  setIds,
  getStateNames2,
  setNames,
  getStates,
  getVariables,
  getStateNames,
} from "./StatesObject";

const makeArrays = (stateTree: any) => {
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
  let variables: any = { maxStateId: -1, states: {} };
  // getVariables({
  //   json: json["run state machine"],
  //   jsonName: "run state machine",
  //   variables,
  // });
  // console.log({ variables });
  // let x: States = {};
  let statesObjects2: StatesObject = {
    states: {},
    maxStateId: states.length - 1,
  };
  // console.log({ length: states.length });
  states.forEach((state: State, i: number) => {
    // add state
    let stateVariables: any = {};
    statesObjects2.states = {
      ...statesObjects2.states,
      [i]: { ...state, variables: stateVariables },
    };
    // maxId counts ahead of i, then i catches up, then maxId catches up
    // statesObjects2.maxStateId += 1;
    // all the states are being replaced by all of the variables
    // console.log({ vars: state.variables, type: typeof state.variables });
    if (state.variables) {
      let variables: any = {};

      Object.keys(state.variables).forEach((variableName) => {
        variables = {
          ...variables,
          [variableName]: getVariables({
            json: state.variables[variableName],
            jsonName: variableName,
            variables: statesObjects2,
          }),
        };
      });
      // console.log({ variables, states: statesObjects2.states });
      // getKeyValue(i)(statesObjects2.states)
      // console.log(statesObjects2.states[i]);
      statesObjects2.states[i].variables = variables;
    }
  });
  console.log({ statesObjects2 });
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
