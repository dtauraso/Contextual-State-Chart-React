import { Graph } from "../App.types";
import {
  getStateId,
  getState,
  insertVariableState,
  insertState,
  deleteNodes,
  deleteNodesHelper,
  printRecordTree,
  getVariable,
} from "./StateTree";
import { makeArrays } from "./Init/ContextualStateChartInit";
import { idText } from "typescript";

let initEntry = {
  currentStateNameConcatenated: {
    functionName: "functionName",
  },
};

let updateEntry = {
  currentStateNameConcatenated: {
    functionName: "functionName",
    parentDataStateAbsolutePathArrayConcatenated: {
      after: {
        varName: "newValue",
      },
      reference: ["parentDataStateName"],
    },
  },
};
let errorEntry = [updateEntry];
const getVariableVisitor = (
  graph: any,
  stateName: string[],
  variableName: any
) => {
  // a variation of getVariable with no recording for the visitor function only
  if (stateName === undefined) {
    return null;
  }
  const state = getState(graph, stateName);
  if ("variables" in state) {
    if (variableName in state.variables) {
      const variableId = state.variables[variableName];
      return graph.statesObject.states[variableId];
    }
  }
  return null;
};

const moveDown1Level = (
  { newTrackerName }: any,
  graph: any,
  currentTracker: any,
  winningState: any,
  bottom: any,
  i: any,
  nextStates: any
) => {
  // make new level tracker node and doubly link it with the current level
  // tracker node
  insertState(
    graph,
    {
      name: newTrackerName,
      parent: currentTracker.name,
      children: [], // is updated each loop on line 193
    },
    {
      nextStates: [winningState.name],
      winningStateName: null,
      previousSiblingWinningStateName: null,
      j: 0,
    }
  );
  // adds to the end
  currentTracker.children.push(newTrackerName);

  bottom.children[i] = newTrackerName;
  currentTracker = getState(graph, newTrackerName);
  updateVariableVisitor(
    graph,
    currentTracker.name,
    "nextStates",
    winningState.start
  );
  updateVariableVisitor(
    graph,
    currentTracker.name,
    "previousSiblingWinningStateName",
    null
  );
  nextStates = getVariableVisitor(
    graph,
    currentTracker.name,
    "nextStates"
  ).value;
};

const moveAcross1Level = (
  graph: any,
  currentTracker: any,
  winningState: any,
  nextStates: any
) => {
  updateVariableVisitor(
    graph,
    currentTracker.name,
    "nextStates",
    winningState.next
  );
  updateVariableVisitor(
    graph,
    currentTracker.name,
    "previousSiblingWinningStateName",
    getVariableVisitor(graph, currentTracker.name, "winningStateName").value
  );
  // previousSiblingWinningStateName
  updateVariableVisitor(graph, currentTracker.name, "winningStateName", null);
  nextStates = getVariableVisitor(
    graph,
    currentTracker.name,
    "nextStates"
  ).value;
};

const moveUpToParentNode = (graph: any, bottom: any, i: any) => {
  // move bottom's ith child up by 1 unit
  let parentTracker = getState(
    graph,
    getState(graph, bottom.children[i]).parent
  );
  // console.log("parent tracker child count", currentTracker.children.length);
  // remove the last one
  parentTracker.children.pop();
  // will mess things up if parentTracker connects
  // to more than 1 branch
  // parentTracker.children = [];
  // console.log({ parentTracker });
  bottom.children[i] = getState(
    graph,
    getState(graph, bottom.children[i]).parent
  ).name;
};

const deleteCurrentNode = (graph: any, currentTracker: any) => {
  Object.keys(currentTracker.variables).forEach((variableName) => {
    delete graph.statesObject.states[currentTracker.variables[variableName]];
  });
  deleteNodes(graph, currentTracker.name);
};
/*
[..stateName, unitTest, 1stCycle, 1stRun]
record unit test first using context additions
use next states to build the end to end testing
*/
const setupTrackers = (
  graph: Graph,
  levelId: Number,
  timeLineId: Number,
  startStateName: string[]
): any => {
  let parentTrackerName = [`level ${levelId}`, `timeLine ${timeLineId}`];
  updateVariableVisitor(graph, parentTrackerName, "nextStates", [
    startStateName,
  ]);
};
const getRunningStateParent = (graph: any) => {
  const bottomName = getVariableVisitor(graph, ["tree"], "bottomName").value;

  const i = getVariableVisitor(graph, bottomName, "i").value;
  const currentTrackerName = getState(graph, bottomName).children[i];
  const currentTrackerParentName = getState(graph, currentTrackerName).parent;
  const winningParentStateObject = getVariableVisitor(
    graph,
    currentTrackerParentName,
    "winningStateName"
  );
  if (winningParentStateObject === null) {
    return null;
  }
  const winningParentState = winningParentStateObject.value;
  // const j = getVariableVisitor(graph, currentTrackerName, "j").value;
  // const nextStates = getVariableVisitor(
  //   graph,
  //   currentTrackerName,
  //   "nextStates"
  // ).value;
  // const currentTrialStateName = nextStates[j];
  return getState(graph, winningParentState);
};
const getRunningState = (graph: any) => {
  const bottomName = getVariableVisitor(graph, ["tree"], "bottomName").value;

  const i = getVariableVisitor(graph, bottomName, "i").value;
  const currentTrackerName = getState(graph, bottomName).children[i];
  const j = getVariableVisitor(graph, currentTrackerName, "j").value;
  const nextStates = getVariableVisitor(
    graph,
    currentTrackerName,
    "nextStates"
  ).value;
  const currentTrialStateName = nextStates[j];
  return getState(graph, currentTrialStateName);
};
const getStartRecordingStateName = (graph: any) => {
  return getVariableVisitor(graph, ["tree"], "startRecordingStates").value;
};
const getEndReordingStateName = (graph: any) => {
  return getVariableVisitor(graph, ["tree"], "stopRecordingStates").value;
};
const setRecordingFlag = (graph: any, recordingFlagValue: boolean) => {
  updateVariableVisitor(graph, ["tree"], "recordingActive", recordingFlagValue);
};
const getRecordingFlag = (graph: any) => {
  return getVariableVisitor(graph, ["tree"], "recordingActive").value;
};

const updateVariableVisitor = (
  graph: Graph,
  parentStateName: string[],
  variableName: string,
  newValue: any
) => {
  const state = getState(graph, parentStateName);

  if (!(variableName in state.variables)) {
    return;
  }
  const variableId: number = state.variables[variableName];
  graph.statesObject.states[variableId].value = newValue;
};
const setupRecordingFlag = (graph: any) => {
  const currentRunningStateName = getRunningState(graph).name;
  const startRecordingStatesNameString =
    getStartRecordingStateName(graph).join(",");
  const endRecordingStatesNameString = getEndReordingStateName(graph).join(",");
  const currentRunningStateNameString = currentRunningStateName.join(",");
  if (startRecordingStatesNameString === currentRunningStateNameString) {
    setRecordingFlag(graph, true);
  } else if (endRecordingStatesNameString === currentRunningStateNameString) {
    setRecordingFlag(graph, false);
  }
};
const cleanupChanges = (graph: any) => {
  Object.keys(graph["changes"]["variables"]).forEach((variableName) => {
    if (!graph["changes"]["variables"][variableName].setFunctionWasCalled) {
      // return { [variableName]: graph["changes"][variableName] };
      delete graph["changes"]["variables"][variableName];
    } else {
      delete graph["changes"]["variables"][variableName].setFunctionWasCalled;
    }
  });
};

/**
 1 state passed
  parentStateName: ['number']
  pass: true
  stateName: ['save number']
  variables: {
    expression: {parentDataStateNameString: 'calculator', value: Array(23)}
    i1: {parentDataStateNameString: 'calculator', value: 18}
  }

  base case is arrays for now
  {
    id: 0,
    parentStateName: ['number']
    pass: true
    stateName: ['save number']
    variables: {
      id: 1,
      expression: {id: 2, parentDataStateNameString: 'calculator', value: Array(23)}
      i1: {id: 3, parentDataStateNameString: 'calculator', value: 18}
    }
  }

 {
   id: y,
   name: ["number", "unitTest", "machine run 0", "iteration 0"],
   children: [["save number", "unitTest", "machine run 0", "iteration 0"]]
 }
 {
   id: x,
   name: ["save number", "unitTest", "machine run 0", "iteration 0"],
   start: [["fake", "endState1", "unitTest", "machine run 0", "iteration 0"]],
   variables: {
    parentStateName: {value: ["number"]},
    pass: {value: true},
    stateName: {value: ["save number"]},
    variables: {keys: {expression: id_0, i1: id_1, toke: id_2}}
 },
 {
   id: id_0,
   name: ["expression"],
   variables: {
     parentDataStateNameString: {value: "calculator"},
     value: {value: [stuff]}
   }
 },
 {
   id: id_1,
   name: ["i1"],
   variables: {
     parentDataStateNameString: {value: "calculator"},
     value: {value: 48}
   }
 },
 {
   id: id_2,
   name: ["token"],
   variables: {
     parentDataStateNameString: {value: "createExpression"},
     value: {value: ""}
   }
 }
 
 convert all of the above items(states and variables) to json
 json -> array
 make a separate json to array function for the variable tree
 array -> json
 
 */
const runState = (graph: any, winningStateName: any) => {
  let currentRunningStateName = getRunningState(graph).name;
  // console.log({ stateToRunName: currentRunningStateName.join(",") });
  const state = getState(graph, currentRunningStateName);
  if (typeof state.functionCode === "string") {
    console.log(`can't run a string ${state.functionCode} as a function`);
    return;
  }
  // make a single data change js object to record all changes
  // made by running functionCode()
  if (state.functionCode(graph)) {
    winningStateName.value = currentRunningStateName;
    graph["changes"]["pass"] = true;
    // parse through change data here
    // move it to the record states
    // const machineRunId = getVariable(graph, ["tree"], "machineRunId").value;
    // console.log("here");
    // const stateRunCount = getState(graph, stateToRunName).stateRunCount;

    // // the record state is being added in multiple times because it can't find the first time
    // let recordStateTreeRootName = [
    //   ...stateToRunName,
    //   "unitTest",
    //   `${machineRunId}`,
    //   `${stateRunCount}`,
    // ];
    // let recordStateRoot = getState(graph, recordStateTreeRootName);
    // if (!recordStateRoot) {
    //   let afterStateName = [...stateToRunName, "after"];
    //   afterStateName = insertState(graph, {
    //     name: afterStateName,
    //     functionName: state.functionCode.name.toString(),
    //   });
    //   // problem line
    //   // this state is being accessed in StateTree.ts line 183\
    //   // It's affecting other states
    //   // console.log("here");
    //   recordStateTreeRootName = insertState(graph, {
    //     name: recordStateTreeRootName,
    //     children: [afterStateName],
    //   });
    //   console.log(
    //     "added record state bool",
    //     JSON.parse(JSON.stringify(recordStateRoot)),
    //     JSON.parse(JSON.stringify(stateToRunName))
    //   );
    //   console.log("added record state bool");
    //   printRecordTree(graph, recordStateTreeRootName);
    // }

    // console.log("here");
  }
};
const pointA = (graph: any, currentTrackerName: string[]) => {
  const previousSiblingWinningState = getVariableVisitor(
    graph,
    currentTrackerName,
    "previousSiblingWinningStateName"
  );
  // console.log(JSON.parse(JSON.stringify(previousSiblingWinningState)));

  if (getRunningStateParent(graph) === null) {
    // console.log(`A is root -> tree`);
    return { name: ["tree"], isParent: true };
    // return ["tree"]
  } else if (previousSiblingWinningState.value === null) {
    // console.log(`A is a parent -> ${getRunningStateParent(graph).name}`);
    return { name: getRunningStateParent(graph).name, isParent: true };
    // return getRunningStateParent(graph).name
  } else {
    // console.log(`A is a prev sibling -> ${previousSiblingWinningState.value}`);
    return { name: previousSiblingWinningState.value, isParent: false };
    // return previousSiblingWinningState.value
  }
};
const makeRecordingTree = (graph: any, prevState: any) => {
  console.log("stateChanges", graph["stateChanges"]);
  const atLeastOneStatePassed = graph["stateChanges"].find(
    (stateEntry: any) => stateEntry.pass
  );
  // console.log("successfullStates", successfullStateChanges);
  if (atLeastOneStatePassed === undefined) {
    console.log("all the states failed");
  } else {
    // will hide all side effect errors from incorrectly built failed states(modifies values in a way that makes
    // one of the next tried successfull states failand returns false)
    // because all successfull states will be grouped together
    const successfullStateChanges = graph["stateChanges"].filter(
      (stateEntry: any) => stateEntry.pass
    );
    console.log("state changes that passed", successfullStateChanges);
  }
  /**
   *
   *
   *
   *
   *
   * [prevState]: {
   *    variables: {
   *      children: [triedState1, triedState2],
   *      prevStateIsParent: true,
   *      allStatesPassed: false
   *    }
   * },
   * triedState1: {
   *    variables: {
   *      parentDataStateNameString,
   *      runningStateNameParentString,
   *      runningStateNameString,
   *      value,
   *    }
   * triedState2: {
   *    variables: {
   *      parentDataStateNameString,
   *      runningStateNameParentString,
   *      runningStateNameString,
   *      value,
   *    }
   * }
   */
};
const visitor = (startStateName: string[], graph: any) => {
  /*
    setup trackers

    bottom level state list
        child links point to the current node on each timeline
    reverse tree to track the levels
        connect by parent link

    prev and parent states for determining the tree structure of the recording state trees
    record state range
      changes are only recorded in the range [state_1, state_n)
    recording states
        get and set functions for recording the changes made to variables
        1 temporary data structure for recording all the changes made in 1 state
        1 temporary data structure for recording all attempted next states
        a range for making sure only a predefined path of states are recorded
        a tree for representing the changes made in the state(unit test)
        a tree of trees for representing the end to end changes across the entire contextual state chart
    */
  let levelId = getVariableVisitor(graph, ["tree"], "levelId");
  // console.log({ levelId });
  let timeLineId = getVariableVisitor(graph, ["tree"], "timeLineId");
  setupTrackers(graph, levelId.value, timeLineId.value, startStateName);

  // bottom acts as a reader of the tree timelines like a disk read write head on a disk drive

  let bottomName = ["run state machine", "calculator", "bottom"];

  let bottom = getState(graph, bottomName);
  let stateRunCount = 0;
  while (bottom.children.length > 0) {
    // works to 101
    if (stateRunCount >= 101) {
      console.log("state run count is too high");
      return false;
    }
    // 2) put in state change recording tree
    // graph -> bottom.children[i] -> nextStates[j] = currentState
    updateVariableVisitor(graph, bottomName, "i", 0);
    let i = getVariableVisitor(graph, bottomName, "i").value;
    while (i < bottom.children.length) {
      let currentTracker = getState(graph, bottom.children[i]);
      // console.log("name", JSON.parse(JSON.stringify(currentTracker.name)));
      let nextStates = getVariableVisitor(
        graph,
        currentTracker.name,
        "nextStates"
      )?.value;
      if (!nextStates) {
        console.log({ nextStates });
        return false;
      }
      if (nextStates.length > 0) {
        let winningStateName = getVariableVisitor(
          graph,
          currentTracker.name,
          "winningStateName"
        );
        // runState(graph, stateToRunName, winningStateName)
        /**
         * record the change data for all the tried states
         * if all the states failed
         *    parse into a failure state record tree
         * if 1 state succeded
         *    only record a state tree for the winning state
         */
        updateVariableVisitor(graph, currentTracker.name, "j", 0);
        let j = getVariableVisitor(graph, currentTracker.name, "j").value;
        graph["stateChanges"] = [];
        console.log("next states", nextStates);
        // visiting all the states
        while (j < nextStates.length) {
          if (winningStateName.value !== null) {
            break;
          }
          setupRecordingFlag(graph);
          graph["changes"] = {
            pass: false,
            stateName: getRunningState(graph).name,
            parentStateName: getRunningStateParent(graph)?.name,
            variables: {},
          };
          runState(graph, winningStateName);
          cleanupChanges(graph);
          graph["stateChanges"].push(graph["changes"]);
          updateVariableVisitor(graph, currentTracker.name, "j", j + 1);
          j = getVariableVisitor(graph, currentTracker.name, "j").value;
        }
        if (getRecordingFlag(graph)) {
          // console.log("record changes");
          // console.log(
          //   "changes",
          //   JSON.parse(JSON.stringify(graph["stateChanges"]))
          // );

          // making the recording tree
          // makeRecordingTree(graph);
          // connecting the recording trees

          const prevState = pointA(graph, currentTracker.name);
          console.log(
            `A is a ${prevState.isParent ? "parent" : "sibling"} -> ${
              prevState.name
            }`
          );
          makeRecordingTree(graph, prevState);
          // prevSibling should always be null after a parent state is run
          /**
           * what previous state do we use to look for the previous record
           *    prev sibling or parent
           * does the previous state have a previous record
           *    visit [...stateName, "unitTest", maxMachineRunId, maxStateRunId]
           * the prev sibling and parent may be null
           */
        }

        if (winningStateName.value === null) {
          // all of the states failed
          console.log("all the states failed");
          // make a list of record state trees for each failed state
          return false;
        }
        // save the changes as a record state tree is record flag is active
        // console.log(
        //   "recording flag",
        //   JSON.parse(JSON.stringify(getRecordingFlag(graph)))
        // );
        console.log("winning state name", winningStateName.value);

        const winningState = getState(graph, winningStateName.value);

        // const machineRunId = getVariable(graph, ["tree"], "machineRunId").value;
        // const stateRunCountCurrentState =
        //   getState(graph, winningState.name).stateRunCount - 1;
        // // console.log("added record state", argumentObject);
        // let recordStateTreeRootName = [
        //   ...winningState.name,
        //   "unitTest",
        //   `${machineRunId}`,
        //   `${stateRunCountCurrentState}`,
        // ];
        // let recordStateRoot = getState(graph, recordStateTreeRootName);
        // if (!recordStateRoot) {
        //   console.log(
        //     "state has no record",
        //     JSON.parse(JSON.stringify(winningState.name)),
        //     JSON.parse(JSON.stringify(recordStateRoot))
        //   );
        //   // create record state tree for winningState.name
        // }
        if ("children" in winningState) {
          // there are children states to run
          console.log("there are children states to run");
          // update level id
          // updateVariableVisitor(graph, ["tree"], "levelId", levelId + 1);
          // console.log({ levelId });
          levelId.add(graph, 1);
          // levelId = getVariableVisitor(graph, ["tree"], "levelId").value;

          moveDown1Level(
            {
              newTrackerName: [
                `level ${levelId.value}`,
                `timeLine ${timeLineId.value}`,
              ],
            },
            graph,
            currentTracker,
            winningState,
            bottom,
            i,
            nextStates
          );
        } else if ("next" in winningState) {
          console.log("there are next states to run");
          moveAcross1Level(graph, currentTracker, winningState, nextStates);

          if (winningState.next.length > 0) {
            // there are next states to run
          } else {
            // winningState is an end state
            // console.log("end state", { winningState });
          }
        } else {
          // winningState is an end state
          // console.log("end state", { winningState });

          moveUpToParentNode(graph, bottom, i);

          deleteCurrentNode(graph, currentTracker);
          // updateVariableVisitor(graph, ["tree"], "levelId", levelId - 1);
          levelId.subtract(graph, 1);
          // levelId = getVariableVisitor(graph, ["tree"], "levelId").value;
          currentTracker = getState(graph, bottom.children[i]);

          while (bottom.children[i] !== null) {
            // get the latest winning state
            const currentWinningState = getState(
              graph,
              getVariableVisitor(graph, currentTracker.name, [
                "winningStateName",
              ]).value
            );
            if ("next" in currentWinningState) {
              if (currentWinningState.next.length > 0) {
                console.log("don't got up higher");

                // set new next states
                moveAcross1Level(
                  graph,
                  currentTracker,
                  currentWinningState,
                  nextStates
                );
                break;
              }
            } else {
              console.log("move up more");
              moveUpToParentNode(graph, bottom, i);

              deleteCurrentNode(graph, currentTracker);
              // updateVariableVisitor(graph, ["tree"], "levelId", levelId - 1);
              levelId.subtract(graph, 1);
              // levelId = getVariableVisitor(graph, ["tree"], "levelId").value;
              currentTracker = getState(graph, bottom.children[i]);
            }
          }
          if (bottom.children[i] === null) {
            // state machine is done
            console.log("state machine is done");
          }
        }
        stateRunCount += 1;
      }
      console.log({ graph });
      updateVariableVisitor(graph, bottomName, "i", i + 1);
      i = getVariableVisitor(graph, bottomName, "i").value;
    }
  }
};

export {
  updateEntry,
  getRunningStateParent,
  getRunningState,
  getRecordingFlag,
  visitor,
};
