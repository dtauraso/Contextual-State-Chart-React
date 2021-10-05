import { Children } from "react";
import { State, StatesObject } from "../../App.types";
// f(stateTree) => names and states arrays
import { insertName } from "./TrieTree";
import {
  setAttribute,
  getSubStatePaths,
  addState,
  specialPrint,
  getStateNames,
} from "./StatesObject";
const makeArrays = (stateTree: any) => {
  // get the state names
  let names: string[][] = [];
  // needs to be {} for O(1) adding, updating, and deleting
  let statesObject: StatesObject = { maxStateId: -1, states: {} };
  getStateNames(stateTree, [], names, statesObject);
  console.log({ names, states: statesObject.states });
  // console.log({ keys: Object.keys(names) });
  let namesTrie: any = {};
  names.forEach((nameArray: any, i: number) => {
    namesTrie = insertName({
      names: namesTrie,
      name: nameArray,
      stateId: i,
    });
    // console.log({ updatedName });
    // console.log({ tree, updatedName });
  });
  console.log({ namesTrie, statesObject });
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
