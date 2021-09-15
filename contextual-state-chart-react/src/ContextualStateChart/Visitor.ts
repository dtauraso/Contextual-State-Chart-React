import { Graph } from "../App.types";
import {
  getStateId,
  getState,
  getVariable,
  insertVariableState,
  insertState,
  deleteNodes,
  deleteNodesHelper,
  printRecordTree,
} from "./StateTree";
import { makeArrays } from "./Init/ContextualStateChartInit";
import { getShebang } from "typescript";

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

  nextStates = getVariable(graph, currentTracker.name, "nextStates").value;
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

  updateVariableVisitor(graph, currentTracker.name, "winningStateName", null);
  nextStates = getVariable(graph, currentTracker.name, "nextStates").value;
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
const getRunningState = (graph: any) => {
  const bottomName = getVariable(graph, ["tree"], "bottomName").value;

  const i = getVariable(graph, bottomName, "i").value;
  const currentTrackerName = getState(graph, bottomName).children[i];
  const j = getVariable(graph, currentTrackerName, "j").value;
  const nextStates = getVariable(graph, currentTrackerName, "nextStates").value;
  const currentTrialStateName = nextStates[j];
  return getState(graph, currentTrialStateName);
};
const runState = (graph: any, winningStateName: any) => {
  if (winningStateName.value !== null) {
    return;
  }

  let currentRunningStateName = getRunningState(graph).name;
  // console.log({ stateToRunName: currentRunningStateName.join(",") });
  const state = getState(graph, currentRunningStateName);
  if (typeof state.functionCode === "string") {
    console.log(`can't run a string ${state.functionCode} as a function`);
    return;
  }

  // make a single data change js object to record all changes
  // made by running functionCode()
  graph["changes"] = { [currentRunningStateName.join(",")]: {} };
  if (state.functionCode(graph)) {
    winningStateName.value = currentRunningStateName;
    console.log("changes", JSON.parse(JSON.stringify(graph["changes"])));
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
const visitor = (startStateName: string[], graph: any) => {
  /*
    setup trackers

    bottom level state
        child links point to the current node on each timeline
    reverse tree
        connect by parent link

    */
  let levelId = getVariable(graph, ["tree"], "levelId").value;
  let timeLineId = getVariable(graph, ["tree"], "timeLineId").value;
  setupTrackers(graph, levelId, timeLineId, startStateName);

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
    let i = getVariable(graph, bottomName, "i").value;
    while (i < bottom.children.length) {
      let currentTracker = getState(graph, bottom.children[i]);
      console.log("name", JSON.parse(JSON.stringify(currentTracker.name)));
      let nextStates = getVariable(
        graph,
        currentTracker.name,
        "nextStates"
      )?.value;
      if (!nextStates) {
        console.log({ nextStates });
        return false;
      }
      if (nextStates.length > 0) {
        let winningStateName = getVariable(
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
        let j = getVariable(graph, currentTracker.name, "j").value;
        while (j < nextStates.length) {
          runState(graph, winningStateName);
          updateVariableVisitor(graph, currentTracker.name, "j", j + 1);
          j = getVariable(graph, currentTracker.name, "j").value;
        }
        if (winningStateName.value === null) {
          // all of the states failed
          console.log("all the states failed");
          // make a list of record state trees for each failed state
          return false;
        }
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
          // console.log("there are children states to run");
          // update level id
          updateVariableVisitor(graph, ["tree"], "levelId", levelId + 1);
          levelId = getVariable(graph, ["tree"], "levelId").value;

          moveDown1Level(
            { newTrackerName: [`level ${levelId}`, `timeLine ${timeLineId}`] },
            graph,
            currentTracker,
            winningState,
            bottom,
            i,
            nextStates
          );
        } else if ("next" in winningState) {
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
          updateVariableVisitor(graph, ["tree"], "levelId", levelId - 1);
          levelId = getVariable(graph, ["tree"], "levelId").value;
          currentTracker = getState(graph, bottom.children[i]);

          while (bottom.children[i] !== null) {
            // get the latest winning state
            const currentWinningState = getState(
              graph,
              getVariable(graph, currentTracker.name, ["winningStateName"])
                .value
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
              updateVariableVisitor(graph, ["tree"], "levelId", levelId - 1);
              levelId = getVariable(graph, ["tree"], "levelId").value;
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
      i = getVariable(graph, bottomName, "i").value;
    }
  }
};

export { updateEntry, getRunningState, visitor };