import { isConstructorDeclaration } from "typescript";
import { ControlFlowState, Graph, ActiveChildState } from "../App.types";
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
/*
stateRunTreeBottom
  bottom set of nodes on the separate timelines

*/
const VisitAvaliableBranches = (
  graph: Graph,
  stateRunTreeBottom: {
    branches: {
      [branchID: number]: any;
    };
    maxBranchID: number;
  },
  runTree: {
    [branchID: number]: {
      [stateID: number]: {
        activeChildStates: ActiveChildState[];
        parentID: number;
        parentBranchID: number;
        edgesGroupIndex: number;
      };
    };
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
    if (statesRun >= 20) {
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
    let winningBranchIDStateIDs: { [branchID: number]: number[] } = {};
    Object.keys(stateRunTreeBottom.branches)
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        // if (statesRun >= 10) {
        //   console.log("too many states were run");
        //   stateRunTreeBottom["branches"] = {};
        //   return;
        // }
        const { currentStateID, isStartActive, isParallel } =
          stateRunTreeBottom.branches[branchID];
        const { edgesGroupIndex } = runTree[branchID][currentStateID];
        // let winningStateIDs: number[] = [];
        winningBranchIDStateIDs[branchID] = [];
        /*
        sequential mode
          no change

        parallel mode
          0th state
            has active branches
              store branchID into state.currentBranchID
              function runs successfully
                is new branch
          1...(n - 1)th state
            store branchID into state.currentBranchID
            function runs successfully
              is new branch
        any 2nd to nth state is automatically a new branch(not true solely based on enumerated
          state)
        state 9 was already visited 3 times. how is the mecahnism different than what it's already
        doing and does it matter
        is the function running successfully always a condition for a new branch
        what happens when 2 parallel states don't pass function run at the same time
        both states will be true but not in the same loop
        1) not retrying the same parallel state that already passed
        2) setting up all next states to run again when the initial state runs successfully
        3) making new timelines even when only 1 timeline even if there are no active branches?
        3.5) delayed timing vs how to know when to make a new branch
        4) enumerate new branches based on if the parallel state returned true
        for rerunning the initial state
        4.5) after the parallel state has been run(pass or fail) lock it for it's branch so it can't be
        rerun because the parallel states will be tried for many rounds untill they all pass
        when and how are the edge locks removed after process is done
        delete the locked edges when the timeine is finished and we are traversing up
        IEEE_Software_Design_2PC.pdf
        IEEE Software Blog_ Your Local Coffee Shop Performs Resource Scaling.pdf
        */
        graph
          .getStateById(currentStateID)
          .getEdges(edgesGroupIndex)
          .forEach((nextStateName: string[]) => {
            if (!isParallel) {
              if (winningBranchIDStateIDs[branchID].length > 0) {
                return;
              }
            }
            // console.log({ nextStateName });
            const state = graph.getState(nextStateName);
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
              winningBranchIDStateIDs[branchID].push(state.id);
            }
          });
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
    // save original branch data before it is replaced
    // const { isParallel, nextStates, parentStateID } =
    //   stateRunTreeBottom["branches"][branchID];

    // console.log({ branchID });
    // save branch tracker data for all successfull states
    // branch adjustment
    // if next
    //    use winning state's parent id for the link
    //  else if start
    //    use winning state id for the link
    // make new branches
    // if the winning states are from start
    //    update new branches with new levels
    console.log(
      JSON.parse(
        JSON.stringify({ stateRunTreeBottom, winningBranchIDStateIDs })
      )
    );
    let deletableBranches: number[] = [];
    Object.keys(stateRunTreeBottom.branches)
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number, i) => {
        winningBranchIDStateIDs[branchID].forEach((winningStateID: number) => {
          // const {winning}
          // add new branch(child) or update existing branch(next)
          const winningState = graph.getStateById(winningStateID);
          const { haveStartChildren } = winningState;
          console.log(
            JSON.parse(
              JSON.stringify({ stateRunTreeBottom, branchID, i, statesRun })
            )
          );
          const { currentStateID } = stateRunTreeBottom.branches[branchID];
          // const currentState = graph.getStateById(currentStateID)
          // const { haveStartChildren } = runTree[branchID][currentStateID];
          const winningStateIDs = winningBranchIDStateIDs[branchID];
          // console.log("david", { winningState, nextStates });
          // all new branches will also have the same parent state
          ///////////
          // if (i > 0) {

          // } else {
          //   currentBranchID = branchID;
          // }
          ////////
          // let parentStateID: number = -1;
          // first case is always true
          if (
            haveStartChildren ||
            (!haveStartChildren && winningStateIDs.length > 1)
          ) {
            stateRunTreeBottom.maxBranchID += 1;
            const newBranchID = stateRunTreeBottom.maxBranchID;
            runTree[branchID][currentStateID].activeChildStates.push({
              branchID: newBranchID,
              stateID: winningStateID,
            });
            runTree[newBranchID] = {
              [winningStateID]: {
                activeChildStates: [],
                parentBranchID: branchID,
                parentID: currentStateID,
                edgesGroupIndex: 0,
              },
            };
            // collect current branch entry in bottom for deleting
            deletableBranches.push(branchID);
            // add new branch entry in bottom
            stateRunTreeBottom.branches[newBranchID] = {
              currentStateID: winningStateID,
              startHasRun: true,
            };
          } else {
            // console.log("david here");
            if (winningStateIDs.length === 1) {
              const {
                [branchID]: {
                  [winningStateID]: {},
                },
              } = runTree;
              const winningState = graph.getStateById(winningStateID);
              const { areChildrenParallel, areNextParallel } = winningState;

              // [startArray, nextArray]
              stateRunTreeBottom.branches[branchID] = {
                currentStateID: winningStateID,
                // isParallel: edgeGroup[0]? edgeGroup[0].areParallel: false
                // isParallel:
                // winningState.isStartEmpty() && areChildrenParallel,
                edgesGroupIndex: 0,
                // isStartActive: !winningState.isStartEmpty(),
              };
            }
            // if (winningState.next === undefined)
            else {
              let branchIDTracker = branchID;
              let stateIDTracker = winningStateID;

              // erase (branchIDTracker, stateIDTracker) in stateRunTreeBottom
              delete stateRunTreeBottom.branches[branchIDTracker];

              // move up (branchIDTracker, stateIDTracker) on runTree
              const { parentBranchID, parentID } =
                runTree[branchIDTracker][stateIDTracker];
              branchIDTracker = parentBranchID;
              stateIDTracker = parentID;
              let count = 0;
              while (branchIDTracker !== -1) {
                if (count > 3) {
                  console.log("too many states were run");
                  break;
                }

                const [{ branchID, stateID }] =
                  runTree[branchIDTracker][
                    stateIDTracker
                  ].activeChildStates.slice(-1);

                // delete leaf node
                delete runTree[branchID][stateID];

                // delete leaf node id from active states
                runTree[branchIDTracker][
                  stateIDTracker
                ].activeChildStates.pop();

                const { id, edgeGroups, areNextParallel } =
                  graph.getStateById(stateIDTracker);
                if (edgeGroups === undefined) {
                  // move up (branchIDTracker, stateIDTracker)
                  const {
                    parentBranchID: parentBranchID2,
                    parentID: parentID2,
                  } = runTree[branchIDTracker][stateIDTracker];
                  branchIDTracker = parentBranchID2;
                  stateIDTracker = parentID2;
                } else {
                  stateRunTreeBottom.branches[branchIDTracker] = {
                    currentStateID: id,
                    nextStates: edgeGroups !== undefined ? "next" : undefined,
                    isParallel: areNextParallel,
                    isStartActive: false,
                  };
                  count += 1;
                }
              }
            }
          }
        });
      });
    deletableBranches.forEach((deletableBranch: number) => {
      delete stateRunTreeBottom.branches[deletableBranch];
    });
    // edges adjustment
    // each branch is a winning state
    // if a winning state have start states
    //      setup new branch with the start state
    // else if a winning state have next states
    //      setup new branch with next states
    // else if a winning state has no next
    //        backtrack and start again on nearest next state unless path ends first

    // Object.keys(stateRunTreeBottom["branches"])
    //   .map((branchID: string) => Number(branchID))
    //   .forEach((branchID: number) => {
    //     const { currentStateID } = stateRunTreeBottom["branches"][branchID];

    //     const winningState = graph.getStateById(currentStateID);
    //     if (winningState.start?.length > 0) {
    //       stateRunTreeBottom["branches"][branchID] = {
    //         currentStateID,
    //         nextStates: "start",
    //         isParallel: winningState.areChildrenParallel,
    //       };
    //     } else if (winningState.next?.length > 0) {
    //       stateRunTreeBottom["branches"][branchID] = {
    //         currentStateID,
    //         nextStates: "next",
    //         isParallel: winningState.areNextParallel,
    //       };
    //     } else if (winningState.next === undefined) {
    //       // let { parentID, parentBranchID } =
    //       //   winningState.branchIDParentIDParentBranchID[branchID].parentBranch;
    //       // let parentState = graph.getStateById(parentID);
    //       // let prevBranchID = branchID;
    //       // let count = 0;
    //       // while (parentBranchID !== -1) {
    //       // console.log({ count, prevBranchID, parentBranchID });
    //       // if (count >= 6) {
    //       //   console.log("leaving");
    //       //   break;
    //       // }
    //       // move branch up or delete it
    //       // const { activeChildStatesCount } =
    //       //   parentState.branchIDParentIDParentBranchID[parentBranchID];
    //       // if (activeChildStatesCount > 1) {
    //       //   // 1 path split into multiple children paths
    //       //   delete stateRunTreeBottom["branches"][prevBranchID];
    //       //   parentState.branchIDParentIDParentBranchID[
    //       //     parentBranchID
    //       //   ].activeChildStatesCount -= 1;
    //       //   if (activeChildStatesCount > 0) {
    //       //     break;
    //       //   }
    //       // } else if (activeChildStatesCount === 1) {
    //       //   // move from winning child state to parent state
    //       //   if (parentBranchID === -1) {
    //       //     break;
    //       //   }
    //       //   stateRunTreeBottom["branches"][parentBranchID] = {
    //       //     currentStateID: parentState.id,
    //       //     nextStates: parentState.next !== undefined ? "next" : undefined,
    //       //     isParallel: parentState.areNextParallel,
    //       //   };
    //       //   if (parentBranchID !== prevBranchID) {
    //       //     delete stateRunTreeBottom["branches"][prevBranchID];
    //       //   }
    //       //   parentState.branchIDParentIDParentBranchID[
    //       //     parentBranchID
    //       //   ].activeChildStatesCount -= 1;
    //       //   const { currentStateID } =
    //       //     stateRunTreeBottom["branches"][parentBranchID];
    //       //   const currentState = graph.getStateById(currentStateID);
    //       //   prevBranchID = parentBranchID;
    //       //   parentID =
    //       //     currentState.branchIDParentIDParentBranchID[parentBranchID]
    //       //       .parentBranch.parentID;
    //       //   parentBranchID =
    //       //     currentState.branchIDParentIDParentBranchID[parentBranchID]
    //       //       .parentBranch.parentBranchID;
    //       //   parentState = graph.getStateById(parentID);
    //       // }
    //       // if (parentBranchID === -1) {
    //       //   const { currentStateID } =
    //       //     stateRunTreeBottom["branches"][prevBranchID];
    //       //   const currentState = graph.getStateById(currentStateID);
    //       //   if (currentState.next === undefined) {
    //       //     delete stateRunTreeBottom["branches"][prevBranchID];
    //       //   } else {
    //       //     // what if currentState.nextAreParallel is true
    //       //     // this timeline will enter a different timeline that hasn't been used yet
    //       //     stateRunTreeBottom["branches"][prevBranchID] = {
    //       //       currentStateID: currentState.id,
    //       //       nextStates:
    //       //         currentState.next !== undefined ? "next" : undefined,
    //       //       isParallel: currentState.areNextParallel,
    //       //     };
    //       // }
    //     }
    //     // count += 1;
    //   });
    console.log("after changes");
    Object.keys(stateRunTreeBottom.branches)
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
        console.log(JSON.parse(JSON.stringify(runTree)));
        console.log(
          `   current runTree: \n       ${Object.keys(runTree)
            .map((item: string) => Number(item))
            .map((branchID: number) => {
              const {
                [branchID]: { ...stateMetaData },
              } = runTree;
              return `${Object.keys(stateMetaData)
                .map((item: string) => Number(item))
                .map((stateID: number) => {
                  const {
                    [stateID]: { activeChildStates, parentID, parentBranchID },
                  } = stateMetaData;
                  const { name } = graph.getStateById(parentID);
                  const activeChildStatesString = activeChildStates
                    .map(
                      ({ branchID, stateID }: ActiveChildState, i) =>
                        `{ branchID: ${branchID}, stateID: ${stateID} }${
                          i < activeChildStates.length - 1 ? ", " : ""
                        }`
                    )
                    .join("");
                  return `branchID ${branchID}: { stateID ${stateID}: {activeChildStates: [${activeChildStatesString}],\n                    parentBranch: { parent name ${name}:  parentBranchID ${parentBranchID}}}}`;
                })}`;
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
