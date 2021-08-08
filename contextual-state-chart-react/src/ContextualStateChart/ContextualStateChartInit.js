// f(stateTree) => names and states arrays
const insertName = (names, name, stateId) => {
  // console.log({ names, name, stateId });
  // save trie node as a state
  if (name.length === 0) {
    // console.log("base case");
    if ("id" in names) {
      console.log(
        Object.keys(names)
          .filter((key) => key !== "id")
          .sort()
      );
    }
    return {
      tree: {
        ...names,
        id: stateId,
      },
      updatedName: [],
    };
  } else if (Object.keys(names).length === 0) {
    // what if there is an "id" in names
    // console.log("names is empty");
    const { tree, updatedName } = insertName(
      {},
      name.slice(1, name.length),
      stateId
    );
    return {
      tree: {
        ...names,
        [name[0]]: tree,
      },
      updatedName: [name[0], ...updatedName],
    };
  } else if (name[0] in names) {
    // console.log("first name is in names");
    const { tree, updatedName } = insertName(
      names[name[0]],
      name.slice(1, name.length),
      stateId
    );
    return {
      tree: {
        ...names,
        [name[0]]: tree,
      },
      updatedName: [name[0], ...updatedName],
    };
  } else {
    // console.log("no name is in names");
    // console.log({ x });
    // first item in sequence is at same level
    const { tree, updatedName } = insertName(
      {},
      name.slice(1, name.length),
      stateId
    );
    return {
      tree: {
        ...names,
        [name[0]]: tree,
      },
      updatedName: [name[0], ...updatedName],
    };
  }
};
const setAttribute = (object, newObject, key, value) => {
  if (key in object) {
    newObject[key] = value;
  }
};
const setupState = (states, state, stateName) => {
  // append state
  const children = state?.children;
  let newState = {};
  // console.log({ before: newState });
  newState["name"] = stateName;
  setAttribute(state, newState, "functionCode", state?.functionCode);
  setAttribute(state, newState, "next", state?.next);
  setAttribute(state, newState, "start", state?.start);
  setAttribute(state, newState, "value", state?.value);
  setAttribute(state, newState, "children", children && Object.keys(children));
  // console.log({ after: newState });
  return newState;
};
const getStateNames = (stateTree, stateName, names, states) => {
  const keys = Object.keys(stateTree);
  const keyMapsToObject = keys.find(
    (key) =>
      Object.prototype.toString.call(stateTree[key]) === "[object Object]"
  );
  if (keys.includes("value")) {
    names.push(stateName);
    states.push(setupState(states, stateTree, stateName));
    states[states.length - 1]["id"] = states.length - 1;
    return;
  }
  if (keys.includes("children")) {
    // stateTree is an internal node
    names.push(stateName);
    states.push(setupState(states, stateTree, stateName));
    states[states.length - 1]["id"] = states.length - 1;
    Object.keys(stateTree.children).forEach((key) => {
      getStateNames(stateTree.children[key], [key], names, states);
    });
  }
  if (keys.includes("variables")) {
    Object.keys(stateTree.variables).forEach((key) => {
      getStateNames(stateTree.variables[key], [key], names, states);
    });
  } else if (keyMapsToObject === undefined) {
    // no key maps to an object
    // stateTree is a leaf node
    names.push(stateName);
    states.push(setupState(states, stateTree, stateName));
    states[states.length - 1]["id"] = states.length - 1;
  } else if (
    !keys.includes("function") &&
    !keys.includes("next") &&
    !keys.includes("start") &&
    !keys.includes("children")
  ) {
    // stateTree is part of a state name

    keys.forEach((key) => {
      getStateNames(stateTree[key], [...stateName, key], names, states);
    });
  }
};
const makeArrays = (stateTree) => {
  // get the state names
  let names = [];
  let states = [];
  getStateNames(stateTree, [], names, states);
  // console.log({ names, states });
  // console.log({ keys: Object.keys(names) });
  let namesTrie = {};
  names.forEach((nameArray, i) => {
    const { tree, updatedName } = insertName(namesTrie, nameArray, i);
    // console.log({ updatedName });
    // console.log({ tree, updatedName });
    namesTrie = tree;
  });
  // console.log({ namesTrie, states });
  return { namesTrie, states };
};
/*
rules of states
each state must be able to access any other state in O(n); where n is the length of the path through
the trie tree
the user must be able to access each node in the context tree of each state
each state that has variables, can be n words but must have a unique path between all variables
the states has. this lets the user use the first word only to refer to it in code.
each state has children

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

role of variables
primitives
small data structures(js inbuilt data structures)
  hash table
  arrays, multidimential arrays
  adjaciency list

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

export { insertName, setAttribute, setupState, getStateNames, makeArrays };
