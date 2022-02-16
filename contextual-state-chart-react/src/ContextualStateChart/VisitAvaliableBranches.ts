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
  // stateRunTreeBottom[firstBranchID] = {
  //   isParallel: false,
  //   nextStates: [
  //     // childStateID:
  //     graph.getState(startStateName).id,
  //   ],
  //   parentStateID: 1,
  // };
  // only a successfully run state can have an entry in it's branchIDParentID object
  // pretend the parent was run (for setup only)

  console.log({ stateRunTreeBottom });
  // return;
  while (Object.keys(stateRunTreeBottom).length > 0) {
    console.log({ statesRun });

    Object.keys(stateRunTreeBottom)
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        // fails when statesRun === 8
        if (statesRun >= 7) {
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
          // parallel: passes

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
          // console.log("here");
          // stateRunTreeBottom = [];
        }
        console.log({
          winningStateIDsAsNames: winningStateIDs.map(
            (stateID: number) =>
              graph.getStateById(
                stateRunTreeBottom[branchID]["nextStates"][stateID]
              ).name
          ),
        });
        console.log({ winningStateIDs });
        // need to refactor code
        let state;
        // save original branch data before it is replaced
        const { isParallel, nextStates, parentStateID } =
          stateRunTreeBottom[branchID];
        const tempBottom = {
          [branchID]: { isParallel, nextStates, parentStateID },
        };
        console.log({ branchID });
        let originalBranchChanged = false;
        let originalBranchSpawnedDifferentChildBranch = false;
        winningStateIDs.forEach((winningStateID: number, i: number) => {
          let currentBranchID = -1;
          if (i > 0) {
            currentBranchID = Object.keys(stateRunTreeBottom).length;
            // add new empty branch
            stateRunTreeBottom[currentBranchID] = {};
          } else {
            currentBranchID = branchID;
          }
          // all new branches will also have the same parent state
          state = graph.getStateById(
            tempBottom[branchID]["nextStates"][winningStateID]
          );
          // console.log({ state });
          if (state.start?.length > 0) {
            // children states
            // same parent for each new branch

            state.branchIDParentIDParentBranchID[currentBranchID] = {
              [tempBottom[branchID]["parentStateID"]]: branchID,
            };

            state.activeChildStatesCount += 1;

            stateRunTreeBottom[currentBranchID] = {
              ...stateRunTreeBottom[currentBranchID],
              nextStates: state.start.map(
                (startStateName: string[]) => graph.getState(startStateName).id
              ),
              parentStateID: state.id,
              isParallel: state.areChildrenParallel,
            };
            if (i === 0) {
              originalBranchChanged = true;
            } else if (i > 0) {
              originalBranchSpawnedDifferentChildBranch = true;
            }
          }
          // console.log({ currentBranchID, stateRunTreeBottom });
          // else if (state.next?.length > 0) {
          // delete branchID data from state after updating stateRunTreeBottom
          // same parent for each new branch
          //   parentState.activeChildStatesCount += 1;
          //   state.branchIDParentID[currentBranchID] = parentState.id;

          //   stateRunTreeBottom[currentBranchID] = {
          //     ...stateRunTreeBottom[currentBranchID],
          //     nextStates: state.next.map(
          //       (startStateName: string[]) => graph.getState(startStateName).id
          //     ),
          //     parentStateID: parentState.id,
          //     isParallel: state.areNextParallel,
          //   };
          // }
          //  else if (state.next === undefined) {
          //   let parentID = parentState.id;

          //   /*
          //   variable usage easy language api(similar to default language syntax)
          //   recording variable(all kinds of variables) changes so each state can show what changed
          //   arbitrarily complex context and indefinite levels of granulity(so user can understand the program and
          //     think more about the context of the problem to solve)
          //   let each state connect to any other state and any number of states
          //   handle async and sync processes by design
          //   clean standard way for me and other users to use(part of backend design and all of frontend)
          //   not requiring any external libraries except for some standard libraries for the front end
          //   Doesn't require a manual to understand
          //   */
          //   // if state machine has only 1 level this will happen first
          //   if (parentID !== -1) {
          //     // DFA and NFA stop condition
          //     while (parentState.activeChildStatesCount === 0) {
          //       parentState = graph.getStateById(parentID);
          //       console.log({ parentState });
          //       if (parentState.next?.length > 0) {
          //         stateRunTreeBottom[currentBranchID] = {
          //           ...stateRunTreeBottom[currentBranchID],
          //           nextStates: parentState.next.map(
          //             (startStateName: string[]) =>
          //               graph.getState(startStateName).id
          //           ),
          //           parentStateID:
          //             parentState.branchIDParentID[currentBranchID],
          //         };
          //         break;
          //       }
          //       parentState.activeChildStatesCount -= 1;
          //       parentID = parentState.branchIDParentID[currentBranchID];

          //       delete parentState.branchIDParentID[currentBranchID];
          //       // DFA only stop condition
          //       if (parentID === -1) {
          //         break;
          //       }
          //       parentState = graph.getStateById(parentID);
          //     }
          //   }
          // }

          //   let state = graph.getStateById(
          //     stateRunTreeBottom[branchID]["nextStates"][winningStateID]
          //   );

          //   // else
          //   return 0;
          //   // traversing up end condition
          //   // let parentID = stateRunTreeBottom[branchID]["parentStateID"];

          //   // parentID !== -1; DFA only end condition
          //   // const parentState = graph.getStateById(parentID);

          //   // DFA and NFA end condition
          //   // parentState.activeChildStatesCount === 0;
          // });
          // if (winningStateIDs[0] === -1) {
          //   // all the states failed
          // } else if (winningStateIDs.length === 1) {
          //   // winning state is now a parent state
          //   let state = graph.getStateById(
          //     stateRunTreeBottom[branchID]["nextStates"][winningStateIDs[0]]
          //   );
          //   // console.log({ state });
          //   if (state.start?.length > 0) {
          //     // children states
          //     state.branchIDParentID[branchID] =
          //       stateRunTreeBottom[branchID]["parentStateID"];
          //     stateRunTreeBottom[branchID] = {
          //       ...stateRunTreeBottom[branchID],
          //       nextStates: state.start.map(
          //         (startStateName: string[]) => graph.getState(startStateName).id
          //       ),
          //       parentStateID: state.id,
          //       isParallel: state.areChildrenParallel,
          //     };
          //     // console.log({
          //     //   state,
          //     //   stateRunTreeBottom,
          //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
          //     //     (id: number) => graph.getStateById(id).name
          //     //   ),
          //     //   parent: graph.getStateById(
          //     //     stateRunTreeBottom[branchID]["parentStateID"]
          //     //   ).name,
          //     // });
          //   } else if (state.next?.length > 0) {
          //     // console.log("here now");
          //     // stateRunTreeBottom = [];
          //     statesRun += 1;
          //     // next states
          //     state.branchIDParentID[branchID] =
          //       stateRunTreeBottom[branchID]["parentStateID"];
          //     stateRunTreeBottom[branchID] = {
          //       ...stateRunTreeBottom[branchID],
          //       nextStates: state.next.map(
          //         (startStateName: string[]) => graph.getState(startStateName).id
          //       ),
          //       isParallel: state.areNextParallel,
          //     };
          //     // console.log({
          //     //   state,
          //     //   stateRunTreeBottom,
          //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
          //     //     (id: number) => graph.getStateById(id).name
          //     //   ),
          //     //   parent: graph.getStateById(
          //     //     stateRunTreeBottom[branchID]["parentStateID"]
          //     //   ).name,
          //     // });
          //   } else if (state.next === undefined) {
          //     // console.log({ state }, "is end state");
          //     // console.log({
          //     //   state,
          //     //   stateRunTreeBottom,
          //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
          //     //     (id: number) => graph.getStateById(id).name
          //     //   ),
          //     //   parent: graph.getStateById(
          //     //     stateRunTreeBottom[branchID]["parentStateID"]
          //     //   ).name,
          //     // });
          //     // end state
          //     let parentID = stateRunTreeBottom[branchID]["parentStateID"];
          //     // DFA stop condition
          //     while (parentID !== -1) {
          //       const parentState = graph.getStateById(parentID);
          //       console.log({ parentState });
          //       if (parentState.next?.length > 0) {
          //         stateRunTreeBottom[branchID] = {
          //           ...stateRunTreeBottom[branchID],
          //           nextStates: parentState.next.map(
          //             (startStateName: string[]) =>
          //               graph.getState(startStateName).id
          //           ),
          //           parentStateID: parentState.branchIDParentID[branchID],
          //         };
          //         break;
          //       }
          //       parentID = parentState.branchIDParentID[branchID];
          //       delete parentState.branchIDParentID[branchID];
          //     }
          //     // console.log("done traveling up", { parentID });
          //     // console.log({
          //     //   state: graph.getStateById(parentID),
          //     //   stateRunTreeBottom,
          //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
          //     //     (id: number) => graph.getStateById(id).name
          //     //   ),
          //     //   parent: graph.getStateById(
          //     //     stateRunTreeBottom[branchID]["parentStateID"]
          //     //   ).name,
          //     // });
          //   }
          // } else if (winningStateIDs.length > 1) {
          //   // parallel: not tested
          //   console.log("here NFA");
          //   let state = graph.getStateById(
          //     stateRunTreeBottom[branchID]["nextStates"][winningStateIDs[0]]
          //   );

          //   console.log({ state });
          //   // chldren
          //   winningStateIDs.forEach((winningStateID: number, i: number) => {
          //     let state = graph.getStateById(
          //       stateRunTreeBottom[branchID]["nextStates"][winningStateID]
          //     );

          //     if (i > 1) {
          //       if (state.start?.length > 0) {
          //         let parentID = stateRunTreeBottom[branchID]["parentStateID"];
          //         const parentState = graph.getStateById(parentID);
          //         parentState.activeChildStatesCount += 1;
          //         state.branchIDParentID[branchID] =
          //           stateRunTreeBottom[branchID]["parentStateID"];
          //         stateRunTreeBottom[Object.keys(stateRunTreeBottom).length] = {
          //           isParallel: state.areChildrenParallel,
          //           nextStates: state.start.map(
          //             (startStateName: string[]) =>
          //               graph.getState(startStateName).id
          //           ),
          //           parentStateID: state.id,
          //         };
          //       } else if (state.next?.length > 0) {
          //         let parentID = stateRunTreeBottom[branchID]["parentStateID"];
          //         const parentState = graph.getStateById(parentID);
          //         parentState.activeChildStatesCount += 1;
          //         state.branchIDParentID[branchID] =
          //           stateRunTreeBottom[branchID]["parentStateID"];

          //         stateRunTreeBottom[Object.keys(stateRunTreeBottom).length] = {
          //           isParallel: state.areNextParallel,
          //           nextStates: state.next.map(
          //             (startStateName: string[]) =>
          //               graph.getState(startStateName).id
          //           ),
          //           parentStateID: parentState.id,
          //         };
          //       } else if (state.next === undefined) {
          //         let parentID = stateRunTreeBottom[branchID]["parentStateID"];
          //         const parentState = graph.getStateById(parentID);

          //         while (parentState.activeChildStatesCount === 0) {
          //           const parentState = graph.getStateById(parentID);
          //           console.log({ parentState });
          //           if (parentState.next?.length > 0) {
          //             stateRunTreeBottom[branchID] = {
          //               ...stateRunTreeBottom[branchID],
          //               nextStates: parentState.next.map(
          //                 (startStateName: string[]) =>
          //                   graph.getState(startStateName).id
          //               ),
          //               parentStateID: parentState.branchIDParentID[branchID],
          //             };
          //             break;
          //           }
          //           parentID = parentState.branchIDParentID[branchID];
          //           delete parentState.branchIDParentID[branchID];
          //         }
          //         if (parentState.activeChildStatesCount > 0) {
          //           parentState.activeChildStatesCount -= 1;
          //           delete stateRunTreeBottom[branchID];
          //         }
          //       }
          //     } else {
          //     }
          //     // each winning state is now a parent state
          //     // let state = graph.getStateById(winningStateID);
          //     // if (state.start?.length > 0) {
          //     //   // children states
          //     // } else if (state.next?.length > 0) {
          //     //   // children states
          //     // } else if (state.next?.length === 0) {
          //     //   // end state
          //     // }
          //   });
          // }

          if (
            !originalBranchChanged &&
            originalBranchSpawnedDifferentChildBranch
          ) {
            delete stateRunTreeBottom[branchID];
          }
          Object.keys(stateRunTreeBottom).forEach((branchID: string) => {
            console.log(`branch id ${branchID}`);
            console.log(
              `  isParallel: ${
                stateRunTreeBottom[Number(branchID)]["isParallel"]
              }`
            );
            console.log(`  nextStates:`);
            stateRunTreeBottom[Number(branchID)]["nextStates"].forEach(
              (nextState: string) => {
                console.log(
                  `   ${graph.getStateById(Number(nextState)).name.join("/ ")}`
                );
              }
            );
            console.log(
              `   parentState: ${graph
                .getStateById(
                  stateRunTreeBottom[Number(branchID)]["parentStateID"]
                )
                .name.join("/ ")}`
            );
            console.log(
              `   parent activeChildStatesCount: ${
                graph.getStateById(
                  stateRunTreeBottom[Number(branchID)]["parentStateID"]
                ).activeChildStatesCount
              }`
            );
            let x = graph.getStateById(
              stateRunTreeBottom[Number(branchID)]["parentStateID"]
            ).branchIDParentIDParentBranchID;
            console.log(
              `   parent branchIDParentIDParentBranchID: ${Object.keys(x).map(
                (item: string) => {
                  const parentID = Number(Object.keys(x[Number(item)])[0]);

                  return `${item}: {${graph.getStateById(parentID).name}: ${
                    x[Number(item)][parentID]
                  }}`;
                }
              )}`
            );
          });
          console.log("---------------");
          // console.log({ tempBottom });
        });
        console.log("########################");
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
