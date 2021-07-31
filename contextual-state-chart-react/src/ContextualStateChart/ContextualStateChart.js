// f(stateTree) => names and states arrays
const insertName = (names, name, stateId) => {
  // console.log({ names, name, stateId });
  // save trie node as a state
  if (name.length === 0) {
    // console.log("base case");
    return {
      ...names,
      id: stateId,
    };
  } else if (Object.keys(names).length === 0) {
    // what if there is an "id" in names
    // console.log("names is empty");
    return {
      ...names,
      [name[0]]: insertName({}, name.slice(1, name.length), stateId),
    };
  } else if (name[0] in names) {
    // console.log("first name is in names");
    return {
      ...names,
      [name[0]]: insertName(
        names[name[0]],
        name.slice(1, name.length),
        stateId
      ),
    };
  } else {
    // console.log("no name is in names");
    // console.log({ x });
    // first item in sequence is at same level
    return {
      ...names,
      [name[0]]: insertName({}, name.slice(1, name.length), stateId),
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
  console.log({ names, states });
  // console.log({ keys: Object.keys(names) });
  let namesTrie = {};
  names.forEach((nameArray, i) => {
    namesTrie = insertName(namesTrie, nameArray, i);
  });
  console.log({ namesTrie, states });
  return { namesTrie, states };
};
/*
rules of states
each state must be able to access any other state in O(n); where n is the length of the path through
the trie tree
the user must be able to access each node in the context tree of each state
each state that has variables, can be n words but must have a unique path between all variables
the states has. this lets the user use the first word only to refer to it in code.

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
*/

export { insertName, setAttribute, setupState, getStateNames, makeArrays };
