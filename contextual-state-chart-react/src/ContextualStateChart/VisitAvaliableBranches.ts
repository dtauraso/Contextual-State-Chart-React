import { isConstructorDeclaration } from "typescript";
import { ControlFlowState, Graph } from "../App.types";
import { VisitBranches } from "./Visitor";
/*
    1)variable usage easy language api(similar to default language syntax)
    2)recording variable(all kinds of variables) changes so each state can show what changed
   3) arbitrarily complex context and indefinite levels of granulity(so user can understand the program and
      think more about the context of the problem to solve)
      3.5)let each state connect to any other state and any number of states
    4)handle async and sync processes by design
    5)clean standard way for me and other users to use(part of backend design and all of frontend)
      graph, lines, hierarchy, views, side vews, modes
    6)not requiring any external libraries except for some standard libraries for the front end
        */
let tree = ["tree"];

// all branches should be able to run independently and terminate when they are done reguardless of how and when
// VisitAvaliableBranches is called

const testAtStateRunCount = (stateRunCount: number, graph: Graph) => {
  if (stateRunCount === 5) {
    const NFA = graph.getStateById(1);
    const state_0 = graph.getStateById(2);
    const state_1 = graph.getStateById(3);
    const state_2 = graph.getStateById(16);
    const state_3 = graph.getStateById(4);
    const state_4 = graph.getStateById(5);
    const state_5 = graph.getStateById(17);
    const state_6 = graph.getStateById(19);
    const state_7 = graph.getStateById(6);
    const state_9 = graph.getStateById(8);
    const state_10 = graph.getStateById(20);
    const states = [
      NFA,
      state_0,
      state_1,
      state_2,
      state_3,
      state_4,
      state_5,
      state_6,
      state_7,
      state_9,
      state_10,
    ];
    // states.forEach((state) => {
    //   console.log({
    //     name: state.name.join(", "),
    //     id: state.id,
    //   });
    //   Object.keys(state.branchIDParentIDParentBranchID).forEach((branchID) => {
    //     console.log({
    //       branchID,
    //     });
    //     const { activeChildStatesCount, parentBranch } =
    //       state.branchIDParentIDParentBranchID[Number(branchID)];
    //     const { parentID, parentBranchID } = parentBranch;
    //     console.log({
    //       activeChildStatesCount,
    //       parentID,
    //       parentBranchID,
    //     });
    //   });
    //   console.log("\n\n");
    // });
    return (
      state_0.branchIDParentIDParentBranchID["0"].activeChildStatesCount ===
        2 &&
      state_2.branchIDParentIDParentBranchID["1"].activeChildStatesCount === 2
    );
  }
};
const VisitAvaliableBranches = (
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
      if (testAtStateRunCount(statesRun, graph)) {
        console.log("passes");
      }
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
        const { currentStateID, nextStates, isParallel } =
          stateRunTreeBottom["branches"][branchID];
        let winningStatePositions = [-1];
        if (!isParallel) {
          graph
            .getStateById(currentStateID)
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
            .getStateById(currentStateID)
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
        let winningState;
        // save original branch data before it is replaced
        // const { isParallel, nextStates, parentStateID } =
        //   stateRunTreeBottom["branches"][branchID];

        console.log({ branchID });
        let originalBranchChanged = false;
        let originalBranchIDSpawnedDifferentChildBranchID = false;
        // save branch tracker data for all successfull states
        // branch adjustment
        // if next
        //    use winning state's parent id for the link
        //  else if start
        //    use winning state id for the link
        // make new branches
        // if the winning states are from start
        //    update new branches with new levels
        winningStatePositions.forEach((winningStateID: number, i: number) => {
          let currentBranchID = -1;
          const edges: string[][] = graph
            .getStateById(currentStateID)
            .getEdges(nextStates);
          // all new branches will also have the same parent state
          winningState = graph.getState(edges[winningStateID]);
          if (i > 0) {
            stateRunTreeBottom["maxBranchID"] += 1;
            currentBranchID = stateRunTreeBottom["maxBranchID"];
            stateRunTreeBottom["branches"][currentBranchID] = {};
          } else {
            currentBranchID = branchID;
          }
          let parentStateID: number = -1;
          if (nextStates === "start") {
            parentStateID = currentStateID;
          } else if (nextStates === "next") {
            const {
              branchIDParentIDParentBranchID: {
                [branchID]: {
                  parentBranch: { parentID },
                },
              },
            } = winningState;
            parentStateID = parentID;
          }

          winningState.branchIDParentIDParentBranchID[currentBranchID] = {
            activeChildStatesCount: 0,
            parentBranch: {
              parentID: parentStateID,
              parentBranchID: branchID,
            },
          };
          const parentState = graph.getStateById(parentStateID);
          parentState.branchIDParentIDParentBranchID[
            branchID
          ].activeChildStatesCount += 1;
          // parentState.activeChildStatesCount += 1;
          stateRunTreeBottom["branches"][currentBranchID] = {
            currentStateID: winningState.id,
          };
          if (i === 0) {
            originalBranchChanged = true;
          } else if (i > 0) {
            originalBranchIDSpawnedDifferentChildBranchID = true;
          }
        });
        if (
          !originalBranchChanged &&
          originalBranchIDSpawnedDifferentChildBranchID
        ) {
          delete stateRunTreeBottom["branches"][branchID];
        }
        console.log({ states: graph.statesObject.states });
      });

    Object.keys(stateRunTreeBottom["branches"])
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        const { currentStateID } = stateRunTreeBottom["branches"][branchID];

        const winningState = graph.getStateById(currentStateID);
        if (winningState.start?.length > 0) {
          stateRunTreeBottom["branches"][branchID] = {
            currentStateID,
            nextStates: "start",
            isParallel: winningState.areChildrenParallel,
          };
        } else if (winningState.next?.length > 0) {
          stateRunTreeBottom["branches"][branchID] = {
            currentStateID,
            nextStates: "next",
            isParallel: winningState.areNextParallel,
          };
        } else if (winningState.next === undefined) {
          let parentID =
            winningState.branchIDParentIDParentBranchID[branchID].parentBranch
              .parentID;
          let parentBranchID: number =
            winningState.branchIDParentIDParentBranchID[branchID].parentBranch
              .parentBranchID;
          // let { parentID, parentBranchID } =
          //   winningState.branchIDParentIDParentBranchID[branchID].parentBranch;
          let parentState = graph.getStateById(parentID);

          // console.log({
          //   branchID,
          //   parentStateID,
          //   parentBranchID,
          //   states: graph.statesObject.states,
          // });
          // console.log({
          //   name: parentState.name.join(", "),
          //   activeChildCount: parentState.activeChildStatesCount,
          // });
          console.log("end state", {
            parentBranchID,
            branchID,
            aCSC: JSON.parse(
              JSON.stringify(
                parentState.branchIDParentIDParentBranchID[parentBranchID]
                  .activeChildStatesCount
              )
            ),
            winningStateName: winningState.name.join(","),
            parentStateName: parentState.name.join(","),
          });
          let prevBranchID = branchID;
          let count = 0;
          while (parentBranchID !== -1) {
            console.log({ count, prevBranchID, parentBranchID });
            // if (count >= 6) {
            //   console.log("leaving");
            //   break;
            // }
            // move branch up or delete it

            const { activeChildStatesCount } =
              parentState.branchIDParentIDParentBranchID[parentBranchID];
            if (activeChildStatesCount > 1) {
              // console.log("delete");

              // 1 path split into multiple children paths
              delete stateRunTreeBottom["branches"][branchID];
              parentState.branchIDParentIDParentBranchID[
                parentBranchID
              ].activeChildStatesCount -= 1;

              if (activeChildStatesCount > 0) {
                // console.log("leave");
                break;
              }
            } else if (activeChildStatesCount === 1) {
              console.log("move up tree");

              // move from winning child state to parent state

              if (parentBranchID === -1) {
                // print current state name
                console.log({ name: parentState.name.join(", ") });

                //    delete branch
                break;
              }
              stateRunTreeBottom["branches"][parentBranchID] = {
                currentStateID: parentState.id,
                nextStates: parentState.next !== undefined ? "next" : undefined,
                isParallel: parentState.areNextParallel,
              };
              if (parentBranchID !== prevBranchID) {
                delete stateRunTreeBottom["branches"][prevBranchID];
              }
              parentState.branchIDParentIDParentBranchID[
                parentBranchID
              ].activeChildStatesCount -= 1;
              const { currentStateID } =
                stateRunTreeBottom["branches"][parentBranchID];
              const currentState = graph.getStateById(currentStateID);
              if (currentState.next === undefined) {
                // break;
                console.log({ name: currentState.name.join(", ") });
                // print current state name
              }
              // console.log({
              //   currentState,
              //   parentBranchID,
              //   items: currentState.branchIDParentIDParentBranchID,
              // });
              // console.log({
              //   parentBranchID,
              //   keys: Object.keys(currentState.branchIDParentIDParentBranchID),
              //   test:
              //     parentBranchID in currentState.branchIDParentIDParentBranchID,
              //   branchData: currentState.branchIDParentIDParentBranchID,
              // });
              parentID =
                currentState.branchIDParentIDParentBranchID[parentBranchID]
                  .parentBranch.parentID;

              prevBranchID = parentBranchID;
              parentBranchID =
                currentState.branchIDParentIDParentBranchID[parentBranchID]
                  .parentBranch.parentBranchID;
              parentState = graph.getStateById(parentID);
              console.log("passed incrementng", {
                parentID,
                prevBranchID,
                parentBranchID,
                currentState,
                test: prevBranchID !== parentBranchID,
              });
              // let x = JSON.parse(
              //   JSON.stringify(currentState.branchIDParentIDParentBranchID)
              // );

              // parentState =
              // if (currentState.next?.length > 0) {
              // break
              // }
            }
            console.log("done adjusting");
            count += 1;
          }

          // remove end branch
          // what if there are 5 parents using a single branch

          /*
          end conditons for while
          parentState.activeChildStatesCount > 1 || 
          Object.keys(parentState.branchIDParentIDParentBranchID) === 0

          what if there are edges but not an edge for branchID
          current state's parentBranchID is in parentState.branchIDParentIDParentBranchID
          parent state is runnng 1 thing and child branch connects to any one of the parent branches
  
          while (
            parentState.activeChildStatesCount === 1 &&
            parentBranchID !== -1
          ) {}
          */
          // console.log("backtrack");
          // while (
          //   parentState.activeChildStatesCount === 1 &&
          //   parentBranchID !== -1
          // ) {
          //   parentIDparentBranchID =
          //     parentState.branchIDParentIDParentBranchID[parentBranchID];
          //   parentStateID = Number(Object.keys(parentIDparentBranchID)[0]);
          //   parentBranchID = parentIDparentBranchID[parentStateID];
          //   parentState = graph.getStateById(parentStateID);
          // }
        }
      });
    // edges adjustment
    // each branch is a winning state
    // if a winning state have start states
    //      setup new branch with the start state
    // else if a winning state have next states
    //      setup new branch with next states
    // else if a winning state has no next
    //        backtrack and start again on nearest next state unless path ends first

    // winningStatePositions.forEach((winningStateID: number, i: number) => {
    //   let currentBranchID = -1;
    //   const edges: string[][] = graph
    //     .getStateById(currentStateID)
    //     .getEdges(nextStates);
    //   // all new branches will also have the same parent state
    //   winningState = graph.getState(edges[winningStateID]);
    //   if (i > 0) {
    //     stateRunTreeBottom["maxBranchID"] += 1;
    //     currentBranchID = stateRunTreeBottom["maxBranchID"];
    //     if (winningState.start?.length > 0) {
    //       // add new empty branch
    //       stateRunTreeBottom["branches"][currentBranchID] = {};
    //     }
    //   } else {
    //     currentBranchID = branchID;
    //   }

    //   // console.log({ state });
    //   if (winningState.start?.length > 0) {
    //     // children states
    //     // same parent for each new branch

    //     winningState.branchIDParentIDParentBranchID[currentBranchID] = {
    //       [currentStateID]: branchID,
    //     };

    //     winningState.activeChildStatesCount += 1;

    //     stateRunTreeBottom["branches"][currentBranchID] = {
    //       nextStates: "start",
    //       parentStateID: winningState.id,
    //       isParallel: winningState.areChildrenParallel,
    //     };
    //     if (i === 0) {
    //       originalBranchChanged = true;
    //     } else if (i > 0) {
    //       originalBranchIDSpawnedDifferentChildBranchID = true;
    //     }
    //   } else if (winningState.next?.length > 0) {
    //     // passing for each round
    //   } else if (winningState.next === undefined) {
    //     // path merge condition
    //     // traverse branchID's up untill there is only 1 entry in parent's branchIDParentIDParentBranchID table
    //     // delete parent condition
    //     // parent's active child state count === 1
    //     // activeChildStatesCount should match the number of child branches in the bottom level
    //     // when parents are erased from table, does that mean activeChildStatesCount should decrease
    //     // by 1
    //     // no, because the branch paths have not been deleted yet
    //     if (
    //       Object.keys(
    //         graph.getStateById(currentStateID)
    //           .branchIDParentIDParentBranchID
    //       ).length > 1
    //     ) {
    //       console.log({ name: winningState.name.join(", ") });
    //       // this case should not run for state ["8"], because the branch would be replaced by it's parent
    //       // when there are more states to try
    //       const parentIDparentBranchID =
    //         graph.getStateById(currentStateID)
    //           .branchIDParentIDParentBranchID[branchID];
    //       const newParentStateID = Number(
    //         Object.keys(parentIDparentBranchID)[0]
    //       );
    //       const newParentBranchID =
    //         parentIDparentBranchID[newParentStateID];

    //       const newParentState = graph.getStateById(newParentBranchID);
    //       stateRunTreeBottom["branches"][newParentBranchID] = {
    //         currentStateID: newParentState.id,
    //         nextStates: "next",
    //         isParallel: newParentState.areNextParallel,
    //       };
    //       delete stateRunTreeBottom["branches"][branchID];
    //       // stop loop when branch ends or when next states length > 0
    //     }
    //   }
    //   // console.log({ currentBranchID, stateRunTreeBottom });
    //   // else if (state.next?.length > 0) {
    //   // delete branchID data from state after updating stateRunTreeBottom
    //   // same parent for each new branch
    //   //   parentState.activeChildStatesCount += 1;
    //   //   state.branchIDParentID[currentBranchID] = parentState.id;

    //   //   stateRunTreeBottom[currentBranchID] = {
    //   //     ...stateRunTreeBottom[currentBranchID],
    //   //     nextStates: state.next.map(
    //   //       (startStateName: string[]) => graph.getState(startStateName).id
    //   //     ),
    //   //     parentStateID: parentState.id,
    //   //     isParallel: state.areNextParallel,
    //   //   };
    //   // }
    //   //  else if (state.next === undefined) {
    //   //   let parentID = parentState.id;

    //   //   // if state machine has only 1 level this will happen first
    //   //   if (parentID !== -1) {
    //   //     // DFA and NFA stop condition
    //   //     while (parentState.activeChildStatesCount === 0) {
    //   //       parentState = graph.getStateById(parentID);
    //   //       console.log({ parentState });
    //   //       if (parentState.next?.length > 0) {
    //   //         stateRunTreeBottom[currentBranchID] = {
    //   //           ...stateRunTreeBottom[currentBranchID],
    //   //           nextStates: parentState.next.map(
    //   //             (startStateName: string[]) =>
    //   //               graph.getState(startStateName).id
    //   //           ),
    //   //           parentStateID:
    //   //             parentState.branchIDParentID[currentBranchID],
    //   //         };
    //   //         break;
    //   //       }
    //   //       parentState.activeChildStatesCount -= 1;
    //   //       parentID = parentState.branchIDParentID[currentBranchID];

    //   //       delete parentState.branchIDParentID[currentBranchID];
    //   //       // DFA only stop condition
    //   //       if (parentID === -1) {
    //   //         break;
    //   //       }
    //   //       parentState = graph.getStateById(parentID);
    //   //     }
    //   //   }
    //   // }

    //   //   let state = graph.getStateById(
    //   //     stateRunTreeBottom[branchID]["nextStates"][winningStateID]
    //   //   );

    //   //   // else
    //   //   return 0;
    //   //   // traversing up end condition
    //   //   // let parentID = stateRunTreeBottom[branchID]["parentStateID"];

    //   //   // parentID !== -1; DFA only end condition
    //   //   // const parentState = graph.getStateById(parentID);

    //   //   // DFA and NFA end condition
    //   //   // parentState.activeChildStatesCount === 0;
    //   // });
    //   // if (winningStateIDs[0] === -1) {
    //   //   // all the states failed
    //   // } else if (winningStateIDs.length === 1) {
    //   //   // winning state is now a parent state
    //   //   let state = graph.getStateById(
    //   //     stateRunTreeBottom[branchID]["nextStates"][winningStateIDs[0]]
    //   //   );
    //   //   // console.log({ state });
    //   //   if (state.start?.length > 0) {
    //   //     // children states
    //   //     state.branchIDParentID[branchID] =
    //   //       stateRunTreeBottom[branchID]["parentStateID"];
    //   //     stateRunTreeBottom[branchID] = {
    //   //       ...stateRunTreeBottom[branchID],
    //   //       nextStates: state.start.map(
    //   //         (startStateName: string[]) => graph.getState(startStateName).id
    //   //       ),
    //   //       parentStateID: state.id,
    //   //       isParallel: state.areChildrenParallel,
    //   //     };
    //   //     // console.log({
    //   //     //   state,
    //   //     //   stateRunTreeBottom,
    //   //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
    //   //     //     (id: number) => graph.getStateById(id).name
    //   //     //   ),
    //   //     //   parent: graph.getStateById(
    //   //     //     stateRunTreeBottom[branchID]["parentStateID"]
    //   //     //   ).name,
    //   //     // });
    //   //   } else if (state.next?.length > 0) {
    //   //     // console.log("here now");
    //   //     // stateRunTreeBottom = [];
    //   //     statesRun += 1;
    //   //     // next states
    //   //     state.branchIDParentID[branchID] =
    //   //       stateRunTreeBottom[branchID]["parentStateID"];
    //   //     stateRunTreeBottom[branchID] = {
    //   //       ...stateRunTreeBottom[branchID],
    //   //       nextStates: state.next.map(
    //   //         (startStateName: string[]) => graph.getState(startStateName).id
    //   //       ),
    //   //       isParallel: state.areNextParallel,
    //   //     };
    //   //     // console.log({
    //   //     //   state,
    //   //     //   stateRunTreeBottom,
    //   //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
    //   //     //     (id: number) => graph.getStateById(id).name
    //   //     //   ),
    //   //     //   parent: graph.getStateById(
    //   //     //     stateRunTreeBottom[branchID]["parentStateID"]
    //   //     //   ).name,
    //   //     // });
    //   //   } else if (state.next === undefined) {
    //   //     // console.log({ state }, "is end state");
    //   //     // console.log({
    //   //     //   state,
    //   //     //   stateRunTreeBottom,
    //   //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
    //   //     //     (id: number) => graph.getStateById(id).name
    //   //     //   ),
    //   //     //   parent: graph.getStateById(
    //   //     //     stateRunTreeBottom[branchID]["parentStateID"]
    //   //     //   ).name,
    //   //     // });
    //   //     // end state
    //   //     let parentID = stateRunTreeBottom[branchID]["parentStateID"];
    //   //     // DFA stop condition
    //   //     while (parentID !== -1) {
    //   //       const parentState = graph.getStateById(parentID);
    //   //       console.log({ parentState });
    //   //       if (parentState.next?.length > 0) {
    //   //         stateRunTreeBottom[branchID] = {
    //   //           ...stateRunTreeBottom[branchID],
    //   //           nextStates: parentState.next.map(
    //   //             (startStateName: string[]) =>
    //   //               graph.getState(startStateName).id
    //   //           ),
    //   //           parentStateID: parentState.branchIDParentID[branchID],
    //   //         };
    //   //         break;
    //   //       }
    //   //       parentID = parentState.branchIDParentID[branchID];
    //   //       delete parentState.branchIDParentID[branchID];
    //   //     }
    //   //     // console.log("done traveling up", { parentID });
    //   //     // console.log({
    //   //     //   state: graph.getStateById(parentID),
    //   //     //   stateRunTreeBottom,
    //   //     //   nextStates: stateRunTreeBottom[branchID]["nextStates"].map(
    //   //     //     (id: number) => graph.getStateById(id).name
    //   //     //   ),
    //   //     //   parent: graph.getStateById(
    //   //     //     stateRunTreeBottom[branchID]["parentStateID"]
    //   //     //   ).name,
    //   //     // });
    //   //   }
    //   // } else if (winningStateIDs.length > 1) {
    //   //   // parallel: not tested
    //   //   console.log("here NFA");
    //   //   let state = graph.getStateById(
    //   //     stateRunTreeBottom[branchID]["nextStates"][winningStateIDs[0]]
    //   //   );

    //   //   console.log({ state });
    //   //   // chldren
    //   //   winningStateIDs.forEach((winningStateID: number, i: number) => {
    //   //     let state = graph.getStateById(
    //   //       stateRunTreeBottom[branchID]["nextStates"][winningStateID]
    //   //     );

    //   //     if (i > 1) {
    //   //       if (state.start?.length > 0) {
    //   //         let parentID = stateRunTreeBottom[branchID]["parentStateID"];
    //   //         const parentState = graph.getStateById(parentID);
    //   //         parentState.activeChildStatesCount += 1;
    //   //         state.branchIDParentID[branchID] =
    //   //           stateRunTreeBottom[branchID]["parentStateID"];
    //   //         stateRunTreeBottom[Object.keys(stateRunTreeBottom).length] = {
    //   //           isParallel: state.areChildrenParallel,
    //   //           nextStates: state.start.map(
    //   //             (startStateName: string[]) =>
    //   //               graph.getState(startStateName).id
    //   //           ),
    //   //           parentStateID: state.id,
    //   //         };
    //   //       } else if (state.next?.length > 0) {
    //   //         let parentID = stateRunTreeBottom[branchID]["parentStateID"];
    //   //         const parentState = graph.getStateById(parentID);
    //   //         parentState.activeChildStatesCount += 1;
    //   //         state.branchIDParentID[branchID] =
    //   //           stateRunTreeBottom[branchID]["parentStateID"];

    //   //         stateRunTreeBottom[Object.keys(stateRunTreeBottom).length] = {
    //   //           isParallel: state.areNextParallel,
    //   //           nextStates: state.next.map(
    //   //             (startStateName: string[]) =>
    //   //               graph.getState(startStateName).id
    //   //           ),
    //   //           parentStateID: parentState.id,
    //   //         };
    //   //       } else if (state.next === undefined) {
    //   //         let parentID = stateRunTreeBottom[branchID]["parentStateID"];
    //   //         const parentState = graph.getStateById(parentID);

    //   //         while (parentState.activeChildStatesCount === 0) {
    //   //           const parentState = graph.getStateById(parentID);
    //   //           console.log({ parentState });
    //   //           if (parentState.next?.length > 0) {
    //   //             stateRunTreeBottom[branchID] = {
    //   //               ...stateRunTreeBottom[branchID],
    //   //               nextStates: parentState.next.map(
    //   //                 (startStateName: string[]) =>
    //   //                   graph.getState(startStateName).id
    //   //               ),
    //   //               parentStateID: parentState.branchIDParentID[branchID],
    //   //             };
    //   //             break;
    //   //           }
    //   //           parentID = parentState.branchIDParentID[branchID];
    //   //           delete parentState.branchIDParentID[branchID];
    //   //         }
    //   //         if (parentState.activeChildStatesCount > 0) {
    //   //           parentState.activeChildStatesCount -= 1;
    //   //           delete stateRunTreeBottom[branchID];
    //   //         }
    //   //       }
    //   //     } else {
    //   //     }
    //   //     // each winning state is now a parent state
    //   //     // let state = graph.getStateById(winningStateID);
    //   //     // if (state.start?.length > 0) {
    //   //     //   // children states
    //   //     // } else if (state.next?.length > 0) {
    //   //     //   // children states
    //   //     // } else if (state.next?.length === 0) {
    //   //     //   // end state
    //   //     // }
    //   //   });
    //   // }
    //   // console.log({ stateRunTreeBottom, graph });

    //   // console.log({ tempBottom });
    // });
    console.log("after changes");
    Object.keys(stateRunTreeBottom["branches"])
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        const { currentStateID, nextStates, isParallel } =
          stateRunTreeBottom["branches"][branchID] || {};

        console.log(`branch id ${branchID}`);
        console.log(`  isParallel: ${isParallel}`);
        if (nextStates !== undefined) {
          console.log(`  nextStates:`);

          graph
            .getStateById(currentStateID)
            .getEdges(nextStates)
            .forEach((nextStateName: string[]) => {
              const { name } = graph.getState(nextStateName);
              console.log(`   ${name.join("/ ")}`);
            });
        } else {
          console.log(`  nextStates: undefined`);
        }
        const { name } = graph.getStateById(currentStateID);
        console.log(
          `   currentState name: ${name.join("/ ")}, id: ${currentStateID}`
        );
        // console.log(
        //   `   current activeChildStatesCount: ${
        //     graph.getStateById(currentStateID).activeChildStatesCount
        //   }`
        // );
        let { branchIDParentIDParentBranchID } =
          graph.getStateById(currentStateID);
        console.log(
          `   current branchIDParentIDParentBranchID: \n       ${Object.keys(
            branchIDParentIDParentBranchID
          )
            .map((item: string) => Number(item))
            .map((key: number) => {
              const {
                [key]: {
                  activeChildStatesCount,
                  parentBranch: { parentID, parentBranchID },
                },
              } = branchIDParentIDParentBranchID;
              const { name } = graph.getStateById(parentID);
              return `branchID ${key}: {activeChildStatesCount: ${activeChildStatesCount}, parentBranch: { parent name ${name}:  parentBranchID ${parentBranchID}}}`;
            })
            .join(", \n       ")}`
        );
      });
    console.log("---------------");
    // if (
    //   !originalBranchChanged &&
    //   originalBranchIDSpawnedDifferentChildBranchID
    // ) {
    //   delete stateRunTreeBottom["branches"][branchID];
    // }

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
