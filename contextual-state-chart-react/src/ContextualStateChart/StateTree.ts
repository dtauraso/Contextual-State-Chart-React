import { insertName } from "./Init/TrieTree";
import {
  Graph,
  NamesTrie,
  State,
  States,
  Edge,
  Edges,
  Variable,
  TreeBottom,
  Tree,
} from "../App.types";
import { calculatorStateTree } from "../Calculator/CalculatorStateTree";
import { NFAStateTree } from "../NFA/NFAStateTree";
import { StartbucksStateTree } from "../NFA/StarbucksTree";
import { returnTrue } from "../Calculator/CalculatorStateFunctions";
import { getRunningStateParent, getRunningState } from "./Visitor";
import {
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject,
} from "./Init/StatesObject";
import { makeArrays, makeVariable } from "./Init/ContextualStateChartInit";
enum ChangeStatus {
  NONE,
  ADDED,
  MODIFIED,
  DELETED,
}
const { NONE, ADDED, MODIFIED, DELETED } = ChangeStatus;
let stateTree = {
  tree: {
    state: {
      functionCode: returnTrue,
      // start: ["calculator"],
      // children: {
      //   ...calculatorStateTree,
      // },
      start: [["NFA"]],
      children: {
        ...StartbucksStateTree,
      },
      variables: {
        levelId: { value: 0 },
        timeLineId: { value: 0 },
        machineRunId: { value: 0 },
        stateRunCount: { value: 0 },
        // encode state names as strings
        // assumes users will be working on a small # of states at a time
        statesToRecord: { calculator: { value: 1 } },
      },
    },
  },
};
const printTree = function (this: Graph) {};
const convertToJson = function (this: Graph) {};

const stateWrapper = function (): State {
  return Object.create({
    getVariable,
    init: function init(
      this: any,
      {
        id,
        parents,
        name,
        functionCode,
        functionName,
        edgeGroups,
        children,
        variables,
        graph,
        haveStartChildren,
        timelineIDs,
        runTree,
      }: any
    ) {
      this.id = id;
      this.parents = parents;
      this.name = name;
      this.functionCode = functionCode;
      this.functionName = functionName;
      this.edgeGroups = edgeGroups;
      this.children = children;
      this.branchIDVariableID = variables;
      this.stateRunCount = 0;
      this.getVariables = getVariables;
      this.getVariable = getVariable;
      this.graph = graph;
      this.runTree = runTree;
      this.branchIDParentIDParentBranchID = {};
      this.haveStartChildren = haveStartChildren;
      this.timelineIDs = timelineIDs;
    },
    initVariable: function (
      this: any,
      { id, name, value, typeName, runTree, graph }: any
    ) {
      this.init({ name, id, graph });
      this.currentValue = variableWrapper();
      this.currentValue.init({ value, typeName, runTree, graph });
    },
    getInitVariables: function (this: any) {
      if ("init" in this?.branchIDVariableID) {
        return this.graph.getStateById(this?.branchIDVariableID["init"]);
      }
    },
    getVariableBranches: function (this: any): string[] {
      return Object.keys(this?.branchIDVariableID);
    },
    getValueFromBranch: function (this: State, variableName: string) {
      const typeName = this?.currentValue?.variableTypeName;
      if (typeName === "[object Object]") {
        return this?.currentValue?.stringMapNumberValue?.[
          variableName
        ] as number;
      }
    },
    getValue: function (this: State): any {
      const typeName = this?.currentValue?.variableTypeName;
      if (typeName === "[object Boolean]") {
        return this?.currentValue?.booleanValue;
      } else if (typeName === "[object Number]") {
        return this?.currentValue?.numberValue;
      } else if (typeName === "[object String]") {
        return this?.currentValue?.stringValue;
      } else if (typeName === "[object Array]") {
        return this?.currentValue?.numberArrayValue;
      } else if (typeName === "[object Object]") {
        return this?.currentValue?.stringMapNumberValue;
      }
    },
    variableTreeToInitJson: function variableTreeToJson(this: State) {
      const variable = this.currentValue as Variable;
      const convertVariableTreeToInitJson = (variable: Variable): any => {
        const typeName = variable.variableTypeName;
        if (typeName === "[object Boolean]") {
          return { value: variable.booleanValue };
        } else if (typeName === "[object Number]") {
          return { value: variable.numberValue };
        } else if (typeName === "[object String]") {
          return { value: variable.stringValue };
        } else if (typeName === "[object Array]") {
          return (variable.numberArrayValue ?? []).map((stateID: number) =>
            convertVariableTreeToInitJson(
              this.graph?.getStateById(stateID).currentValue as Variable
            )
          );
        } else if (typeName === "[object Object]") {
          return Object.keys(variable.stringMapNumberValue ?? []).reduce(
            (acc: any, key: any) => ({
              ...acc,
              [key]: convertVariableTreeToInitJson(
                this.graph?.getStateById(
                  variable.stringMapNumberValue?.[key] as number
                ).currentValue as Variable
              ),
            }),
            {}
          );
        }
      };
      return convertVariableTreeToInitJson(variable as Variable);
    },
    visitState: function visitState(this: any) {},

    getParent: function getParent(this: any) {
      // only return parent when state is done running children and nexts
      console.log({ this: this });
      // assumes there is only 1 parent
      return this.graph.getState(this.parents[0]);
    },
    getChildren: function getChildren(this: any) {
      // only return children when state is done trialling children
    },
    getEdges: function (this: State, edgesGroupIndex: number): Edges {
      if (!this.edgeGroups) {
        return {
          edges: [],
          areParallel: false,
        };
      }
      const length = this.edgeGroups.length;
      if (edgesGroupIndex < 0 || edgesGroupIndex >= length) {
        return {
          edges: [],
          areParallel: false,
        };
      }
      return this.edgeGroups[edgesGroupIndex];
    },
    areEdgesStart: function (this: State, edgesGroupIndex: number): boolean {
      const { haveStartChildren, edgeGroups } = this;

      if (!edgeGroups) {
        return false;
      }
      const length = edgeGroups.length;

      if (edgesGroupIndex < 0 || edgesGroupIndex >= length) {
        console.log("error", { edgesGroupIndex, length });
        return false;
      }
      return haveStartChildren && edgesGroupIndex === 0;
    },
    // isStartEmpty: function (this: ControlFlowState): boolean {
    //   return this.start ? this.start.length === 0 : false;
    // },
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

    // at: function at(this: any, i: NumberState) {
    //   return this.value[i.value];
    // },
    concat: function concat(this: any, b: string) {
      return this.value + b;
    },
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
    genericReturnValue: function generic(
      this: any,
      callback: Function,
      b: any
    ) {
      // console.log({ this: this, callback, b });
      // console.log(callbackName);
      // let a = this.valu
      // let v: Array<any> = [];
      if (b == null) {
        return -1;
      }
      return callback(this.value, b.value);
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
    updateVRAtom: function updateVRAtom(this: any, value: any) {
      this.records = {
        ...this.records,
        [Object.keys(this.records).length]: { id: this.id, value: this.value },
      };
      this.value = value;
    },
    // init: function init(this: any, { id, name, value, typeName }: any) {
    //   this.id = id;
    //   this.name = name;
    //   this.value = value;
    //   this.typeName = typeName;
    //   this.changeStatus = ADDED;
    //   if (
    //     typeName === "boolean" ||
    //     typeName === "number" ||
    //     typeName === "string"
    //   ) {
    //     this.prevValue = null;
    //   } else if (typeName === "array" || typeName === "object") {
    //     this.valueIDsChanged = {};
    //   }
    //   console.log({ this: this });
    // },
    setGraph: function setGraph(this: any, graph: Graph) {
      this.graph = graph;
    },
    setReferenceToStatesObject: function setReferenceToStatesObject(
      this: any,
      statesObject: any
    ) {
      this.statesObject = statesObject;
    },

    get: function get(this: any, i: any) {
      // console.log(this, i);
      if (!this.value[i]) {
        return -1;
      }
      return this.value[i];
    },
    // get: function get(this: any, i: number) {
    //   const length = this.value.length;
    //   // console.log(this, i);
    //   if (i < 0 || i >= length) {
    //     return -1;
    //   }
    //   return this.graph.statesObject.states[this.value[i]];
    //   // return this.value[i];
    // },
    collect: function collect(this: any) {
      // put json back together
      // console.log({
      //   graph: this.graph,
      //   ids: this.value,
      //   items: this.value.map((variableId: number) =>
      //     this.graph.getVariableById(variableId)
      //   ),
      // });
      return this.value.map(
        (variableId: number) => this.graph.getVariableById(variableId).value
      );
    },
    // at: function at(this: any, i: NumberState) {
    //   return this.value[i.value];
    // },
    // mapWrapper: function mapWrapper(this: any, callback: any) {
    //   /*
    //   make new array
    //   make dummy items of the same data(set values to null) as current array
    //   loop through old array and apply f(old[i]) => new[j] to new array
    //   */
    //   let states = this.states;

    //   this.value.forEach((a: any, i: number, m: any) => {
    //     states[a].records[i] = {
    //       value: callback(states[a], i, m),
    //       changedStatus: "modified",
    //     };
    //   });

    //   let container = [];
    //   for (let i = 0; i < states[this.id].value.length; i++) {
    //     let elementState = states[states[this.id].value[i]];
    //     let result = callback(elementState.value, i, states);
    //     const { id, name, value, typeName } = elementState;
    //     let newIndex = Object.keys(states).length;

    //     let newItem = variableTypes[elementState.typeName]();
    //     newItem.init(newIndex, name, result, typeName);
    //     newItem.setGraphs(states);
    //     states[newIndex] = newItem;

    //     container.push(newIndex);
    //   }
    //   let newContainerIndex = Object.keys(states).length;

    //   let newContainer = variableTypes["array"]();
    //   let numberString = "";
    //   for (
    //     let i = this.name.length - 1;
    //     i >= 0 && this.name[i] >= "0" && this.name[i] <= "9";
    //     i++
    //   ) {
    //     numberString = this.name[i] + numberString;
    //   }
    //   const number = numberString.length > 0 ? Number(numberString) : 0;

    //   const originalName = this.name.slice(
    //     0,
    //     this.name.length - numberString.length
    //   );
    //   newContainer.init(
    //     newContainerIndex,
    //     `${originalName}${number + 1}`,
    //     null,
    //     "array"
    //   );
    //   newContainer.setGraphs(states);
    //   newContainer.updateValue(container);
    //   newContainer.updateRecord({ id: this.id, value: this.value });
    //   states[newContainerIndex] = newContainer;

    //   return newContainer;
    // },
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
      this.records = {
        ...this.records,
        [Object.keys(this.records).length]: {
          id: this.id,
          value: [...this.value],
        },
      };
      const newVariableId = makeVariable({
        trieTreeCollection: null, //[],
        stateTree: {
          value: _this,
        },
        indexObject: this.graph.statesObject,
        name: `${this.value.length}`,
        graph: this.graph,
      });
      this.value.push(newVariableId);

      return this;
    },
    updateAt: function updateAt(this: any, i: number, newValue: number) {
      this.records = {
        ...this.records,
        [Object.keys(this.records).length]: {
          id: this.id,
          value: this.value[i],
        },
      };
      console.log({ newValue, graph: this.graph });
      const newVariableId = makeVariable({
        trieTreeCollection: [],
        stateTree: newValue,
        indexObject: this.graph.statesObject,
        name: `${i}`,
        graph: this.graph,
      });
      this.value[i] = newVariableId; //this.graph.statesObject.maxIndexId - 1; //newValue;
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
const variableWrapper = function (): Variable {
  return Object.create({
    init: function (this: any, { value, typeName, runTree, graph }: any) {
      if (typeName === "[object Boolean]") {
        this.booleanValue = value;
      } else if (typeName === "[object Number]") {
        this.numberValue = value;
      } else if (typeName === "[object String]") {
        this.stringValue = value;
      } else if (typeName === "[object Array]") {
        this.numberArrayValue = value;
      } else if (typeName === "[object Object]") {
        this.stringMapNumberValue = value;
      }
      this.variableTypeName = typeName;
      this.runTree = runTree;
      this.graph = graph;
    },

    setValue: function (
      this: Variable,
      functionName: string,
      args: any[],
      functionResult?: any
    ) {
      const typeName = this.variableTypeName;
      if (typeName === "[object Boolean]") {
        this.prevValue = this.booleanValue;
      } else if (typeName === "[object Number]") {
        this.prevValue = this.numberValue;
        this.changeStatus = MODIFIED;
        this.numberValue = functionResult;
      } else if (typeName === "[object String]") {
        this.prevValue = this.stringValue;
      } else if (typeName === "[object Array]") {
        this.prevValue = this.numberArrayValue;
        if (functionName === "unshift") {
          this.valueIDsChangedStatus["0"] = {
            changedStatus: ADDED,
            previousValue: null,
          };
          // add new state with name, value ("0", arg[1])
          // this.graph?.statesObject.states[0];
          // args[1] = state id
          this.numberArrayValue?.unshift(...args);
        } else if (functionName === "at") {
          const position = this.numberArrayValue?.at(args[0]) as number;
          const state = this.graph?.statesObject.states[position];
          return state?.getValue();
        }
      } else if (typeName === "[object Object]") {
        this.prevValue = this.stringMapNumberValue;
      }
    },
  });
};

const getStateId = (namesTrie: NamesTrie, stateName: string[]) => {
  // console.log({ namesTrie, stateName });
  let namesTrieTracker = namesTrie;
  if (typeof stateName === "string") {
    console.log(`${stateName} is not an array`);
    return -1;
  }
  if (stateName === undefined) {
    console.log("stateName is not defined");
    return -1;
  }
  for (let i = 0; i < stateName.length; i++) {
    const namePart = stateName[i];
    if (namePart in namesTrieTracker) {
      namesTrieTracker = namesTrieTracker[namePart];
    } else {
      return -1;
    }
  }
  if ("id" in namesTrieTracker) {
    // console.log("here", { namesTrieTracker });
    return namesTrieTracker.id as number;
  }
  return -1;
};
// const errorState = function (): ControlFlowState {
//   return {
//     parents: [[""]],
//     name: [""],
//     functionCode: (graph: any) => false,
//     functionName: "",
//     children: [[""]],
//     edgeGroups: [],
//     haveStartChildren: false,
//     stateRunCount: 0,
//     id: -1,
//     branchIDParentIDParentBranchID: {},
//     areChildrenParallel: false,
//     areNextParallel: false,
//     destinationTimeline: "",
//     timelineIDs: {},
//     getVariables: function (this: ControlFlowState) {
//       return {};
//     },
//     getVariable: function (this: ControlFlowState, variableName: string) {
//       return {
//         value: false,
//         id: -1,
//       };
//     },
//     getParent: function (this: ControlFlowState) {},
//     getEdges: function (
//       this: ControlFlowState,
//       edgesGroupIndex: number
//     ): Edges {
//       return {
//         edges: [],
//         areParallel: false,
//       };
//     },
//     isStartEmpty: function (): boolean {
//       return false;
//     },
//     areEdgesStart: function (
//       this: ControlFlowState,
//       edgesGroupIndex: number
//     ): boolean {
//       return false;
//     },
//   };
// };

const getState = function (this: Graph, stateName: string[]) {
  // console.log({ stateName });
  if (stateName === null) {
    console.log({ stateName });
  }
  const stateId = getStateId(this.namesTrie, stateName);

  if (!(stateId in this.statesObject.states)) {
    console.log(
      `stateId = ${stateId}, stateName = ${stateName} is not in graph.statesObject.states`
    );
  }
  return this.statesObject.states[stateId] as State;
};
const getStateById = function (this: Graph, stateId: number) {
  // console.log({ stateId });
  if (stateId >= this.statesObject.nextStateId || stateId < 0) {
    console.log({ stateId, nextStateId: this.statesObject.nextStateId });
  }

  if (!(stateId in this.statesObject.states)) {
    console.log(`stateId = ${stateId} is not in graph.statesObject.states`);
  }
  return this.statesObject.states[stateId] as State;
};
const getVariableById = function (this: Graph, stateId: number) {
  // console.log({ stateId, states: this.statesObject.states });
  if (stateId === undefined) return undefined;
  if (stateId >= this.statesObject.nextStateId || stateId < 0) {
    return -1;
  }

  if (!(stateId in this.statesObject.states)) {
    console.log(`stateId = ${stateId} is not in graph.statesObject.states`);
    return -1;
  }
  return this.statesObject.states[stateId];
};
const getVariables = function (this: any) {
  return this?.variables as Variable;
};
const getVariable = function (
  this: any,
  // parentDataStateName: string[],
  variableName: string
) {
  if (typeof variableName === "object") {
    console.log(variableName, "must be a string");
    return -1;
  }

  const currentBranchID = this?.id;
  const branchStateID = this?.branchIDVariableID[currentBranchID];

  const branchState: State = this?.graph.statesObject.states[branchStateID];

  const variableState =
    this?.graph.statesObject.states[
      branchState.getValueFromBranch(variableName)
    ];
  console.log({ variableState });
  return variableState.getValue();
  // console.log({ this: this, variableName });
  // if (parentDataStateName === undefined) {
  //   return null;
  // }
  // const states = this.states;
  // const parentDataState = getState(this, parentDataStateName);
  // const variableId = this?.variables?.[variableName];
  // console.log({ variableId });
  // console.log({ variable: this.graph.statesObject.states[variableId] });
  // const variable: any = this.graph.statesObject.states[variableId];
  // if (variable.typeName === "number") return variable as NumberState;
  // return this.graph.statesObject.states[variableId];
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
  // const parentDataStateName =
  //   graph["changes"]["variables"][
  //     variableName
  //   ]?.parentDataStateNameString.split(",");
  // // const parentDataState = getState(graph, parentDataStateName);
  // if (!(variableName in parentDataState.variables)) {
  //   return;
  // }
  /**
   * save the change data from the user in a js object
   */
  /**
   * {variableName: {parentDataStateNameString, newValue}}
   */
  // graph["changes"] = {
  //   ...graph["changes"],
  //   variables: {
  //     ...graph["changes"]["variables"],
  //     [variableName]: {
  //       ...graph["changes"]["variables"][variableName],
  //       setFunctionWasCalled: true,
  //       value: newValue,
  //     },
  //   },
  // };
  // const variableId: number = parentDataState.variables[variableName];
  // graph.statesObject.states[variableId].value = newValue;
};
const printRecordTree = (graph: any, recordTreeRootName: string[]) => {
  // let recordTreeRoot = getState(graph, recordTreeRootName);
  // let afterState = getState(graph, recordTreeRoot.children[0]);

  // console.log("added record state", JSON.parse(JSON.stringify(recordTreeRoot)));
  // console.log("added record state", JSON.parse(JSON.stringify(afterState)));
  // if ("variables" in afterState) {
  //   Object.keys(afterState?.variables).forEach((variableName) => {
  //     console.log(
  //       "added record state",
  //       JSON.parse(JSON.stringify(variableName)),
  //       JSON.parse(
  //         JSON.stringify(
  //           graph.statesObject.states[afterState.variables[variableName]].value
  //         )
  //       )
  //     );
  //   });
  // }
  console.log();
};
// const insertVariableState = (graph: any, state: any, variable: any) => {
//   // variable is the new variable state
//   // console.log({ variable });
//   // fix for data structure update
//   // new variable state is inside graph.states
//   graph.statesObject.nextStateId += 1;
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
//     // graph.statesObject.states[graph.statesObject.nextStateId] = numberWrapper();
//     if (isNumber(variable.value)) {
//       graph.statesObject.states[graph.statesObject.nextStateId] =
//         numberWrapper();
//     } else if (isString(variable.value)) {
//       graph.statesObject.states[graph.statesObject.nextStateId] =
//         stringWrapper();
//     } else if (isArray(variable.value)) {
//       // console.log({ stateName: variable.name, stateTree });
//       graph.statesObject.states[graph.statesObject.nextStateId] = arrayWrapper();
//     }
//     let x = graph.statesObject.states[graph.statesObject.nextStateId];
//     // Object.assign()
//     x.setId(graph.statesObject.nextStateId);
//     x.setName(variable.name);
//     x.setValue(variable.value);
//     x.setReferenceToStatesObject(graph.statesObject);

//     console.log({ x });
//     state.variables[x.name[0]] = graph.statesObject.nextStateId;
//     // x.name = stateName;
//   } else {
//     graph.statesObject.states[graph.statesObject.nextStateId] = variable;
//     // graph.states.push(variable);
//     // new variable state name is inside state.variableNames
//     state.variables[variable.name[0]] = graph.statesObject.nextStateId;
//   }
// };
// const insertState = (graph: any, state: any, variables: any = {}) => {
//   // inserts state and variables
//   graph.statesObject.nextStateId += 1;
//   const { tree, updatedName } = insertName({
//     names: graph.namesTrie,
//     name: state.name,
//     stateId: graph.statesObject.nextStateId,
//   });
//   // console.log({ graph });
//   graph.namesTrie = tree;
//   // console.log({ updatedName });
//   state.name = updatedName;
//   if (Object.keys(variables).length > 0) {
//     state["variables"] = {};
//   }
//   graph.statesObject.states[graph.statesObject.nextStateId] = state;
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

export {
  ChangeStatus,
  stateTree,
  getStateId,
  getState,
  getStateById,
  getVariableById,
  getVariables,
  getVariable,
  setVariable,
  // insertVariableState,
  // insertState,
  printRecordTree,
  stateWrapper,
};
