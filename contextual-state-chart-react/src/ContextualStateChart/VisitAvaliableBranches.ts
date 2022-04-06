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
    7) hierarchy of states
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
  while (Object.keys(stateRunTreeBottom.branches).length > 0) {
    console.log({ statesRun });
    if (statesRun >= 8) {
      if (testAtStateRunCount(statesRun, graph)) {
        console.log("passes");
      }
      console.log("too many states were run");
      break;
    }
    // console.log({
    //   stateRunTreeBottom: JSON.parse(JSON.stringify(stateRunTreeBottom)),
    // });
    // new timelines
    // the 1, nth state run
    // any state that already has branches running at the time it's tried
    // always put variable init on a new timeline
    // first timelines also need a timeline for the variable init
    // if the current timeline only has init variables, make new timeline for them
    Object.keys(stateRunTreeBottom["branches"])
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        // if (statesRun >= 10) {
        //   console.log("too many states were run");
        //   stateRunTreeBottom["branches"] = {};
        //   return;
        // }
        const { currentStateID, nextStates, isParallel } =
          stateRunTreeBottom["branches"][branchID];
        let winningStatePositions = [-1];

        graph
          .getStateById(currentStateID)
          .getEdges(nextStates)
          .forEach((nextStateName: string[], i: number) => {
            if (!isParallel) {
              if (winningStatePositions[0] >= 0) {
                return;
              }
            }
            // console.log({ nextStateName });
            const state = graph.getState(nextStateName);
            if (isParallel) {
            }
            /**
            don't use the state function for timeline communication
            assume all connected timelines will run at the same time.
            each branch maps to a different variable
            currently setup to always use the selected timeline
            how to make new 1:1 mappings when there are new cashiers and new customers
              
            selectedTimeline(timelineA): 0, // from stateRunTreeBottom["branches"]
              currentTimelineIDs: {
                selectedTimelineNumber: {
                  timelineIDOfOtherTimeline: -1,  when is this value used; how is this value used to enforce 1:1 mapping
                },
              },
            many cashiers many customers
            make sure 1 cashier maps to 1 customer
            each cashier and each customer is time independent
            1 branchID link table inside cashier and customer states
              each state refers to the link table of their parent
            n branchID link tables
              name is id of the states
              the same state is run for each cashier
            definitions for making a new branch
            when is the variable set setup for each branch
            recording states
            before running
              if state is parallel
                if state has >= 1 branchs attached to it
                  branchID++
                  parallelEnumerationOfCurrentState
              if nextStateName.linkToDifferentTimeline is true
                parallelEnumerationOfCurrentState = stateRunTreeBottom["branches"][branchID]["parallelEnumerationOfCurrentState"]
                if state.stateRunCounts[branchID].differentTimelineCountBeforeRunningState > 0
                  state.stateRunCounts[branchID].differentTimelineCountBeforeRunningState -= 1
                else if(state.stateRunCounts[branchID].differentTimelineCountBeforeRunningState === 0)
                  state.currentTimeline = branchID
                  run state
            after running
              state is the second to nth state successfully run

             */
            // console.log({ state });
            if (state.functionCode(graph)) {
              if (!isParallel) {
                winningStatePositions[0] = i;
              } else if (isParallel) {
                if (winningStatePositions[0] === -1) {
                  winningStatePositions[0] = i;
                } else {
                  // winningStatePositions.push({newBranch: true, winningStatePosition: i})
                  winningStatePositions.push(i);
                }
              }
            }
          });

        //   // console.log("here");
        //   // stateRunTreeBottom = [];
        // }
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

        // console.log({ branchID });
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
          // const {winning}
          let currentBranchID = -1;
          const edges: string[][] = graph
            .getStateById(currentStateID)
            .getEdges(nextStates);
          // all new branches will also have the same parent state
          winningState = graph.getState(edges[winningStateID]);
          ///////////
          if (i > 0) {
            stateRunTreeBottom["maxBranchID"] += 1;
            currentBranchID = stateRunTreeBottom["maxBranchID"];
            stateRunTreeBottom["branches"][currentBranchID] = {};
          } else {
            currentBranchID = branchID;
          }
          ////////
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
          ////////
          if (i === 0) {
            originalBranchChanged = true;
          } else if (i > 0) {
            originalBranchIDSpawnedDifferentChildBranchID = true;
          }
          /////////
        });
        ////////
        if (
          !originalBranchChanged &&
          originalBranchIDSpawnedDifferentChildBranchID
        ) {
          // delete stateRunTreeBottom["branches"][branchID];
        }
        //////////
        // console.log({ states: graph.statesObject.states });
      });

    // edges adjustment
    // each branch is a winning state
    // if a winning state have start states
    //      setup new branch with the start state
    // else if a winning state have next states
    //      setup new branch with next states
    // else if a winning state has no next
    //        backtrack and start again on nearest next state unless path ends first

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
          let { parentID, parentBranchID } =
            winningState.branchIDParentIDParentBranchID[branchID].parentBranch;

          let parentState = graph.getStateById(parentID);

          let prevBranchID = branchID;
          // let count = 0;
          while (parentBranchID !== -1) {
            // console.log({ count, prevBranchID, parentBranchID });
            // if (count >= 6) {
            //   console.log("leaving");
            //   break;
            // }
            // move branch up or delete it

            const { activeChildStatesCount } =
              parentState.branchIDParentIDParentBranchID[parentBranchID];
            if (activeChildStatesCount > 1) {
              // 1 path split into multiple children paths
              delete stateRunTreeBottom["branches"][prevBranchID];
              parentState.branchIDParentIDParentBranchID[
                parentBranchID
              ].activeChildStatesCount -= 1;

              if (activeChildStatesCount > 0) {
                break;
              }
            } else if (activeChildStatesCount === 1) {
              // move from winning child state to parent state
              if (parentBranchID === -1) {
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
              prevBranchID = parentBranchID;

              parentID =
                currentState.branchIDParentIDParentBranchID[parentBranchID]
                  .parentBranch.parentID;

              parentBranchID =
                currentState.branchIDParentIDParentBranchID[parentBranchID]
                  .parentBranch.parentBranchID;
              parentState = graph.getStateById(parentID);
            }
            if (parentBranchID === -1) {
              const { currentStateID } =
                stateRunTreeBottom["branches"][prevBranchID];
              const currentState = graph.getStateById(currentStateID);
              if (currentState.next === undefined) {
                delete stateRunTreeBottom["branches"][prevBranchID];
              } else {
                stateRunTreeBottom["branches"][prevBranchID] = {
                  currentStateID: currentState.id,
                  nextStates:
                    currentState.next !== undefined ? "next" : undefined,
                  isParallel: currentState.areNextParallel,
                };
              }
            }
            // count += 1;
          }
        }
      });
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
