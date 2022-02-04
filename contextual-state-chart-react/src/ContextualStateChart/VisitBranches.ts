import { Graph } from "../App.types";
import {
  pushBranch,
  updateBranch,
  travelUpBranchPath,
} from "./UpdateBranchTree";
import { RunStates, getWinningState } from "./Visitor";
let tree = ["tree"];

const VisitBranches = (graph: Graph) => {
  return false;
  const i = graph.getState(tree).getVariable("i");
  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");
  let isBranchDone = false;
  let killMachine = false;
  bottom.value.forEach((branch: any) => {
    if (isBranchDone) {
      return;
    }
    if (!RunStates(graph)) {
      isBranchDone = true;
    }
    const winningState = getWinningState(graph);
    console.log({ winningState });
    if (winningState.children.length > 0) {
      // visit children
      pushBranch(graph);
    } else if (winningState.next?.length > 0) {
      // visit next states
      console.log("here");
      updateBranch(graph);
      console.log("finished updating branch");
      console.log({ states: graph.statesObject.states });
    } else if (winningState.next === undefined) {
      // travel up the branch path to find the next actionable state or a subroot(root but not the root of the tree)
      console.log("travel up tree");
      travelUpBranchPath(graph);
      console.log("finished traveling up tree");
      killMachine = true;
    }
  });
  if (killMachine) {
    return false;
  }
  // while (i.value < bottom.value.length) {
  //   if (!RunStates(graph)) {
  //     return false;
  //   }
  //   const winningState = getWinningState(graph);
  //   console.log({ winningState });
  //   if (winningState.children.length > 0) {
  //     // visit children
  //     pushBranch(graph);
  //   } else if (winningState.next?.length > 0) {
  //     // visit next states
  //     console.log("here");
  //     updateBranch(graph);
  //     console.log("finished updating branch");
  //     console.log({ states: graph.statesObject.states });
  //   } else if (winningState.next === undefined) {
  //     // travel up the branch path to find the next actionable state or a subroot(root but not the root of the tree)
  //     console.log("travel up tree");
  //     travelUpBranchPath(graph);
  //     console.log("finished traveling up tree");
  //     return false;
  //   }
  //   i.add(1);
  // }
  // i.setValue(0);
  isBranchDone = true;

  return isBranchDone;
};

export { VisitBranches };
