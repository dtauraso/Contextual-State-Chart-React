import { Graph } from "../App.types";

import { getTrackerVariables } from "./Visitor";

const RunStates = (graph: Graph) => {
  const { currentBranchName, j, winningStateName, nextStates } =
    getTrackerVariables(graph);
  // console.log({
  //   currentBranchName,
  //   j,
  //   w: JSON.parse(JSON.stringify(winningStateName.value)),
  //   graph,
  //   nextStates,
  // });
  let passes = false;
  while (!passes && j.value < nextStates.value.length) {
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
