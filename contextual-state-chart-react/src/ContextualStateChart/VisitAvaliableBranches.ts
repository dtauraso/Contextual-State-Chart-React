import { Graph } from "../App.types";
import { VisitBranches } from "./Visitor";
let tree = ["tree"];

// all branches should be able to run independently and terminate when they are done reguardless of how and when
// VisitAvaliableBranches is called
const VisitAvaliableBranches = (
  startStateName: string[],
  graph: Graph,
  stateRunTreeBottom: { [branchID: number]: any }
  // branchID -> childStateID -> parentStateID
) => {
  const stateRunCountMax = 2;
  const stateRunCount = graph.getState(tree).getVariable("stateRunCount");
  const firstBranchID = Object.keys(stateRunTreeBottom).length;
  stateRunTreeBottom[firstBranchID] = [
    // save winning entry with childState as branchID -> parentStateID
    {
      childStateID: graph.getState(startStateName).id,
      parentStateID: 1,
    },
  ];
  console.log({ stateRunTreeBottom });
  // while (Object.keys(stateRunTreeBottom).length > 0) {
  Object.keys(stateRunTreeBottom)
    .map((branchID: string) => Number(branchID))
    .forEach((branchID: number) => {
      Object.keys(stateRunTreeBottom[branchID])
        .map((childStateID: string) => Number(childStateID))
        .forEach((nextStateID: number, i: number) => {});
      // const state = graph.getStateById(stateRunTreeBottom[branchID]);
      /*
          try all states
            save the first passing state to the
          */

      return false;
    });
  // }

  // const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");
  // const i = graph.getState(tree).getVariable("i");
  // bottom.value is now empty
  // todo: if last state run successfully then stop machine
  // const startStateId = graph.getState(startStateName).id;
  // const startStateIdToendStateIds = graph
  //   .getState(tree)
  //   .getVariable("startStateIdToendStateIds");
  // console.log({ startStateIdToendStateIds });
  // const endStatesObjectId = startStateIdToendStateIds.value[startStateId];
  // console.log({ endStatesObjectId });
  // const endStateIdObject = graph.getVariableById(endStatesObjectId);
  // console.log({ endStatesObjectId, endStateIdObject });
  // const endStateIds = graph.getVariableById(endStateIdObject.value["endState"]);
  // console.log({ endStateIds });
  /*
  if start state id not in startStateIdToendStateIds
    return false

  while current state is not in startStateIdToendStateIds[startStateId].endStates
    run machine
  */
  // if (!(startStateId in startStateIdToendStateIds.value)) {
  //   return false;
  // }
  // console.log("here");
  // const currentStateId = graph.getVariableById(bottom.at(i));
  // console.log({ currentStateId });

  // while (!(currentStateId in endStateIdObject.value["endState"])) {
  //   if (stateRunCount.value >= stateRunCountMax) {
  //     console.log(
  //       `state run count is too high ${stateRunCount.value} >= ${stateRunCountMax}`
  //     );
  //     return false;
  //   }
  //   // bft and dft with 2 arrays
  //   // scan 1 array with forEach
  //   // fill up the 2nd array with results from the 1st array
  //   if (!VisitBranches(graph)) {
  //     return false;
  //   }
  //   console.log("run machine");
  //   stateRunCount.add(1);
  // }
  console.log("done with machine");
  // while (bottom.value.length > 0) {
  //   console.log({ stateRunCount: stateRunCount.value });
  //   if (stateRunCount.value >= stateRunCountMax) {
  //     console.log(
  //       `state run count is too high ${stateRunCount.value} >= ${stateRunCountMax}`
  //     );
  //     return false;
  //   }

  //   if (!VisitBranches(graph)) {
  //     return false;
  //   }

  //   stateRunCount.add(1);
  // }
  return true;
};

export { VisitAvaliableBranches };
