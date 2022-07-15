import { isConstructorDeclaration } from "typescript";
import {
  ControlFlowState,
  Graph,
  ActiveChildStates,
  PendingStates,
} from "../App.types";
import { VisitBranches } from "./Visitor";
enum EdgeKinds {
  START_CHILDREN = 0,
  NEXT = 1,
}
const { START_CHILDREN, NEXT } = EdgeKinds;
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
const deleteEntry = (
  stateIDBranchID: { [key: number]: any },
  stateID: number,
  branchID: number
) => {
  delete stateIDBranchID[stateID][branchID];
  if (Object.keys(stateIDBranchID[stateID]).length === 0) {
    delete stateIDBranchID[stateID];
  }
};
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
        activeChildStates: ActiveChildStates;
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
  let levelsRun = 0;
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

  while (Object.keys(stateRunTreeBottom.branches).length > 0) {
    console.log({ levelsRun });
    if (levelsRun >= 9) {
      // if (testAtStateRunCount(levelsRun, graph)) {
      //   console.log("passes");
      // }
      console.log("too many levels were run");
      // break;
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
    /*
      IEEE_Software_Design_2PC.pdf
      IEEE Software Blog_ Your Local Coffee Shop Performs Resource Scaling.pdf
      */
    let stateIDBranchID: { [key: number]: any } = {};
    let pairs: any = [];
    Object.keys(stateRunTreeBottom.branches)
      .map(Number)
      .forEach((branchID: number) => {
        const { branches } = stateRunTreeBottom;
        const { currentStateID } = branches[branchID];
        if (!(currentStateID in stateIDBranchID)) {
          stateIDBranchID[currentStateID] = { [branchID]: true };
        } else if (!(branchID in stateIDBranchID[currentStateID])) {
          stateIDBranchID[currentStateID][branchID] = true;
        }

        // find 1 pair
        const { destinationTimeline } =
          (graph.statesObject.states[currentStateID] as ControlFlowState) || {};
        if (destinationTimeline === undefined) {
          return;
        }
        const destinationStateID = graph.getState([destinationTimeline]).id;
        if (destinationStateID in stateIDBranchID) {
          const stateID0 = currentStateID;
          const branchID0 = Number(
            Object.keys(stateIDBranchID[currentStateID])[0]
          );
          const stateID1 = destinationStateID;
          const branchID1 = Number(
            Object.keys(stateIDBranchID[destinationStateID])[0]
          );
          deleteEntry(stateIDBranchID, currentStateID, branchID0);
          deleteEntry(stateIDBranchID, destinationStateID, branchID1);

          pairs.push({ stateID0, branchID0, stateID1, branchID1 });
        }
      });
    pairs.forEach((pair: any) => {
      const { branchID0, stateID0, stateID1, branchID1 } = pair;
      graph.getStateById(stateID0).timelineIDs = {
        ...graph.getStateById(stateID0).timelineIDs,
        [branchID1]: stateID1,
      };
      graph.getStateById(stateID1).timelineIDs = {
        ...graph.getStateById(stateID1).timelineIDs,
        [branchID0]: stateID0,
      };
    });
    // pairs.forEach((pair: any) => {
    //   const { branchID0, stateID0, stateID1, branchID1 } = pair;
    //   console.log({ branchID0, stateID0, stateID1, branchID1 });
    //   console.log({ [stateID0]: graph.getStateById(stateID0).timelineIDs });
    //   console.log({ [stateID1]: graph.getStateById(stateID1).timelineIDs });
    // });
    // printRunTree(runTree, graph);

    // console.log({ pairs });
    console.log({ graph });
    let winningBranchIDStateIDs: { [branchID: number]: number[] } = {};
    Object.keys(stateRunTreeBottom.branches)
      .map(Number)
      .forEach((branchID: number) => {
        const { currentStateID } = stateRunTreeBottom.branches[branchID];
        const { edgesGroupIndex, parentID, parentBranchID } =
          runTree[branchID][currentStateID];
        const currentState = graph.getStateById(currentStateID);
        const { edges, areParallel } =
          currentState.getEdges(edgesGroupIndex) || {};

        winningBranchIDStateIDs[branchID] = [];
        edges.forEach(({ nextStateID }) => {
          if (!areParallel) {
            if (winningBranchIDStateIDs[branchID].length > 0) {
              return;
            }
          }

          const state = graph.getStateById(nextStateID);
          if (currentState.areEdgesStart(edgesGroupIndex)) {
            console.log({ parent: currentState });
          } else {
            console.log({ parent: graph.getStateById(parentID) });
          }

          // make sure all paired timelines are run at the sametime
          // no having 1 timeline wait for the other timeline
          // assume state can be run unless proved otherwise
          // is the state supposed to be paired with another state
          //   is the state paired with it's partner
          //     state can be run
          //   else
          //     state cannot be run
          // if state has to transfer a value
          //   assume state is child of paired parent
          if (state.functionCode(graph)) {
            winningBranchIDStateIDs[branchID].push(state.id);
          }
        });
      });
    // console.log({ runTree: JSON.parse(JSON.stringify(runTree)) });

    Object.keys(stateRunTreeBottom.branches)
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        let deletableBranch = false;

        const { currentStateID } = stateRunTreeBottom.branches[branchID];
        const currentState = graph.getStateById(currentStateID);

        const { edgesGroupIndex, parentID, parentBranchID } =
          runTree[branchID][currentStateID];

        const winningStateIDs = winningBranchIDStateIDs[branchID];
        const areEdgesStart = currentState.areEdgesStart(edgesGroupIndex);
        // run without using any states not in the current timeline
        // add dummy states to keep the paired timelines running only their states

        // transfer variable data directly to paired parent state
        // filter out all winning states not child of parent state(this could be current state, but might also be current state's parent)
        // a winning state might not be a child of parent state
        // console.log({
        //   branchID: branchID,
        //   currentStateID: currentStateID,
        //   winningStates: winningBranchIDStateIDs[branchID],
        // });
        winningBranchIDStateIDs[branchID].forEach(
          (winningStateID: number, i: number) => {
            // add new branch(child) or update existing branch(next)

            // all new branches will also have the same parent state
            if (areEdgesStart) {
              stateRunTreeBottom.maxBranchID += 1;
              const newBranchID = stateRunTreeBottom.maxBranchID;
              runTree[branchID][currentStateID].activeChildStates[newBranchID] =
                winningStateID;
              runTree[newBranchID] = {
                [winningStateID]: {
                  activeChildStates: {},
                  parentBranchID: branchID,
                  parentID: currentStateID,
                  edgesGroupIndex: START_CHILDREN,
                },
              };

              // add new branch entry in bottom
              stateRunTreeBottom.branches[newBranchID] = {
                currentStateID: winningStateID,
              };

              deletableBranch = true;
            } else if (!areEdgesStart && winningStateIDs.length > 1) {
              // parallel next states
              // the current branch must divide into multiple branches

              // i === 0
              //  move current branch to next state
              if (i === 0) {
                stateRunTreeBottom.branches[branchID] = {
                  currentStateID: winningStateID,
                };

                runTree[branchID][winningStateID] = {
                  ...runTree[branchID][currentStateID],
                };
                delete runTree[branchID][currentStateID];
              } else if (i > 0) {
                //  add new branches
                stateRunTreeBottom.maxBranchID += 1;
                const newBranchID = stateRunTreeBottom.maxBranchID;
                runTree[parentBranchID][parentID].activeChildStates[
                  newBranchID
                ] = winningStateID;
                runTree[newBranchID] = {
                  [winningStateID]: {
                    activeChildStates: {},
                    parentBranchID: parentBranchID,
                    parentID: parentID,
                    edgesGroupIndex: START_CHILDREN,
                  },
                };
                // // add new branch entry in bottom
                stateRunTreeBottom.branches[newBranchID] = {
                  currentStateID: winningStateID,
                };
              }
              // i > 0

              // delete current state branch after all sibling branches are made
            } else if (winningStateIDs.length === 1) {
              stateRunTreeBottom.branches[branchID] = {
                currentStateID: winningStateID,
              };

              runTree[branchID][winningStateID] = {
                ...runTree[branchID][currentStateID],
              };
              delete runTree[branchID][currentStateID];
            }
          }
        );

        if (winningBranchIDStateIDs[branchID].length === 0) {
          const { edgesGroupIndex } = runTree[branchID][currentStateID];
          // TODO: define the conditions for an end state
          const areEdgesStart = currentState.areEdgesStart(edgesGroupIndex);

          // error states can happen if there are start states or next states

          if (!areEdgesStart) {
            // there were no states to run so current state is an end state
            let branchIDTracker = branchID;
            let stateIDTracker = currentStateID;

            // erase (branchIDTracker, stateIDTracker) in stateRunTreeBottom
            delete stateRunTreeBottom.branches[branchIDTracker];

            // get parent of (branchIDTracker, stateIDTracker) on runTree
            const { parentBranchID, parentID } =
              runTree[branchIDTracker][stateIDTracker];
            let count = 0;
            while (parentBranchID !== -1) {
              if (count > 1) {
                console.log("too many states were run");
                // break;
              }
              // delete leaf node
              delete runTree[branchIDTracker][stateIDTracker];

              // delete leaf node id from active states
              delete runTree[parentBranchID][parentID].activeChildStates[
                branchIDTracker
              ];
              // leaf node and parent link to leaf node is gone

              if (
                Object.keys(runTree[parentBranchID][parentID].activeChildStates)
                  .length > 0
              ) {
                break;
              }

              // only move up when there are no sibling states
              branchIDTracker = parentBranchID;
              stateIDTracker = parentID;
              const { edgeGroups } = graph.getStateById(stateIDTracker);
              if (edgeGroups) {
                stateRunTreeBottom.branches[branchIDTracker] = {
                  currentStateID: stateIDTracker,
                };
                runTree[branchIDTracker][stateIDTracker].edgesGroupIndex = NEXT;
                break;
              }
              count += 1;
            }
          }
        }
        if (deletableBranch) {
          delete stateRunTreeBottom.branches[branchID];
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
    console.log("current stateRunTreeBottom");
    Object.keys(stateRunTreeBottom.branches)
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        const { currentStateID, nextStates, isParallel } =
          stateRunTreeBottom["branches"][branchID] || {};
        const { edgesGroupIndex } = runTree[branchID][currentStateID];

        console.log(`branch id ${branchID}`);
        console.log(`  isParallel: ${isParallel}`);
        if (nextStates !== undefined) {
          console.log(`  nextStates:`);
          const currentState = graph.getStateById(currentStateID);
          const { edges, areParallel } = currentState.getEdges(edgesGroupIndex);

          edges.forEach(({ nextStateName }) => {
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
        // console.log(JSON.parse(JSON.stringify(runTree)));
      });
    printRunTree(runTree, graph);

    console.log("---------------");

    console.log("########################");
    levelsRun += 1;
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
const printRunTree = (
  runTree: {
    [branchID: number]: {
      [stateID: number]: {
        activeChildStates: ActiveChildStates;
        parentID: number;
        parentBranchID: number;
        edgesGroupIndex: number;
      };
    };
  },
  graph: Graph
) => {
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
              [stateID]: {
                activeChildStates,
                edgesGroupIndex,
                parentID,
                parentBranchID,
              },
            } = stateMetaData;
            const { name } = graph.getStateById(parentID);
            const activeChildStatesString = Object.keys(activeChildStates)
              .reduce(
                (acc: any, branchID: string) => [
                  ...acc,
                  { branchID, stateID: activeChildStates[Number(branchID)] },
                ],
                []
              )
              .map(
                ({ branchID, stateID }, i) =>
                  `{ branchID: ${branchID}, stateName: ${
                    graph.getStateById(stateID).name
                  } }${
                    i < Object.keys(activeChildStates).length - 1 ? ", " : ""
                  }`
              )
              .join("");
            return `branchID ${branchID}: { stateName ${
              graph.getStateById(stateID).name
            }, destinationTimeline: ${
              graph.getStateById(stateID)?.destinationTimeline
            } (id: ${stateID}): {edgesGroupIndex: ${edgesGroupIndex}, activeChildStates: [${activeChildStatesString}],\n                    parentBranch: { parent name ${name}, parentID ${parentID},  parentBranchID ${parentBranchID}}}}`;
          })}`;
      })
      .join(", \n       ")}`
  );
};
export { VisitAvaliableBranches };
