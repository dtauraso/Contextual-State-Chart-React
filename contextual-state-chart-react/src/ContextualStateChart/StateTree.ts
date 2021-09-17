import { insertName } from "./Init/TrieTree";
import { Graph, NamesTrie } from "../App.types";
import { calculatorStateTree } from "../Calculator/CalculatorStateTree";
import { returnTrue } from "../Calculator/CalculatorStateFunctions";
import { getRunningStateParent, getRunningState } from "./Visitor";
let stateTree = {
  tree: {
    functionCode: returnTrue,
    start: ["calculator"],
    children: {
      ...calculatorStateTree,
      "run state machine": {
        calculator: {
          bottom: {
            children: {
              "level 0": {
                "timeLine 0": {
                  children: {},
                  variables: {
                    nextStates: { value: [] },
                    winningStateName: { value: null },
                    j: { value: 0 },
                  },
                },
              },
            },
            variables: {
              i: { value: 0 },
            },
          },
        },
      },
    },
    variables: {
      levelId: { value: 0 },
      timeLineId: { value: 0 },
      machineRunId: { value: 0 },
      startRecordingStates: { value: ["a state name"] },
      stopRecordingStates: { value: ["another state name"] },
      recordingActive: { value: false },
      bottomName: { value: ["run state machine", "calculator", "bottom"] },
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
    console.log(`stateId = ${stateId} is not in graph.statesObject.states`);
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
        getRunningStateParent(graph).name.join(",");
      let runningStateNameString = getRunningState(graph).name.join(",");
      graph["changes"] = {
        ...graph["changes"],
        [variableName]: {
          setFunctionWasCalled: false,
          parentDataStateNameString,
          runningStateNameString,
          runningStateNameParentString,
          value: null,
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

  const parentDataStateName =
    graph["changes"][variableName]?.parentDataStateNameString.split(",");
  // console.log("state", JSON.parse(JSON.stringify(state)));
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
    [variableName]: {
      ...graph["changes"][variableName],
      setFunctionWasCalled: true,
      value: newValue,
    },
  };
  const variableId: number = parentDataState.variables[variableName];
  graph.statesObject.states[variableId].value = newValue;
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
const insertVariableState = (graph: any, state: any, variable: any) => {
  // variable is the new variable state
  // console.log({ variable });
  // fix for data structure update
  // new variable state is inside graph.states
  graph.statesObject.maxStateId += 1;
  graph.statesObject.states[graph.statesObject.maxStateId] = variable;
  // graph.states.push(variable);
  // new variable state name is inside state.variableNames
  state.variables[variable.name[0]] = graph.statesObject.maxStateId;
};
const insertState = (graph: any, state: any, variables: any = {}) => {
  graph.statesObject.maxStateId += 1;
  const { tree, updatedName } = insertName(
    graph.namesTrie,
    state.name,
    graph.statesObject.maxStateId
  );
  // console.log({ graph });
  graph.namesTrie = tree;
  // console.log({ updatedName });
  state.name = updatedName;
  if (Object.keys(variables).length > 0) {
    state["variables"] = {};
  }
  graph.statesObject.states[graph.statesObject.maxStateId] = state;
  // only works for variable names of 1 dimention
  // the variable can only be accesible from the current state
  // each state can only have 1 unique user defined variable name
  // all variables need to be 1 dimentional
  Object.keys(variables).forEach((variableName: string) => {
    // do not insert variable names into the main graph
    // duplicate names are ok as long as their id number is different(variable names only)
    insertVariableState(graph, state, {
      name: [variableName],
      value: variables[variableName],
    });
  });

  return updatedName;
};
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
  stateTree,
  getStateId,
  getState,
  getVariable,
  setVariable,
  insertVariableState,
  insertState,
  deleteNodes,
  deleteNodesHelper,
  printRecordTree,
};
