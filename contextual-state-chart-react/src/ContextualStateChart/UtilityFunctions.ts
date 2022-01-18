import { Graph } from "../App.types";
let tree = ["tree"];

const getTrackerVariables = (graph: Graph) => {
  const bottomName = "stateRunTreeBottom";

  const bottom = graph.getState(tree).getVariable(bottomName);
  const i = graph.getState(tree).getVariable("i");
  const currentBranch = graph.getVariableById(bottom.at(i));
  // getting the branch name
  const currentBranchName = graph
    .getVariableById(bottom.value[i.value])
    .collect();
  console.log({ currentBranch });
  const j = currentBranch //graph.getState(currentBranchName)
    .getVariable("j");
  const nextStates =
    // graph;
    // .getState(currentBranchName)
    currentBranch.getVariable("nextStates");
  const winningStateName =
    // graph
    // .getState(currentBranchName)
    currentBranch.getVariable("winningStateName");
  return { currentBranchName, j, winningStateName, nextStates };
};

const getWinningState = (graph: Graph) => {
  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");
  const i = graph.getState(tree).getVariable("i");
  const currentBranchName = graph
    .getVariableById(bottom.value[i.value])
    .collect();
  const winningStateName = graph
    .getState(currentBranchName)
    .getVariable("winningStateName");

  return graph.getState(winningStateName.value);
};

export { getTrackerVariables, getWinningState };
