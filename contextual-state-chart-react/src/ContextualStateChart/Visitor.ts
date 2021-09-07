import { Graph } from "../App.types";
import {
  getStateId,
  getState,
  getVariable,
  setVariable,
  insertVariableState,
  insertState,
  deleteNodes,
  deleteNodesHelper,
} from "./StateTree";
import { makeArrays } from "./Init/ContextualStateChartInit";

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
    }
  );
  // console.log({
  //   winningState: getVariable(graph, newTrackerName, "winningStateName"),
  // });
  // adds to the end
  currentTracker.children.push(newTrackerName);
  // console.log(
  //   "current tracker(push) child count",
  //   currentTracker.children.length
  // );
  bottom.children[i] = newTrackerName;
  currentTracker = getState(graph, newTrackerName);
  // console.log({ currentTracker });
  // console.log({
  //   graph,
  //   bottom,
  //   currentTracker,
  // });
  // insertState(graph, {
  //   name: ["calculator", "run state machine", "bottom"],
  // });
  // insertState(graph, {
  //   name: ["calculator", "run state machine", "bottom"],
  // });
  // insertState(graph, {
  //   name: ["calculator", "run state machine", "bottom"],
  // });
  // insertState(graph, {
  //   name: ["calculator", "run state machine", "bottom"],
  // });
  // insertState(graph, {
  //   name: ["calculator", "run state machine", "bottom"],
  // });
  // insertState(graph, {
  //   name: ["calculator", "run state machine", "bottom"],
  // });
  // console.log({ graph, winningState, nextStates });
  // return false;
  setVariable(
    graph,
    currentTracker.name,
    getVariable(graph, currentTracker.name, "nextStates").name[0],
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
  setVariable(
    graph,
    currentTracker.name,
    getVariable(graph, currentTracker.name, "nextStates").name[0],
    winningState.next
  );
  setVariable(
    graph,
    currentTracker.name,
    getVariable(graph, currentTracker.name, "winningStateName").name[0],
    null
  );
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
  let bottomName = ["calculator", "run state machine", "bottom"];
  bottomName = insertState(graph, {
    name: bottomName,
    children: [parentTrackerName],
  });

  // bottom acts as a reader of the tree timelines like a disk read write head on a disk drive
  parentTrackerName = insertState(
    graph,
    {
      name: parentTrackerName,
      parent: null,
      children: [],
    },
    {
      nextStates: [startStateName],
      winningStateName: null,
    }
  );
  return bottomName;
};
const runState = (
  graph: any,
  stateToRunName: string[],
  winningStateName: any
) => {
  if (winningStateName.value !== null) {
    return;
  }
  const state = getState(graph, stateToRunName);
  if (typeof state.functionCode === "string") {
    console.log(`can't run a string ${state.functionCode} as a function`);
    return;
  }
  if (state.functionCode(graph, state)) {
    winningStateName.value = stateToRunName;
  }
};
const visitor = (startStateName: string[], graph: any) => {
  /*
    setup trackers

    bottom level state
        child links point to the current node on each timeline
    reverse tree
        connect by parent link

    */
  // test();
  let levelId = 0;
  let timeLineId = 0;
  let bottomName = setupTrackers(graph, levelId, timeLineId, startStateName);
  let bottom = getState(graph, bottomName);
  let stateRunCount = 0;
  while (bottom.children.length > 0) {
    // works to 101
    if (stateRunCount >= 101) {
      console.log("state run count is too high");
      return false;
    }
    // 2) put in state change recording tree
    for (let i = 0; i < bottom.children.length; i++) {
      let currentTracker = getState(graph, bottom.children[i]);
      let nextStates = getVariable(
        graph,
        currentTracker.name,
        "nextStates"
      ).value;
      if (nextStates.length > 0) {
        let winningStateName = getVariable(
          graph,
          currentTracker.name,
          "winningStateName"
        );
        // runState(graph, stateToRunName, winningStateName)
        nextStates.forEach((stateToRunName: string[]) => {
          runState(graph, stateToRunName, winningStateName);
        });
        if (winningStateName.value === null) {
          // all of the states failed
          console.log("all the states failed");
          return false;
        }
        // console.log("winning state name", winningStateName.value);

        const winningState = getState(graph, winningStateName.value);
        if ("children" in winningState) {
          // there are children states to run
          // console.log("there are children states to run");
          // update level id
          levelId += 1;

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
          levelId -= 1;

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
              levelId -= 1;

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
    }
  }
};

export { updateEntry, visitor };
