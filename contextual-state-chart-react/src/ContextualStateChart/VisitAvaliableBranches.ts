import { isConstructorDeclaration } from "typescript";
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
  let statesRun = 0;
  // erase all the branchIDParentID objects used
  let stateWithBranchIDParentIDSetup = {};
  // save winning entry with childState as branchID -> parentStateID
  stateRunTreeBottom[firstBranchID] = {
    isParallel: false,
    nextStates: [
      // childStateID:
      graph.getState(startStateName).id,
    ],
    parentStateID: 1,
  };
  // only a successfully run state can have an entry in it's branchIDParentID object
  // pretend the parent was run (for setup only)
  const parentState = graph.getStateById(1);
  parentState.branchIDParentID[firstBranchID] = -1;
  console.log({ stateRunTreeBottom });
  while (Object.keys(stateRunTreeBottom).length > 0) {
    console.log({ statesRun });

    Object.keys(stateRunTreeBottom)
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        if (statesRun >= 6) {
          console.log("too many states were run");
          stateRunTreeBottom = {};
          return;
        }
        let winningStateIDs = [-1];
        if (!stateRunTreeBottom[branchID]["isParallel"]) {
          stateRunTreeBottom[branchID]["nextStates"].forEach(
            (nextStateID: number, i: number) => {
              if (winningStateIDs[0] >= 0) {
                return;
              }
              const state = graph.getStateById(nextStateID);
              console.log({ state });
              if (state.functionCode(graph)) {
                winningStateIDs[0] = i;
              }
            }
          );
        } else {
          // parallel: not tested
          Object.keys(stateRunTreeBottom[branchID]["nextStates"])
            .map((childStateID: string) => Number(childStateID))
            .forEach((nextStateID: number, i: number) => {
              const state = graph.getStateById(nextStateID);
              if (state.functionCode(graph)) {
                if (winningStateIDs[0] === -1) {
                  winningStateIDs[0] = i;
                } else {
                  winningStateIDs.push(i);
                }
              }
            });
        }
        console.log({ winningStateIDs });
        if (winningStateIDs[0] === -1) {
          // all the states failed
        } else if (winningStateIDs.length === 1) {
          // winning state is now a parent state
          let state = graph.getStateById(
            stateRunTreeBottom[branchID]["nextStates"][winningStateIDs[0]]
          );
          console.log({ state });
          if (state.start?.length > 0) {
            // children states
            state.branchIDParentID[branchID] =
              stateRunTreeBottom[branchID]["parentStateID"];
            stateRunTreeBottom[branchID] = {
              ...stateRunTreeBottom[branchID],
              nextStates: state.start.map(
                (startStateName: string[]) => graph.getState(startStateName).id
              ),
              parentStateID: state.id,
            };
            console.log({
              state,
              stateRunTreeBottom,
              nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
                (id: number) => graph.getStateById(id).name
              ),
              parent: graph.getStateById(
                stateRunTreeBottom[branchID]["parentStateID"]
              ).name,
            });
          } else if (state.next?.length > 0) {
            console.log("here now");
            // next states
            state.branchIDParentID[branchID] =
              stateRunTreeBottom[branchID]["parentStateID"];
            stateRunTreeBottom[branchID] = {
              ...stateRunTreeBottom[branchID],
              nextStates: state.next.map(
                (startStateName: string[]) => graph.getState(startStateName).id
              ),
            };
            console.log({
              state,
              stateRunTreeBottom,
              nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
                (id: number) => graph.getStateById(id).name
              ),
              parent: graph.getStateById(
                stateRunTreeBottom[branchID]["parentStateID"]
              ).name,
            });
          } else if (state.next === undefined) {
            console.log({ state }, "is end state");
            console.log({
              state,
              stateRunTreeBottom,
              nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
                (id: number) => graph.getStateById(id).name
              ),
              parent: graph.getStateById(
                stateRunTreeBottom[branchID]["parentStateID"]
              ).name,
            });
            // end state
          }
        } else if (winningStateIDs.length > 1) {
          // parallel: not tested
          // chldren
          winningStateIDs.forEach((winningStateID: number) => {
            // each winning state is now a parent state
            let state = graph.getStateById(winningStateID);
            if (state.start?.length > 0) {
              // children states
            } else if (state.next?.length > 0) {
              // children states
            } else if (state.next?.length === 0) {
              // end state
            }
          });
        }
        statesRun += 1;
        return false;
      });
  }

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
