import { Graph } from "../App.types";

import { getTrackerVariables } from "./UtilityFunctions";

const RunStates = (graph: Graph) => {
  const { currentBranchName, j, winningStateName, nextStates } =
    getTrackerVariables(graph);
  console.log({
    currentBranchName,
    j,
    w: JSON.parse(JSON.stringify(winningStateName.value)),
    graph,
    nextStates,
  });
  let passes = false;
  // nextStates is not structured properly
  while (!passes && j.value < nextStates.value.length) {
    console.log("get next states", {
      graph,
      j_value: j.value,
      j,
      length: nextStates.value.length,
      item: nextStates.get(j.value),
    });
    const currentTrialStateName = nextStates.get(j.value).collect();
    const currentTrialState = graph.getState(currentTrialStateName);
    console.log({ currentTrialState, graph });
    if (currentTrialState.functionCode(graph, currentTrialState.name)) {
      winningStateName.setValue([...currentTrialState.name]);
      passes = true;
      console.log({ winningStateName });
    }
    if (!passes) {
      j.add(1);
    }
  }
  console.log({ passes });
  if (!passes) {
    console.log("all the states failed");
    console.log({ winningStateName });
    return false;
  }
  return true;
};

export { RunStates };
