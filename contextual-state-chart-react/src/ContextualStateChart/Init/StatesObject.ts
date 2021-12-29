import { State, StatesObject } from "../../App.types";
import {
  booleanWrapper,
  numberWrapper,
  stringWrapper,
  arrayWrapper,
  objectWrapper,
  ControlFlowStateWrapper,
} from "../StateTree";
const isNull = (json: any) => {
  return Object.prototype.toString.call(json) === "[object Null]";
};
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

// const addState = (
//   statesObject: any,
//   stateTree: any,
//   stateName: any,
//   children: string[][],
//   variables: any,
//   isVariable: boolean
// ) => {
//   // inserts state only
//   statesObject.nextStateId += 1;
//   // console.log(stateName);
//   if (
//     JSON.stringify(stateName) === JSON.stringify(["levelId"]) ||
//     JSON.stringify(stateName) === JSON.stringify(["timeLineId"]) ||
//     JSON.stringify(stateName) === JSON.stringify(["machineRunId"]) ||
//     JSON.stringify(stateName) === JSON.stringify(["j"]) ||
//     JSON.stringify(stateName) === JSON.stringify(["i"]) ||
//     JSON.stringify(stateName) === JSON.stringify(["i1"]) ||
//     JSON.stringify(stateName) === JSON.stringify(["nextStates"]) ||
//     JSON.stringify(stateName) === JSON.stringify(["winningStateName"]) ||
//     JSON.stringify(stateName) ===
//       JSON.stringify(["previousSiblingWinningStateName"])
//   ) {
//     if (isNumber(stateTree.value)) {
//       statesObject.states[statesObject.nextStateId] = numberWrapper();
//     } else if (isString(stateTree.value)) {
//       statesObject.states[statesObject.nextStateId] = stringWrapper();
//     } else if (isArray(stateTree.value)) {
//       console.log({ stateName, stateTree });
//       statesObject.states[statesObject.nextStateId] = arrayWrapper();
//     }
//     // console.log({ stateTree });
//     // console.log("here");
//     // statesObject.states[statesObject.nextStateId] = numberWrapper();
//     let x = statesObject.states[statesObject.nextStateId];
//     // Object.assign()
//     x.setId(statesObject.nextStateId);
//     x.setName(stateName);
//     x.setValue(stateTree.value);
//     x.setReferenceToStatesObject(statesObject);
//     console.log({ x });
//     // x.name = stateName;
//   } else {
//     // make state structure an object wrapper
//     let newState: State = {}; //stateWrapper(),

//     newState["name"] = stateName;

//     if (!isVariable) {
//       newState["stateRunCount"] = 0;
//     }
//     // console.log(stateName, stateName === ["levelId"]);
//     setAttribute(stateTree, newState, "functionCode", stateTree?.functionCode);
//     setAttribute(stateTree, newState, "next", stateTree?.next);
//     setAttribute(stateTree, newState, "start", stateTree?.start);
//     // if (JSON.stringify(stateName) === JSON.stringify(["levelId"])) {
//     //   // console.log("here");
//     //   // console.log({ stateTree });
//     //   // numberWrapper
//     //   newState.wrapper = numberWrapper(stateTree.value); // = { ...newState, ...stateTree.prototype };
//     //   // setAttribute(stateTree, newState, "value", stateTree);
//     // } else {
//     setAttribute(stateTree, newState, "value", stateTree?.value);
//     // }
//     setAttribute(stateTree, newState, "children", children);
//     setAttribute(stateTree, newState, "variables", variables);

//     statesObject.states[statesObject.nextStateId] = newState;
//     statesObject.states[statesObject.nextStateId]["id"] =
//       statesObject.nextStateId;
//   }
// };
const specialPrint = (object: any) => {
  // console.log({ object });
  console.log(JSON.parse(JSON.stringify(object)));
};
/*
redesign getStateNames
relationships are being captured by accessing things at the right time
there are no data structures being returned that represent the relationships

each state in the tree should be given an id
*/
const setIdsToStates = ({
  stateTree,
  idObject,
  stateNamesHaveLength1,
}: any) => {
  // console.log({ stateTree, stateName });
  // const keys = Object.keys(stateTree);
  // // const keyMapsToObject = keys.find(
  // //   (key) =>
  // //     Object.prototype.toString.call(stateTree[key]) === "[object Object]"
  // // );
  // /*
  //   if any of the below keys is inside stateTree
  //     we have reached a stop conditin
  //   */
  // let foundStop = false;
  // const stopKeys = ["functionCode", "start", "next", "children", "variables"];
  // stopKeys.forEach((stopKey) => {
  //   if (stopKey in stateTree) {
  //     foundStop = true;
  //   }
  // });
  // if (foundStop) {
  //   // console.log("at stop condition");
  //   // stop conditions for the full state name
  //   if ("children" in stateTree || "variables" in stateTree) {
  //     // console.log("at stop condition");
  //     // add state
  //     // collect data for state
  //     // names.push(stateName);
  //     // addState(statesObject, stateTree, stateName);
  //     // console.log("statesObject", JSON.parse(JSON.stringify(statesObject)));
  //     let variableData: any = {};
  //     if ("variables" in stateTree) {
  //       // variable states are added here
  //       // save variable names and id's for state
  //       Object.keys(stateTree.variables).forEach((variableName) => {
  //         names.push([variableName]);
  //         // console.log({
  //         //   variableName,
  //         //   variable: stateTree.variables[variableName],
  //         // });
  //         addState(
  //           statesObject,
  //           stateTree.variables[variableName],
  //           [variableName],
  //           [],
  //           {},
  //           true
  //         );
  //         const variableId = statesObject.nextStateId;
  //         variableData[variableName] = variableId;
  //       });
  //     }
  //     let childrenPaths: string[][] = [];
  //     if ("children" in stateTree) {
  //       // add state names from children into state's children list
  //       getSubStatePaths(stateTree.children, childrenPaths, []);
  //     }
  //     // add state here
  //     // console.log("variableData", JSON.parse(JSON.stringify(variableData)));
  //     // console.log("paths", JSON.parse(JSON.stringify(childrenPaths)));
  //     names.push(stateName);
  //     addState(
  //       statesObject,
  //       stateTree,
  //       stateName,
  //       childrenPaths,
  //       variableData,
  //       false
  //     );
  //     if ("children" in stateTree) {
  //       Object.keys(stateTree.children).forEach((child) => {
  //         getStateNames(
  //           stateTree.children[child],
  //           [child],
  //           names,
  //           statesObject
  //         );
  //       });
  //     }
  //   } else if (!("variables" in stateTree) && !("children" in stateTree)) {
  //     names.push(stateName);
  //     addState(statesObject, stateTree, stateName, [], {}, false);
  //   }
};
interface SetIdsParameters {
  stateTree: any;
  idObject: any;
}

const setIds = ({ stateTree, idObject }: SetIdsParameters) => {
  // console.log({ stateTree, idObject });
  // each state is the value after the state key

  if ("state" in stateTree) {
    stateTree["state"].id = idObject.id;
    idObject.id += 1;
    // if ("variables" in stateTree["state"]) {
    //   Object.keys(stateTree["state"].variables).forEach((variableName) => {
    //     stateTree["state"].variables[variableName].id = idObject.id;
    //     idObject.id += 1;
    //   });
    // }
    if ("children" in stateTree["state"]) {
      setIds({ stateTree: stateTree["state"].children, idObject });
    }
  }
  const stateContextNames = Object.keys(stateTree).filter(
    (key) => key !== "state"
  );

  stateContextNames.forEach((stateContextName) => {
    setIds({ stateTree: stateTree[stateContextName], idObject });
  });
};

const notState = (key: string) => {
  return key !== "state";
};
interface GetStateNames2Parameters {
  stateTree: any;
  stateName: string[];
  stateNames: any[];
}
const getStateNames2 = ({
  stateTree,
  stateName,
  stateNames,
}: GetStateNames2Parameters) => {
  // console.log({ stateTree, stateName, stateNames });
  if ("state" in stateTree) {
    stateNames.push({ stateName, id: stateTree["state"].id });
    if ("children" in stateTree["state"]) {
      getStateNames2({
        stateTree: stateTree["state"].children,
        stateName: [],
        stateNames,
      });
    }
  }
  const stateContextNames = Object.keys(stateTree).filter((key) =>
    notState(key)
  );

  stateContextNames.forEach((stateContextName) => {
    getStateNames2({
      stateTree: stateTree[stateContextName],
      stateName: [...stateName, stateContextName],
      stateNames,
    });
  });
};

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
  // console.log({ node, paths, currentPath });
  if ("state" in node) {
    paths.push(currentPath);
  }
  const stateContextNames = Object.keys(node).filter((key) => notState(key));
  // console.log({ stateContextNames });
  stateContextNames.forEach((stateContextName) => {
    getSubStatePaths2({
      node: node[stateContextName],
      paths,
      currentPath: [...currentPath, stateContextName],
    });
  });
};
interface GetStatesParameters {
  stateTree: any;
  states: any;
}

const getStates = ({ stateTree, states }: GetStatesParameters) => {
  // console.log({ stateTree, states });
  if ("state" in stateTree) {
    // make new copy so this function doesn't interfere with getStateNames2
    states[stateTree["state"].id] = { ...stateTree["state"] };
    if ("children" in stateTree["state"]) {
      let childrenPaths: string[][] = [];
      getSubStatePaths2({
        node: stateTree["state"].children,
        paths: childrenPaths,
        currentPath: [],
      });
      states[stateTree["state"].id].children = childrenPaths;
      getStates({ stateTree: stateTree["state"].children, states });
    }
  }
  const stateContextNames = Object.keys(stateTree).filter((key) =>
    notState(key)
  );

  stateContextNames.forEach((stateContextName) => {
    getStates({ stateTree: stateTree[stateContextName], states });
  });
};

interface SetNamesParameters {
  names: any[];
  states: any[];
}

const setNames = ({ names, states }: SetNamesParameters) => {
  names.forEach((stateNameId) => {
    const i = stateNameId.id;
    states[i]["name"] = stateNameId.stateName;
  });
};

interface GetVariablesParameters {
  json: any;
  jsonName: string;
  variables: any;
}

const getVariables = ({
  json,
  jsonName,
  variables, // collection, collection.push(newVariable)
}: GetVariablesParameters) => {
  // console.log({ maxId: variables.nextStateId });
  // variables.nextStateId += lastStateId;
  if (isBoolean(json)) {
    let newVariable = booleanWrapper();
    newVariable.setValue(json);
    newVariable.setName(jsonName);
    // variables.push(newVariable);
    // newVariable.setId(variables.length - 1);
    // return variables.length - 1;
    variables.nextStateId += 1;
    variables.states[variables.nextStateId] = newVariable;
    return variables.nextStateId;
  } else if (isNumber(json)) {
    let newVariable = numberWrapper();
    newVariable.setValue(json);
    newVariable.setName(jsonName);
    // variables.push(newVariable);
    // newVariable.setId(variables.length - 1);
    // return variables.length - 1;
    variables.nextStateId += 1;
    variables.states[variables.nextStateId] = newVariable;
    return variables.nextStateId;
  } else if (isString(json)) {
    let newVariable = stringWrapper();
    newVariable.setValue(json);
    newVariable.setName(jsonName);
    // variables.push(newVariable);
    // newVariable.setId(variables.length - 1);
    // return variables.length - 1;
    variables.nextStateId += 1;
    variables.states[variables.nextStateId] = newVariable;
    return variables.nextStateId;
  } else if (isArray(json)) {
    let newVariable = arrayWrapper();
    newVariable.setValue([]);
    newVariable.setName(jsonName);
    newVariable.value = json.map((element: any, i: number) => {
      getVariables({
        json: element,
        jsonName: `${i}`,
        variables,
      });
    });
    // variables.push(newVariable);
    // newVariable.setId(variables.length - 1);
    // return variables.length - 1;
    variables.nextStateId += 1;
    variables.states[variables.nextStateId] = newVariable;
    return variables.nextStateId;
  } else if (isObject(json)) {
    let newVariable = objectWrapper();
    newVariable.setValue({});
    newVariable.setName(jsonName);
    Object.keys(json).forEach((key) => {
      newVariable.value[key] = getVariables({
        json: json[key],
        jsonName: key,
        variables,
      });
    });
    // variables.push(newVariable);
    // newVariable.setId(variables.length - 1);
    // return variables.length - 1;
    variables.nextStateId += 1;
    variables.states[variables.nextStateId] = newVariable;
    return variables.nextStateId;
  }
};
// const getStateNames = (
//   stateTree: any,
//   stateName: any,
//   names: any,
//   statesObject: any
// ) => {
//   console.log({ stateTree, stateName });
//   const keys = Object.keys(stateTree);
//   // const keyMapsToObject = keys.find(
//   //   (key) =>
//   //     Object.prototype.toString.call(stateTree[key]) === "[object Object]"
//   // );
//   /*
//     if any of the below keys is inside stateTree
//       we have reached a stop conditin
//     */
//   let foundStop = false;
//   const stopKeys = ["functionCode", "start", "next", "children", "variables"];
//   stopKeys.forEach((stopKey) => {
//     if (stopKey in stateTree) {
//       foundStop = true;
//     }
//   });
//   if (foundStop) {
//     // console.log("at stop condition");
//     // stop conditions for the full state name
//     if ("children" in stateTree || "variables" in stateTree) {
//       // console.log("at stop condition");
//       // add state
//       // collect data for state
//       // names.push(stateName);
//       // addState(statesObject, stateTree, stateName);
//       // console.log("statesObject", JSON.parse(JSON.stringify(statesObject)));
//       let variableData: any = {};
//       if ("variables" in stateTree) {
//         // variable states are added here
//         // save variable names and id's for state
//         Object.keys(stateTree.variables).forEach((variableName) => {
//           names.push([variableName]);
//           // console.log({
//           //   variableName,
//           //   variable: stateTree.variables[variableName],
//           // });
//           addState(
//             statesObject,
//             stateTree.variables[variableName],
//             [variableName],
//             [],
//             {},
//             true
//           );
//           const variableId = statesObject.nextStateId;
//           variableData[variableName] = variableId;
//         });
//       }
//       let childrenPaths: string[][] = [];

//       if ("children" in stateTree) {
//         // add state names from children into state's children list
//         getSubStatePaths(stateTree.children, childrenPaths, []);
//       }
//       // add state here
//       // console.log("variableData", JSON.parse(JSON.stringify(variableData)));
//       // console.log("paths", JSON.parse(JSON.stringify(childrenPaths)));
//       names.push(stateName);
//       addState(
//         statesObject,
//         stateTree,
//         stateName,
//         childrenPaths,
//         variableData,
//         false
//       );
//       if ("children" in stateTree) {
//         Object.keys(stateTree.children).forEach((child) => {
//           getStateNames(
//             stateTree.children[child],
//             [child],
//             names,
//             statesObject
//           );
//         });
//       }
//     } else if (!("variables" in stateTree) && !("children" in stateTree)) {
//       names.push(stateName);
//       addState(statesObject, stateTree, stateName, [], {}, false);
//     }
//   }

//   // continue down the state name path
//   const filteredKeys = keys.filter(
//     (key) =>
//       !["functionCode", "start", "next", "children", "variables"].includes(key)
//   );
//   if (filteredKeys.length > 0) {
//     filteredKeys.forEach((key) => {
//       getStateNames(stateTree[key], [...stateName, key], names, statesObject);
//     });
//   }
// };

export {
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
  // getStateNames,
};
