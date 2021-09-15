import { State, StatesObject } from "../../App.types";

const setAttribute = (object: any, newObject: any, key: string, value: any) => {
  if (key in object) {
    newObject[key] = value;
  }
};

const getSubStatePaths = (
  node: any,
  paths: string[][],
  currentPath: string[]
) => {
  // console.log({ node });
  if (typeof node === "string") {
    return;
  }
  const keys = Object.keys(node);
  const filteredKeys = keys.filter(
    (key) =>
      !["functionCode", "start", "next", "children", "variables"].includes(key)
  );
  if (filteredKeys.length === 0) {
    paths.push(currentPath);
  } else {
    // console.log({ filteredKeys, keys });
    filteredKeys.forEach((stateNamePart: string) => {
      // console.log({ stateNamePart, node });
      getSubStatePaths(node[stateNamePart], paths, [
        ...currentPath,
        stateNamePart,
      ]);
    });
  }
};

const addState = (
  statesObject: any,
  stateTree: any,
  stateName: any,
  children: string[][],
  variables: any,
  isVariable: boolean
) => {
  statesObject.maxStateId += 1;
  let newState: State = {};
  newState["name"] = stateName;

  if (!isVariable) {
    newState["stateRunCount"] = 0;
  }
  setAttribute(stateTree, newState, "functionCode", stateTree?.functionCode);
  setAttribute(stateTree, newState, "next", stateTree?.next);
  setAttribute(stateTree, newState, "start", stateTree?.start);
  setAttribute(stateTree, newState, "value", stateTree?.value);
  setAttribute(stateTree, newState, "children", children);
  setAttribute(stateTree, newState, "variables", variables);

  statesObject.states[statesObject.maxStateId] = newState;
  statesObject.states[statesObject.maxStateId]["id"] = statesObject.maxStateId;
};
const specialPrint = (object: any) => {
  // console.log({ object });
  console.log(JSON.parse(JSON.stringify(object)));
};
const getStateNames = (
  stateTree: any,
  stateName: any,
  names: any,
  statesObject: any,
  stateNameToStateIdAndVarCount: any
) => {
  // console.log({ stateName, stateTree });
  const keys = Object.keys(stateTree);
  // const keyMapsToObject = keys.find(
  //   (key) =>
  //     Object.prototype.toString.call(stateTree[key]) === "[object Object]"
  // );
  /*
    if any of the below keys is inside stateTree
      we have reached a stop conditin
    */
  let foundStop = false;
  const stopKeys = ["functionCode", "start", "next", "children", "variables"];
  stopKeys.forEach((stopKey) => {
    if (stopKey in stateTree) {
      foundStop = true;
    }
  });
  if (foundStop) {
    // console.log("at stop condition");
    // stop conditions for the full state name
    if ("children" in stateTree || "variables" in stateTree) {
      // console.log("at stop condition");
      // add state
      // collect data for state
      // names.push(stateName);
      // addState(statesObject, stateTree, stateName);
      // console.log("statesObject", JSON.parse(JSON.stringify(statesObject)));
      let variableData: any = {};
      if ("variables" in stateTree) {
        // variable states are added here
        // save variable names and id's for state
        Object.keys(stateTree.variables).forEach((variableName) => {
          names.push([variableName]);
          addState(
            statesObject,
            stateTree.variables[variableName],
            [variableName],
            [],
            {},
            true
          );
          const variableId = statesObject.maxStateId;
          variableData[variableName] = variableId;
        });
      }
      let childrenPaths: string[][] = [];

      if ("children" in stateTree) {
        // add state names from children into state's children list
        getSubStatePaths(stateTree.children, childrenPaths, []);
      }
      // add state here
      // console.log("variableData", JSON.parse(JSON.stringify(variableData)));
      // console.log("paths", JSON.parse(JSON.stringify(childrenPaths)));
      names.push(stateName);
      addState(
        statesObject,
        stateTree,
        stateName,
        childrenPaths,
        variableData,
        false
      );
      if ("children" in stateTree) {
        Object.keys(stateTree.children).forEach((child) => {
          getStateNames(
            stateTree.children[child],
            [child],
            names,
            statesObject,
            stateNameToStateIdAndVarCount
          );
        });
      }
    } else if (!("variables" in stateTree) && !("children" in stateTree)) {
      names.push(stateName);
      addState(statesObject, stateTree, stateName, [], {}, false);
    }
  }

  // continue down the state name path
  const filteredKeys = keys.filter(
    (key) =>
      !["functionCode", "start", "next", "children", "variables"].includes(key)
  );
  if (filteredKeys.length > 0) {
    filteredKeys.forEach((key) => {
      getStateNames(
        stateTree[key],
        [...stateName, key],
        names,
        statesObject,
        stateNameToStateIdAndVarCount
      );
    });
  }
};

export {
  setAttribute,
  getSubStatePaths,
  addState,
  specialPrint,
  getStateNames,
};