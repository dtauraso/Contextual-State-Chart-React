import { Graph } from "../../App.types";
import {
  insertName,
  setAttribute,
  setupState,
  getStateNames,
  makeArrays,
} from "../ContextualStateChartInit";
const getStateId = (namesTrie: any, stateName: string[]) => {
  // console.log({ namesTrie, stateName });
  let stateId = 0;
  let namesTrieTracker = namesTrie;
  let isFound = true;
  if (typeof stateName === "string") {
    console.log(`${stateName} is not an array`);
    return -1;
  }
  stateName.forEach((namePart: string) => {
    if (!isFound) {
      return;
    }
    if (namePart in namesTrieTracker) {
      if ("id" in namesTrieTracker[namePart]) {
        stateId = namesTrieTracker[namePart].id;
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
  return graph.statesObject.states[stateId];
};
const getVariable = (graph: any, stateName: string[], variableName: any) => {
  // console.log({ stateName });

  const state = getState(graph, stateName);
  // console.log({ state });
  if (variableName in state.variables) {
    const stateId = state.variables[variableName];
    return graph.statesObject.states[stateId];
  }
};
const setVariable = (
  graph: any,
  stateName: any,
  variableName: any,
  newValue: any
) => {
  // console.log({ graph, state, variableName, newValue });
  const state = getState(graph, stateName);
  if (variableName in state.variables) {
    const stateId = state.variables[variableName];
    graph.statesObject.states[stateId].value = newValue;
    // console.log({ graph, stateId });
  }
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
  // console.log({ winningState, newTrackerName });
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
export const visitor = (startStateName: string[], graph: any) => {
  /*
    setup trackers

    bottom level state
        child links point to the current node on each timeline
    reverse tree
        connect by parent link

    */
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

export { getVariable, setVariable };
