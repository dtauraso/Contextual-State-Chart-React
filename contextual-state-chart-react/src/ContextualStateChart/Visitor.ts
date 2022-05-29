import {
  ArrayState,
  ControlFlowState,
  Graph,
  NumberState,
  State,
  ActiveChildStates,
} from "../App.types";
import {
  getStateId,
  getState,
  // insertVariableState,
  // insertState,
  printRecordTree,
  getVariable,
} from "./StateTree";
import { makeArrays, makeVariable } from "./Init/ContextualStateChartInit";
// import { idText } from "typescript";
// import { addState, getStateNames } from "./Init/StatesObject";
import { insertName, makeState } from "./Init/ContextualStateChartInit";
import { ExitStatus, StaticKeyword } from "typescript";
import { VisitAvaliableBranches } from "./VisitAvaliableBranches";
import { VisitBranches } from "./VisitBranches";
import { RunStates } from "./RunStates";
import { getTrackerVariables, getWinningState } from "./UtilityFunctions";
let tree = ["tree"];
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
  // const state = getState(graph, stateName);
  // if ("variables" in state) {
  //   if (variableName in state.variables) {
  //     const variableId = state.variables[variableName];
  //     return graph.statesObject.states[variableId];
  //   }
  // }
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
  // inserts state and variables
  // insertState(
  //   graph,
  //   {
  //     name: newTrackerName,
  //     parent: currentTracker.name,
  //     children: [], // is updated each loop on line 193
  //   },
  //   {
  //     nextStates: winningState.start, //[winningState.name],
  //     winningStateName: [],
  //     previousSiblingWinningStateName: [],
  //     j: 0,
  //   }
  // );
  // console.log(graph);
  // let names: string[][] = [];
  // console.log("here", newTrackerName);
  // getStateNames(
  //   {
  //     // parent: currentTracker.name,
  //     start: [],
  //     children: {}, // is updated each loop on line 193
  //     variables: {
  //       nextStates: { value: winningState.start }, //[winningState.name],
  //       winningStateName: { value: [] },
  //       previousSiblingWinningStateName: { value: [] },
  //       j: { value: 0 },
  //     },
  //   },
  //   newTrackerName,
  //   names,
  //   graph.statesObject
  // );
  // console.log({ names });
  // names.forEach((nameArray: any, i: Number) => {
  //   const { tree, updatedName } = insertName(graph.namesTrie, nameArray, i);
  //   // console.log({ updatedName });
  //   // console.log({ tree, updatedName });
  //   graph.namesTrie = tree;
  // });

  // getStateNames = (
  //   stateTree: any,
  //   stateName: any,
  //   names: any,
  //   statesObject: any
  // )

  /**
  {
      parent: currentTracker.name,
      children: [], // is updated each loop on line 193
      variables: {
        nextStates: winningState.start, //[winningState.name],
        winningStateName: [],
        previousSiblingWinningStateName: [],
        j: 0,
      }
  },
  [newTrackerName],
  graph.names
  graph.statesObject
   */
  // adds to the end
  currentTracker.children.push(newTrackerName);

  bottom.children[i.value] = newTrackerName;
  console.log({ graph });

  // currentTracker = getState(graph, newTrackerName);
  nextStates = getVariableVisitor(graph, currentTracker.name, "nextStates");
  // nextStates.setValue(winningState.start);
  // updateVariableVisitor(
  //   graph,
  //   currentTracker.name,
  //   "nextStates",
  //   winningState.start
  // );
  console.log({ nextStates });
  let previousSiblingWinningStateName = getVariableVisitor(
    graph,
    currentTracker.name,
    "previousSiblingWinningStateName"
  );
  console.log({ previousSiblingWinningStateName });
  // previousSiblingWinningStateName.setValue([]);
  // updateVariableVisitor(
  //   graph,
  //   currentTracker.name,
  //   "previousSiblingWinningStateName",
  //   []
  // );
  // nextStates = getVariableVisitor(graph, currentTracker.name, "nextStates");
  // nextStates = getVariableVisitor(
  //   graph,
  //   currentTracker.name,
  //   "nextStates"
  // ).value;
};

/*
[..stateName, unitTest, 1stCycle, 1stRun]
record unit test first using context additions
use next states to build the end to end testing
*/
// const setupTrackers = (
//   graph: Graph,
//   levelId: Number,
//   timeLineId: Number,
//   startStateName: string[]
// ): any => {
//   let parentTrackerName = [`level ${levelId}`, `timeLine ${timeLineId}`];
//   let nextStates = getVariableVisitor(graph, parentTrackerName, "nextStates");
//   // nextStates.setValue([startStateName]);
//   // updateVariableVisitor(graph, parentTrackerName, "nextStates", [
//   //   startStateName,
//   // ]);
// };
const getRunningStateParent = (graph: any) => {
  // const bottomName = getVariableVisitor(graph, ["tree"], "bottomName").value;

  // const i = getVariableVisitor(graph, bottomName, "i");
  // const currentTrackerName = getState(graph, bottomName).children[i.value];
  // const currentTrackerParentName = getState(graph, currentTrackerName).parent;
  // const winningParentStateObject = getVariableVisitor(
  //   graph,
  //   currentTrackerParentName,
  //   "winningStateName"
  // );
  // if (winningParentStateObject === null) {
  //   return null;
  // }
  // const winningParentState = winningParentStateObject.value;
  // const j = getVariableVisitor(graph, currentTrackerName, "j").value;
  // const nextStates = getVariableVisitor(
  //   graph,
  //   currentTrackerName,
  //   "nextStates"
  // ).value;
  // const currentTrialStateName = nextStates[j];
  return 1; //getState(graph, winningParentState);
};
const getRunningState = (graph: any) => {
  // const bottomName = getVariableVisitor(graph, ["tree"], "bottomName").value;

  // const i = getVariableVisitor(graph, bottomName, "i");
  // const currentTrackerName = getState(graph, bottomName).children[i.value];
  // const j = getVariableVisitor(graph, currentTrackerName, "j");
  // const nextStates = getVariableVisitor(
  //   graph,
  //   currentTrackerName,
  //   "nextStates"
  // ); //.value;
  // const currentTrialStateName = nextStates.get(j);
  return 1; //getState(graph, currentTrialStateName);
};
// const getStartRecordingStateName = (graph: any) => {
//   return getVariableVisitor(graph, ["tree"], "startRecordingStates").value;
// };
// const getEndReordingStateName = (graph: any) => {
//   return getVariableVisitor(graph, ["tree"], "stopRecordingStates").value;
// };
// const setRecordingFlag = (graph: any, recordingFlagValue: boolean) => {
//   updateVariableVisitor(graph, ["tree"], "recordingActive", recordingFlagValue);
// };
// const getRecordingFlag = (graph: any) => {
//   return getVariableVisitor(graph, ["tree"], "recordingActive").value;
// };

// const updateVariableVisitor = (
//   graph: Graph,
//   parentStateName: string[],
//   variableName: string,
//   newValue: any
// ) => {
//   const state = getState(graph, parentStateName);

//   if (!(variableName in state.variables)) {
//     return;
//   }
//   const variableId: number = state.variables[variableName];
//   // graph.statesObject.states[variableId].value = newValue;
// };
// const setupRecordingFlag = (graph: any) => {
//   const currentRunningStateName = getRunningState(graph).name;
//   const startRecordingStatesNameString =
//     getStartRecordingStateName(graph).join(",");
//   const endRecordingStatesNameString = getEndReordingStateName(graph).join(",");
//   const currentRunningStateNameString = currentRunningStateName.join(",");
//   if (startRecordingStatesNameString === currentRunningStateNameString) {
//     setRecordingFlag(graph, true);
//   } else if (endRecordingStatesNameString === currentRunningStateNameString) {
//     setRecordingFlag(graph, false);
//   }
// };
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
// const runState = (graph: any, winningStateName: any) => {
//   let currentRunningStateName = getRunningState(graph).name;
//   // console.log({ stateToRunName: currentRunningStateName.join(",") });
//   const state = getState(graph, currentRunningStateName);
//   if (typeof state.functionCode === "string") {
//     console.log(`can't run a string ${state.functionCode} as a function`);
//     return;
//   }
//   // make a single data change js object to record all changes
//   // made by running functionCode()
//   if (state.functionCode(graph)) {
//     winningStateName.setValue(currentRunningStateName);
//     // winningStateName.value = currentRunningStateName;
//     graph["changes"]["pass"] = true;
//     // parse through change data here
//     // move it to the record states
//     // const machineRunId = getVariable(graph, ["tree"], "machineRunId").value;
//     // console.log("here");
//     // const stateRunCount = getState(graph, stateToRunName).stateRunCount;

//     // // the record state is being added in multiple times because it can't find the first time
//     // let recordStateTreeRootName = [
//     //   ...stateToRunName,
//     //   "unitTest",
//     //   `${machineRunId}`,
//     //   `${stateRunCount}`,
//     // ];
//     // let recordStateRoot = getState(graph, recordStateTreeRootName);
//     // if (!recordStateRoot) {
//     //   let afterStateName = [...stateToRunName, "after"];
//     //   afterStateName = insertState(graph, {
//     //     name: afterStateName,
//     //     functionName: state.functionCode.name.toString(),
//     //   });
//     //   // problem line
//     //   // this state is being accessed in StateTree.ts line 183\
//     //   // It's affecting other states
//     //   // console.log("here");
//     //   recordStateTreeRootName = insertState(graph, {
//     //     name: recordStateTreeRootName,
//     //     children: [afterStateName],
//     //   });
//     //   console.log(
//     //     "added record state bool",
//     //     JSON.parse(JSON.stringify(recordStateRoot)),
//     //     JSON.parse(JSON.stringify(stateToRunName))
//     //   );
//     //   console.log("added record state bool");
//     //   printRecordTree(graph, recordStateTreeRootName);
//     // }

//     // console.log("here");
//   }
// };
// const pointA = (graph: any, currentTrackerName: string[]) => {
//   const previousSiblingWinningState = getVariableVisitor(
//     graph,
//     currentTrackerName,
//     "previousSiblingWinningStateName"
//   );
//   // console.log(JSON.parse(JSON.stringify(previousSiblingWinningState)));

//   if (getRunningStateParent(graph) === null) {
//     // console.log(`A is root -> tree`);
//     return { name: ["tree"], isParent: true };
//     // return ["tree"]
//   }
//   // else if (previousSiblingWinningState.value === null) {
//   //   // console.log(`A is a parent -> ${getRunningStateParent(graph).name}`);
//   //   return { name: getRunningStateParent(graph).name, isParent: true };
//   //   // return getRunningStateParent(graph).name
//   // } else {
//   //   // console.log(`A is a prev sibling -> ${previousSiblingWinningState.value}`);
//   //   return { name: previousSiblingWinningState.value, isParent: false };
//   //   // return previousSiblingWinningState.value
//   // }
// };
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

const setupTrackers = (startStateName: string[], graph: Graph) => {
  // fixing problem where the bottom array linked to state name arrays instead of
  // the states the names pointed to
  // inital conditions are wrong
  const levelId = graph.getState(tree).getVariable("levelId");
  const timeLineId = graph.getState(tree).getVariable("timeLineId");
  const parentTrackerName = [
    `level ${levelId.value}`,
    `timeLine ${timeLineId.value}`,
  ];
  const nextStates = graph
    .getState(parentTrackerName)
    .getVariable("nextStates");

  const newStateId = makeVariable({
    trieTreeCollection: [],
    stateTree: startStateName.map((name) => ({
      value: name,
    })),
    indexObject: graph.statesObject,
    name: "0",
    graph: graph,
  });
  nextStates.value.push(newStateId);
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
  // "tree"
  // setupTrackers(startStateName, graph);

  // a timeline node is also a state node
  let stateRunTreeBottom = {
    branches: {
      0: {
        currentStateID: 1,
      },
    },
    maxBranchID: 0,
  };
  /*
  stateID: {branchID: {activeChildStateIDs, parentStateID, parentBranchID}}
  */
  let runTree: {
    [branchID: number]: {
      [stateID: number]: {
        activeChildStates: ActiveChildStates;
        parentID: number;
        parentBranchID: number;
        edgesGroupIndex: number;
      };
    };
  } = {
    0: {
      1: {
        activeChildStates: {},
        parentID: 0,
        parentBranchID: -1,
        edgesGroupIndex: 0,
      },
    },
  };
  // const currentState = graph.getStateById(1);
  // currentState.branchIDParentIDParentBranchID = {
  //   0: {
  //     activeChildStatesCount: 0,
  //     parentBranch: { parentID: 0, parentBranchID: -1 },
  //   },
  // };
  return VisitAvaliableBranches(graph, stateRunTreeBottom, runTree);

  // let levelId = getVariableVisitor(graph, ["tree"], "levelId");
  // console.log({ levelId });
  // let timeLineId = getVariableVisitor(graph, ["tree"], "timeLineId");
  // setupTrackers(graph, levelId.value, timeLineId.value, startStateName);

  // bottom acts as a reader of the tree timelines like a disk read write head on a disk drive

  // let bottomName = ["run state machine", "calculator", "bottom"];

  // let bottom = getState(graph, bottomName);
  // let stateRunCount = 0;
  // while (bottom.children.length > 0) {
  //   // works to 101
  //   if (stateRunCount >= 101) {
  //     console.log("state run count is too high");
  //     return false;
  //   }
  //   // 2) put in state change recording tree
  //   // graph -> bottom.children[i] -> nextStates[j] = currentState
  //   let i = getVariableVisitor(graph, bottomName, "i");
  //   i.setValue(0);
  //   while (i.value < bottom.children.length) {
  //     let currentTracker = getState(graph, bottom.children[i.value]);
  //     // console.log("name", JSON.parse(JSON.stringify(currentTracker.name)));
  //     let nextStates = getVariableVisitor(
  //       graph,
  //       currentTracker.name,
  //       "nextStates"
  //     );
  //     if (!nextStates) {
  //       console.log({ nextStates });
  //       return false;
  //     }
  //     if (nextStates.value.length > 0) {
  //       let winningStateName = getVariableVisitor(
  //         graph,
  //         currentTracker.name,
  //         "winningStateName"
  //       );
  //       // runState(graph, stateToRunName, winningStateName)
  //       /**
  //        * record the change data for all the tried states
  //        * if all the states failed
  //        *    parse into a failure state record tree
  //        * if 1 state succeded
  //        *    only record a state tree for the winning state
  //        */
  //       let j = getVariableVisitor(graph, currentTracker.name, "j");
  //       console.log({ j });
  //       j.setValue(0);
  //       graph["stateChanges"] = [];
  //       console.log(
  //         "next states",
  //         nextStates,
  //         "winning state name",
  //         winningStateName.value
  //       );
  //       // visiting all the states
  //       while (j.value < nextStates.value.length) {
  //         if (winningStateName.value.length > 0) {
  //           break;
  //         }
  //         setupRecordingFlag(graph);
  //         graph["changes"] = {
  //           pass: false,
  //           stateName: getRunningState(graph).name,
  //           parentStateName: getRunningStateParent(graph)?.name,
  //           variables: {},
  //         };
  //         // why is ["calculator"] always the winning state
  //         runState(graph, winningStateName);
  //         cleanupChanges(graph);
  //         graph["stateChanges"].push(graph["changes"]);
  //         j.add(1);
  //       }
  //       if (getRecordingFlag(graph)) {
  //         // console.log("record changes");
  //         // console.log(
  //         //   "changes",
  //         //   JSON.parse(JSON.stringify(graph["stateChanges"]))
  //         // );

  //         // making the recording tree
  //         // makeRecordingTree(graph);
  //         // connecting the recording trees

  //         const prevState = pointA(graph, currentTracker.name);
  //         console.log(
  //           `A is a ${prevState.isParent ? "parent" : "sibling"} -> ${
  //             prevState.name
  //           }`
  //         );
  //         // makeRecordingTree(graph, prevState);
  //         // prevSibling should always be null after a parent state is run
  //         /**
  //          * what previous state do we use to look for the previous record
  //          *    prev sibling or parent
  //          * does the previous state have a previous record
  //          *    visit [...stateName, "unitTest", maxMachineRunId, maxStateRunId]
  //          * the prev sibling and parent may be null
  //          */
  //       }

  //       if (winningStateName.value.length === 0) {
  //         // all of the states failed
  //         console.log("all the states failed");
  //         // make a list of record state trees for each failed state
  //         return false;
  //       }
  //       // save the changes as a record state tree is record flag is active
  //       // console.log(
  //       //   "recording flag",
  //       //   JSON.parse(JSON.stringify(getRecordingFlag(graph)))
  //       // );
  //       console.log("winning state name", winningStateName.value);

  //       const winningState = getState(graph, winningStateName.value);

  //       // const machineRunId = getVariable(graph, ["tree"], "machineRunId").value;
  //       // const stateRunCountCurrentState =
  //       //   getState(graph, winningState.name).stateRunCount - 1;
  //       // // console.log("added record state", argumentObject);
  //       // let recordStateTreeRootName = [
  //       //   ...winningState.name,
  //       //   "unitTest",
  //       //   `${machineRunId}`,
  //       //   `${stateRunCountCurrentState}`,
  //       // ];
  //       // let recordStateRoot = getState(graph, recordStateTreeRootName);
  //       // if (!recordStateRoot) {
  //       //   console.log(
  //       //     "state has no record",
  //       //     JSON.parse(JSON.stringify(winningState.name)),
  //       //     JSON.parse(JSON.stringify(recordStateRoot))
  //       //   );
  //       //   // create record state tree for winningState.name
  //       // }
  //       if ("children" in winningState) {
  //         // there are children states to run
  //         console.log("there are children states to run");
  //         // update level id
  //         // console.log({ levelId });
  //         // levelId.add(1);

  //         moveDown1Level(
  //           {
  //             newTrackerName: [
  //               // `level ${levelId.value}`,
  //               // `timeLine ${timeLineId.value}`,
  //             ],
  //           },
  //           graph,
  //           currentTracker,
  //           winningState,
  //           bottom,
  //           i,
  //           nextStates
  //         );
  //       } else if ("next" in winningState) {
  //         console.log("there are next states to run");
  //         moveAcross1Level(graph, currentTracker, winningState, nextStates);

  //         if (winningState.next.length > 0) {
  //           // there are next states to run
  //         } else {
  //           // winningState is an end state
  //           // console.log("end state", { winningState });
  //         }
  //       } else {
  //         // winningState is an end state
  //         // console.log("end state", { winningState });

  //         moveUpToParentNode(graph, bottom, i);

  //         deleteCurrentNode(graph, currentTracker);
  //         // levelId.subtract(1);
  //         currentTracker = getState(graph, bottom.children[i.value]);

  //         while (bottom.children[i.value] !== null) {
  //           // get the latest winning state
  //           const currentWinningState = getState(
  //             graph,
  //             getVariableVisitor(graph, currentTracker.name, [
  //               "winningStateName",
  //             ]).value
  //           );
  //           console.log({ currentWinningState });
  //           if ("next" in currentWinningState) {
  //             if (currentWinningState.next.length > 0) {
  //               console.log("don't got up higher");

  //               // set new next states
  //               moveAcross1Level(
  //                 graph,
  //                 currentTracker,
  //                 currentWinningState,
  //                 nextStates
  //               );
  //               break;
  //             }
  //           } else {
  //             console.log("move up more");
  //             moveUpToParentNode(graph, bottom, i);

  //             deleteCurrentNode(graph, currentTracker);
  //             // levelId.subtract(1);
  //             currentTracker = getState(graph, bottom.children[i.value]);
  //           }
  //         }
  //         if (bottom.children[i.value] === null) {
  //           // state machine is done
  //           console.log("state machine is done");
  //         }
  //       }
  //       stateRunCount += 1;
  //     }
  //     console.log({ graph });
  //     i.add(1);
  //   }
  // }
};

export {
  updateEntry,
  getRunningStateParent,
  getRunningState,
  // getRecordingFlag,
  visitor,
  VisitBranches,
  RunStates,
  getWinningState,
  getTrackerVariables,
};
