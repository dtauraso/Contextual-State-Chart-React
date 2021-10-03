import { State, StatesObject } from "../../App.types";
import {
  nullWrapper,
  booleanWrapper,
  numberWrapper,
  stringWrapper,
  arrayWrapper,
  objectWrapper,
} from "../StateTree";
const isBoolean = (json: any) => {
  return Object.prototype.toString.call(json) === "[object Boolean]";
};
const isNumber = (json: any) => {
  return Object.prototype.toString.call(json) === "[object Number]";
};
const isString = (json: any) => {
  return Object.prototype.toString.call(json) === "[object String]";
};
const isArray = (json: any) => {
  return Object.prototype.toString.call(json) === "[object Array]";
};
const isObject = (json: any) => {
  return Object.prototype.toString.call(json) === "[object Object]";
};
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
  // console.log(stateName);
  if (
    JSON.stringify(stateName) === JSON.stringify(["levelId"]) ||
    JSON.stringify(stateName) === JSON.stringify(["timeLineId"]) ||
    JSON.stringify(stateName) === JSON.stringify(["machineRunId"]) ||
    JSON.stringify(stateName) === JSON.stringify(["j"]) ||
    JSON.stringify(stateName) === JSON.stringify(["i"]) ||
    JSON.stringify(stateName) === JSON.stringify(["i1"]) ||
    JSON.stringify(stateName) === JSON.stringify(["nextStates"]) ||
    JSON.stringify(stateName) === JSON.stringify(["winningStateName"]) ||
    JSON.stringify(stateName) ===
      JSON.stringify(["previousSiblingWinningStateName"])
  ) {
    if (isNumber(stateTree.value)) {
      statesObject.states[statesObject.maxStateId] = numberWrapper();
    } else if (isString(stateTree.value)) {
      statesObject.states[statesObject.maxStateId] = stringWrapper();
    } else if (isArray(stateTree.value)) {
      console.log({ stateName, stateTree });
      statesObject.states[statesObject.maxStateId] = arrayWrapper();
    }
    // console.log({ stateTree });
    // console.log("here");
    // statesObject.states[statesObject.maxStateId] = numberWrapper();
    let x = statesObject.states[statesObject.maxStateId];
    // Object.assign()
    x.setId(statesObject.maxStateId);
    x.setName(stateName);
    x.setValue(stateTree.value);
    x.setReferenceToStatesObject(statesObject);
    console.log({ x });
    // x.name = stateName;
  } else {
    let newState: State = {};
    newState["name"] = stateName;

    if (!isVariable) {
      newState["stateRunCount"] = 0;
    }
    // console.log(stateName, stateName === ["levelId"]);
    setAttribute(stateTree, newState, "functionCode", stateTree?.functionCode);
    setAttribute(stateTree, newState, "next", stateTree?.next);
    setAttribute(stateTree, newState, "start", stateTree?.start);
    // if (JSON.stringify(stateName) === JSON.stringify(["levelId"])) {
    //   // console.log("here");
    //   // console.log({ stateTree });
    //   // numberWrapper
    //   newState.wrapper = numberWrapper(stateTree.value); // = { ...newState, ...stateTree.prototype };
    //   // setAttribute(stateTree, newState, "value", stateTree);
    // } else {
    setAttribute(stateTree, newState, "value", stateTree?.value);
    // }
    setAttribute(stateTree, newState, "children", children);
    setAttribute(stateTree, newState, "variables", variables);

    statesObject.states[statesObject.maxStateId] = newState;
    statesObject.states[statesObject.maxStateId]["id"] =
      statesObject.maxStateId;
  }
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
          // console.log({
          //   variableName,
          //   variable: stateTree.variables[variableName],
          // });
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
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject,
  setAttribute,
  getSubStatePaths,
  addState,
  specialPrint,
  getStateNames,
};
