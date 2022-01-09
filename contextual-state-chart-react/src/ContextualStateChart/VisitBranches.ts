import { Graph } from "../App.types";
import { pushBranch, updateBranch } from "./UpdateBranchTree";
import { RunStates, getWinningState } from "./Visitor";
let tree = ["tree"];

const VisitBranches = (graph: Graph) => {
  const i = graph.getState(tree).getVariable("i");
  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");

  while (i.value < bottom.value.length) {
    if (!RunStates(graph)) {
      return false;
    }
    const winningState = getWinningState(graph);
    console.log({ winningState });
    if (winningState.children.length > 0) {
      // visit children
      pushBranch(graph);
    } else if (winningState.next.length > 0) {
      // visit next states
      // replace bottom.children[i] with winningState.value
      console.log("here");
      updateBranch(graph);
      console.log("finished updating branch");
      console.log({ states: graph.statesObject.states });
    } else if (winningState.next.length === 0) {
      // travel up the branch path to find the next actionable state or a subroot(root but not the root of the tree)
    }
    i.add(1);
  }
  i.setValue(0);
  return true;
};

export { VisitBranches };
