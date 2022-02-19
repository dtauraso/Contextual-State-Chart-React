import { isConstructorDeclaration } from "typescript";
import { ControlFlowState, Graph } from "../App.types";
import { VisitBranches } from "./Visitor";
let tree = ["tree"];

// all branches should be able to run independently and terminate when they are done reguardless of how and when
// VisitAvaliableBranches is called

const VisitAvaliableBranches = (
  startStateName: string[],
  graph: Graph,
  stateRunTreeBottom: {
    branches: {
      [branchID: number]: any;
    };
    maxBranchID: number;
  }
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
    if (statesRun >= 6) {
      console.log("too many states were run");
      break;
    }
    console.log({
      stateRunTreeBottom: JSON.parse(JSON.stringify(stateRunTreeBottom)),
    });

    Object.keys(stateRunTreeBottom["branches"])
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        // fails when statesRun === 8
        // if (statesRun >= 10) {
        //   console.log("too many states were run");
        //   stateRunTreeBottom["branches"] = {};
        //   return;
        // }
        const { parentStateID, nextStates, isParallel } =
          stateRunTreeBottom["branches"][branchID];
        let winningStatePositions = [-1];
        if (!isParallel) {
          graph
            .getStateById(parentStateID)
            .getEdges(nextStates)
            .forEach((nextStateName: string[], i: number) => {
              if (winningStatePositions[0] >= 0) {
                return;
              }
              console.log({ nextStateName });
              const state = graph.getState(nextStateName);
              console.log({ state });
              if (state.functionCode(graph)) {
                winningStatePositions[0] = i;
              }
            });
        } else {
          // parallel: passes

          graph
            .getStateById(parentStateID)
            .getEdges(nextStates)
            .forEach((nextStateName: string[], i: number) => {
              const state = graph.getState(nextStateName);
              if (state.functionCode(graph)) {
                if (winningStatePositions[0] === -1) {
                  winningStatePositions[0] = i;
                } else {
                  winningStatePositions.push(i);
                }
              }
            });
          // console.log("here");
          // stateRunTreeBottom = [];
        }
        // console.log({
        //   winningStateIDsAsNames: winningStatePositions.map(
        //     (stateID: number) =>
        //       graph.getState(
        //         graph.getStateById(parentStateID).getEdges(nextStates)[stateID]
        //       ).name
        //   ),
        // });
        // console.log({ winningStatePositions });
        // need to refactor code
        let state;
        // save original branch data before it is replaced
        // const { isParallel, nextStates, parentStateID } =
        //   stateRunTreeBottom["branches"][branchID];

        console.log({ branchID });
        let originalBranchChanged = false;
        let originalBranchIDSpawnedDifferentChildBranchID = false;
        // save branch tracker data for all successfull states
        // branch adjustment
        // make new branches
        // if the winning states are from start
        //    update new branches with new levels

        // edges adjustment
        // if a winning state have start states
        //      setup new branch with the start state
        // else if a winning state have next states
        //      setup new branch with next states
        // else if a winning state has no next
        //        backtrack and start again on nearest next state unless path ends first

        winningStatePositions.forEach((winningStateID: number, i: number) => {
          let currentBranchID = -1;
          const edges: string[][] = graph
            .getStateById(parentStateID)
            .getEdges(nextStates);
          // all new branches will also have the same parent state
          state = graph.getState(edges[winningStateID]);
          if (i > 0) {
            stateRunTreeBottom["maxBranchID"] += 1;
            currentBranchID = stateRunTreeBottom["maxBranchID"];
            if (state.start?.length > 0) {
              // add new empty branch
              stateRunTreeBottom["branches"][currentBranchID] = {};
            }
          } else {
            currentBranchID = branchID;
          }

          // console.log({ state });
          if (state.start?.length > 0) {
            // children states
            // same parent for each new branch

            state.branchIDParentIDParentBranchID[currentBranchID] = {
              [parentStateID]: branchID,
            };

            state.activeChildStatesCount += 1;

            stateRunTreeBottom["branches"][currentBranchID] = {
              nextStates: "start",
              parentStateID: state.id,
              isParallel: state.areChildrenParallel,
            };
            if (i === 0) {
              originalBranchChanged = true;
            } else if (i > 0) {
              originalBranchIDSpawnedDifferentChildBranchID = true;
            }
          } else if (state.next?.length > 0) {
            // passing for each round
          } else if (state.next === undefined) {
            // path merge condition
            // traverse branchID's up untill there is only 1 entry in parent's branchIDParentIDParentBranchID table
            // delete parent condition
            // parent's active child state count === 1
            // activeChildStatesCount should match the number of child branches in the bottom level
            // when parents are erased from table, does that mean activeChildStatesCount should decrease
            // by 1
            // no, because the branch paths have not been deleted yet
            if (
              Object.keys(
                graph.getStateById(parentStateID).branchIDParentIDParentBranchID
              ).length > 1
            ) {
              console.log({ name: state.name.join(", ") });
              // this case should not run for state ["8"], because the branch would be replaced by it's parent
              // when there are more states to try
              const parentIDparentBranchID =
                graph.getStateById(parentStateID)
                  .branchIDParentIDParentBranchID[branchID];
              const newParentStateID = Number(
                Object.keys(parentIDparentBranchID)[0]
              );
              const newParentBranchID =
                parentIDparentBranchID[newParentStateID];

              const newParentState = graph.getStateById(newParentBranchID);
              stateRunTreeBottom["branches"][newParentBranchID] = {
                parentStateID: newParentState.id,
                nextStates: "next",
                isParallel: newParentState.areNextParallel,
              };
              delete stateRunTreeBottom["branches"][branchID];
              // stop loop when branch ends or when next states length > 0
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
          // console.log({ stateRunTreeBottom, graph });

          // console.log({ tempBottom });
        });
        console.log("after changes");
        Object.keys(stateRunTreeBottom["branches"])
          .map((branchID: string) => Number(branchID))
          .forEach((branchID: number) => {
            const { parentStateID, nextStates, isParallel } =
              stateRunTreeBottom["branches"][branchID] || {};

            console.log(`branch id ${branchID}`);
            console.log(`  isParallel: ${isParallel}`);
            console.log(`  nextStates:`);
            graph
              .getStateById(parentStateID)
              .getEdges(nextStates)
              .forEach((nextStateName: string[]) => {
                console.log(
                  `   ${graph.getState(nextStateName).name.join("/ ")}`
                );
              });
            console.log(
              `   parentState: ${graph
                .getStateById(parentStateID)
                .name.join("/ ")}`
            );
            console.log(
              `   parent activeChildStatesCount: ${
                graph.getStateById(parentStateID).activeChildStatesCount
              }`
            );
            let x =
              graph.getStateById(parentStateID).branchIDParentIDParentBranchID;
            console.log(
              `   parent branchIDParentIDParentBranchID: ${Object.keys(x)
                .map((item: string) => {
                  const parentID = Number(Object.keys(x[Number(item)])[0]);

                  return `${item}: {${graph.getStateById(parentID).name}: ${
                    x[Number(item)][parentID]
                  }}`;
                })
                .join(", ")}`
            );
          });
        console.log("---------------");
        if (
          !originalBranchChanged &&
          originalBranchIDSpawnedDifferentChildBranchID
        ) {
          delete stateRunTreeBottom["branches"][branchID];
        }

        return false;
      });
    console.log("########################");
    statesRun += 1;
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
