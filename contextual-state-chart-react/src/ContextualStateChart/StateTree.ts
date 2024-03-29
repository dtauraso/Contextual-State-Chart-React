import { insertName } from "./Init/TrieTree";
import { Graph, NamesTrie, States } from "../App.types";
import { calculatorStateTree } from "../Calculator/CalculatorStateTree";
import { returnTrue } from "../Calculator/CalculatorStateFunctions";
import { getRunningStateParent, getRunningState } from "./Visitor";
import {
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject,
} from "./Init/StatesObject";

const wrapper = {
  setId: function setId(this: any, id: number) {
    this.id = id;
  },
  setName: function setName(this: any, name: any) {
    this.name = name;
  },
  setValue: function setValue(this: any, value: any) {
    this.value = value;
    this.records = {};
    this.records = {
      ...this.records,
      [Object.keys(this.records).length]: value,
    };
  },
  updateValue: function updateValue(this: any, value: any) {
    this.value = value;
    // this.records = {
    //   ...this.records,
    //   [Object.keys(this.records).length]: { id, value },
    // };
    // console.log("here", this.records);
  },
  updateRecord: function updateRecord(this: any, { id, value }: any) {
    this.records = {
      ...this.records,
      [Object.keys(this.records).length]: { id, value },
    };
  },
  init: function init(
    this: any,
    id: number,
    name: any,
    value: any,
    typeName: string
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.typeName = typeName;
    this.records = {};
  },
  setStates: function setStates(this: any, states: States) {
    this.states = states;
  },
  setReferenceToStatesObject: function setReferenceToStatesObject(
    this: any,
    statesObject: any
  ) {
    this.statesObject = statesObject;
  },
};
const nullWrapper = function () {
  return Object.create({
    __proto__: wrapper,
  });
};
const booleanWrapper = function () {
  return Object.create({
    __proto__: wrapper,
  });
};
const numberWrapper = function () {
  return Object.create({
    __proto__: wrapper,

    add: function add(this: any, secondValue: number) {
      // console.log(this, secondValue);
      this.value = this.value + secondValue;
      // if graph recording flag is active then record
      this.records = {
        ...this.records,
        [Object.keys(this.records).length]: this.value,
      };
      return this;
    },
    subtract: function subtract(this: any, secondValue: number) {
      // console.log(this, secondValue);
      this.value = this.value - secondValue;
      this.records = {
        ...this.records,
        [Object.keys(this.records).length]: this.value,
      };
      return this;
    },
  });
};
const stringWrapper = function () {
  return Object.create({
    __proto__: wrapper,
  });
};
const arrayWrapper = function () {
  return Object.create({
    __proto__: wrapper,
    get: function get(this: any, i: any) {
      const length = this.value.length;
      // console.log(this, i);
      if (i.value < 0 || i.value >= length) {
        return this;
      }
      return this.value[i];
    },
    mapWrapper: function mapWrapper(this: any, callback: any) {
      /*
      make new array
      make dummy items of the same data(set values to null) as current array
      loop through old array and apply f(old[i]) => new[j] to new array
      */
      // no direct connection to the state calling this function
      // would work if _this = full graph
      // make sure each variable has access to top of graph
      let states = this.states;
      console.log("here", this, states);

      this.value.forEach((a: any, i: number, m: any) => {
        states[a].records[i] = {
          value: callback(states[a], i, m),
          changedStatus: "modified",
        };
      });

      let container = [];
      for (let i = 0; i < states[this.id].value.length; i++) {
        let elementState = states[states[this.id].value[i]];
        let result = callback(elementState.value, i, states);
        const { id, name, value, typeName } = elementState;
        let newIndex = Object.keys(states).length;

        let newItem = variableTypes[elementState.typeName]();
        newItem.init(newIndex, name, result, typeName);
        newItem.setStates(states);
        states[newIndex] = newItem;

        container.push(newIndex);
      }
      let newContainerIndex = Object.keys(states).length;

      let newContainer = variableTypes["array"]();
      let numberString = "";
      for (
        let i = this.name.length - 1;
        i >= 0 && this.name[i] >= "0" && this.name[i] <= "9";
        i++
      ) {
        numberString = this.name[i] + numberString;
      }
      const number = numberString.length > 0 ? Number(numberString) : 0;

      const originalName = this.name.slice(
        0,
        this.name.length - numberString.length
      );
      newContainer.init(
        newContainerIndex,
        `${originalName}${number + 1}`,
        null,
        "array"
      );
      newContainer.setStates(states);
      newContainer.updateValue(container);
      newContainer.updateRecord({ id: this.id, value: this.value });
      states[newContainerIndex] = newContainer;

      return newContainer;
    },
    clean: function clean() {
      // use record property to find each id of the previous arrays
      // erase the arrays found
      // return this
    },
    mapWrapperState: function mapWrapperState(
      this: any,
      callback: any,
      _this: any
    ) {
      // const newArray = [];
      // console.log("this", this.value, "callback", callback, "_this", _this);
      let m = this.value;
      let graph = _this;
      // console.log("prior records", JSON.parse(JSON.stringify(this.records)));
      m.forEach((a: any, i: number, m: any) => {
        this.records[i] = {
          value: callback(a, i, m),
          changedStatus: "modified",
        };
      });
      this.value = this.value.map((x: any, i: number, m: any) =>
        callback(graph[this.value[i]], i, m)
      );
      // console.log(this.value);
      return this;
    },
    pushWrapper: function pushWrapper(this: any, _this: any) {
      this.newIndex = this.value.push(_this);
      return this;
    },
    generic: function generic(this: any, callbackName: any, _this?: any) {
      console.log(this, callbackName, _this);
      console.log(callbackName);
      let a = this.value;
      // let v: Array<any> = [];
      if (_this === undefined) {
        a[callbackName]();
      } else {
        a[callbackName](_this);
      }
      // console.log(a);
      return this;
    },
  });
};
const objectWrapper = function () {
  return Object.create({
    __proto__: wrapper,
  });
};
const stateWrapper = function () {
  return Object.create({
    __proto__: wrapper,
  });
};
const variableTypes: any = {
  null: nullWrapper,
  boolean: booleanWrapper,
  number: numberWrapper,
  string: stringWrapper,
  array: arrayWrapper,
  object: objectWrapper,
};

// import { numberWrapper } from "../App";
let stateTree = {
  tree: {
    state: {
      functionCode: returnTrue,
      start: ["calculator"],
      children: {
        ...calculatorStateTree,
        "run state machine": {
          calculator: {
            bottom: {
              state: {
                children: {
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
      },
      variables: {
        levelId: { value: 0 },
        timeLineId: { value: 0 },
        machineRunId: { value: 0 },
        // encode state names as strings
        // assumes users will be working on a small # of states at a time
        statesToRecord: { calculator: { value: 1 } },
        bottomName: [
          { value: "run state machine" },
          { value: "calculator" },
          { value: "bottom" },
        ],
      },
    },
  },
};
const getStateId = (namesTrie: NamesTrie, stateName: string[]) => {
  // console.log({ namesTrie, stateName });
  let stateId: number = 0;
  let namesTrieTracker = namesTrie;
  let isFound = true;
  if (typeof stateName === "string") {
    console.log(`${stateName} is not an array`);
    return -1;
  }
  if (stateName === undefined) {
    console.log("stateName is not defined");
    return -1;
  }
  stateName.forEach((namePart: string) => {
    if (!isFound) {
      return;
    }
    if (namePart in namesTrieTracker) {
      if ("id" in namesTrieTracker[namePart]) {
        stateId = namesTrieTracker[namePart]?.id;
      }
      namesTrieTracker = namesTrieTracker[namePart];
    } else {
      isFound = false;
    }
  });
  if (!isFound) {
    return -1;
  }
  return stateId;
};
const getState = (graph: any, stateName: string[]) => {
  // console.log({ stateName });
  if (stateName === null) {
    return null;
  }
  const stateId = getStateId(graph.namesTrie, stateName);
  if (!(stateId in graph.statesObject.states)) {
    console.log(
      `stateId = ${stateId}, stateName = ${stateName} is not in graph.statesObject.states`
    );
    return false;
  }
  return graph.statesObject.states[stateId];
};
const getVariable = (
  graph: any,
  parentDataStateName: string[],
  variableName: any
) => {
  // console.log({ stateName, graph });
  if (parentDataStateName === undefined) {
    return null;
  }
  const parentDataState = getState(graph, parentDataStateName);
  // console.log({ state });
  if ("variables" in parentDataState) {
    if (variableName in parentDataState.variables) {
      const variableId = parentDataState.variables[variableName];
      // {variableName: {stateName, value}}
      const parentDataStateNameString = parentDataStateName.join(",");
      // console.log("get", { variableName, stateNameString });
      // missing the running state's parent
      let runningStateNameParentString =
        getRunningStateParent(graph)?.name.join(",");
      // relocate changes to graph.statesObject
      graph["changes"] = {
        ...graph["changes"],
        variables: {
          ...graph["changes"]["variables"],
          [variableName]: {
            setFunctionWasCalled: false,
            parentDataStateNameString,
            value: null,
          },
        },
      };
      // console.log("get changes", JSON.parse(JSON.stringify(graph["changes"])));

      return graph.statesObject.states[variableId];
    }
  }
  return null;
};
const setVariable = (graph: Graph, variableName: string, newValue: any) => {
  // console.log({ graph, state, variableName, newValue });
  /*
  record state

  stateName.join(","): {
     parentDataStateNameString: {
          var1
          var2
          var3
    }
  }
   
  
  if argument object is empty
    don't make a record state
  if record state exists
    update the "after" child state
  else
    setup record state
  */
  /*
 array method wrapper functions
 save the entry to be changed
 {i: {entry, modificationStatus}}

 map, filter, reduce
 object
  value
  changes: {i: {entry_before_change_entry, modification_status}}
  object.proto.mapWrapper
  object.proto.filterWrapper
  object.proto.reduceWrapper
 */
  const parentDataStateName =
    graph["changes"]["variables"][
      variableName
    ]?.parentDataStateNameString.split(",");
  const parentDataState = getState(graph, parentDataStateName);
  if (!(variableName in parentDataState.variables)) {
    return;
  }
  /**
   * save the change data from the user in a js object
   */
  /**
   * {variableName: {parentDataStateNameString, newValue}}
   */

  graph["changes"] = {
    ...graph["changes"],
    variables: {
      ...graph["changes"]["variables"],
      [variableName]: {
        ...graph["changes"]["variables"][variableName],
        setFunctionWasCalled: true,
        value: newValue,
      },
    },
  };
  const variableId: number = parentDataState.variables[variableName];
  // graph.statesObject.states[variableId].value = newValue;
};
const printRecordTree = (graph: any, recordTreeRootName: string[]) => {
  let recordTreeRoot = getState(graph, recordTreeRootName);
  let afterState = getState(graph, recordTreeRoot.children[0]);

  console.log("added record state", JSON.parse(JSON.stringify(recordTreeRoot)));
  console.log("added record state", JSON.parse(JSON.stringify(afterState)));
  if ("variables" in afterState) {
    Object.keys(afterState?.variables).forEach((variableName) => {
      console.log(
        "added record state",
        JSON.parse(JSON.stringify(variableName)),
        JSON.parse(
          JSON.stringify(
            graph.statesObject.states[afterState.variables[variableName]].value
          )
        )
      );
    });
  }
  console.log();
};
// const insertVariableState = (graph: any, state: any, variable: any) => {
//   // variable is the new variable state
//   // console.log({ variable });
//   // fix for data structure update
//   // new variable state is inside graph.states
//   graph.statesObject.maxStateId += 1;
//   if (
//     JSON.stringify(variable.name) === JSON.stringify(["levelId"]) ||
//     JSON.stringify(variable.name) === JSON.stringify(["timeLineId"]) ||
//     JSON.stringify(variable.name) === JSON.stringify(["machineRunId"]) ||
//     JSON.stringify(variable.name) === JSON.stringify(["j"]) ||
//     JSON.stringify(variable.name) === JSON.stringify(["nextStates"]) ||
//     JSON.stringify(variable.name) === JSON.stringify(["winningStateName"]) ||
//     JSON.stringify(variable.name) ===
//       JSON.stringify(["previousSiblingWinningStateName"])
//   ) {
//     console.log("here insertVariableState");
//     // graph.statesObject.states[graph.statesObject.maxStateId] = numberWrapper();
//     if (isNumber(variable.value)) {
//       graph.statesObject.states[graph.statesObject.maxStateId] =
//         numberWrapper();
//     } else if (isString(variable.value)) {
//       graph.statesObject.states[graph.statesObject.maxStateId] =
//         stringWrapper();
//     } else if (isArray(variable.value)) {
//       // console.log({ stateName: variable.name, stateTree });
//       graph.statesObject.states[graph.statesObject.maxStateId] = arrayWrapper();
//     }
//     let x = graph.statesObject.states[graph.statesObject.maxStateId];
//     // Object.assign()
//     x.setId(graph.statesObject.maxStateId);
//     x.setName(variable.name);
//     x.setValue(variable.value);
//     x.setReferenceToStatesObject(graph.statesObject);

//     console.log({ x });
//     state.variables[x.name[0]] = graph.statesObject.maxStateId;
//     // x.name = stateName;
//   } else {
//     graph.statesObject.states[graph.statesObject.maxStateId] = variable;
//     // graph.states.push(variable);
//     // new variable state name is inside state.variableNames
//     state.variables[variable.name[0]] = graph.statesObject.maxStateId;
//   }
// };
// const insertState = (graph: any, state: any, variables: any = {}) => {
//   // inserts state and variables
//   graph.statesObject.maxStateId += 1;
//   const { tree, updatedName } = insertName({
//     names: graph.namesTrie,
//     name: state.name,
//     stateId: graph.statesObject.maxStateId,
//   });
//   // console.log({ graph });
//   graph.namesTrie = tree;
//   // console.log({ updatedName });
//   state.name = updatedName;
//   if (Object.keys(variables).length > 0) {
//     state["variables"] = {};
//   }
//   graph.statesObject.states[graph.statesObject.maxStateId] = state;
//   // only works for variable names of 1 dimention
//   // the variable can only be accesible from the current state
//   // each state can only have 1 unique user defined variable name
//   // all variables need to be 1 dimentional
//   Object.keys(variables).forEach((variableName: string) => {
//     // do not insert variable names into the main graph
//     // duplicate names are ok as long as their id number is different(variable names only)
//     insertVariableState(graph, state, {
//       name: [variableName],
//       value: variables[variableName],
//     });
//   });
//   console.log(graph);

//   return updatedName;
// };
const deleteNodes = (graph: any, name: any) => {
  // console.log({ node, name });
  deleteNodesHelper(graph.namesTrie, graph.statesObject.states, name);
};
const deleteNodesHelper = (namesTrie: any, states: any, name: any) => {
  // console.log({ namesTrie });
  if (name.length === 0) {
    if ("id" in namesTrie) {
      // console.log({ id: namesTrie.id });
      delete states[namesTrie.id];
      delete namesTrie.id;
    }
  } else if (name[0] in namesTrie) {
    deleteNodesHelper(namesTrie[name[0]], states, name.slice(1, name.length));
    // namesTrie[name[0]].id has been deleted
    if (Object.keys(namesTrie[name[0]]).length === 0) {
      // console.log({ node });
      delete namesTrie[name[0]];
    }
  }
};

export {
  nullWrapper,
  booleanWrapper,
  numberWrapper,
  stringWrapper,
  arrayWrapper,
  objectWrapper,
  stateWrapper,
  stateTree,
  getStateId,
  getState,
  getVariable,
  setVariable,
  // insertVariableState,
  // insertState,
  deleteNodes,
  deleteNodesHelper,
  printRecordTree,
};
