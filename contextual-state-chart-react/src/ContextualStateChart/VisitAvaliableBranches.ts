import { isConstructorDeclaration } from "typescript";
import {
  State,
  StateRunStatus,
  Graph,
  ActiveChildStates,
  // PendingStates,
  Variable,
  Tree,
  TreeBottom,
  // ArrayState,
  // BooleanState,
  // NumberState,
  // StringState,
  // ObjectState,
} from "../App.types";
import // arrayWrapper,
// booleanWrapper,
// numberWrapper,
// objectWrapper,
// stringWrapper,
// wrapper,
"./StateTree";
import { VisitBranches } from "./Visitor";
import { makeVariable } from "./Init/ContextualStateChartInit";
enum EdgeKinds {
  START_CHILDREN = 0,
  NEXT = 1,
}
const { START_CHILDREN, NEXT } = EdgeKinds;

enum StateHealth {
  PASS = "Pass",
  PENDING = "Pending",
  FAIL = "Fail",
  WAIT = "Wait",
}
const { PASS, PENDING, FAIL } = StateHealth;

const changedStatues = { 0: "NONE", 1: "ADDED", 2: "MODIFIED", 3: "DELETED" };
// const variableTypes: any = {
//   boolean: booleanWrapper,
//   number: numberWrapper,
//   string: stringWrapper,
//   array: arrayWrapper,
//   object: objectWrapper,
// };

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

const traverseUp = (
  graph: Graph,
  runTree: Tree,
  currentState: State,
  branchID: number,
  currentStateID: number,
  stateRunTreeBottom: TreeBottom
) => {
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
      // todo: test if works when there is a multi-level state run fail
      const { edgeGroups } = graph.getStateById(stateIDTracker);
      console.log({ branchIDTracker, stateIDTracker, edgeGroups });
      if (edgeGroups) {
        stateRunTreeBottom.branches[branchIDTracker] = {
          currentStateID: stateIDTracker,
        };
        runTree[branchIDTracker][stateIDTracker].edgesGroupIndex = NEXT;
        runTree[branchIDTracker][stateIDTracker].currentStateHealth = PASS;
        break;
      }
      count += 1;
    }
  }
};
const calculateHealth = (state: State, statePasses: boolean): StateHealth => {
  if (state.children.length > 0) {
    if (!statePasses) return FAIL;
    return PENDING;
  }
  if (statePasses) return PASS;
  return FAIL;
};
const VisitAvaliableBranches = (
  graph: Graph,
  stateRunTreeBottom: TreeBottom,
  runTree: Tree
  // branchID -> childStateID -> parentStateID
) => {
  const stateRunCountMax = 2;
  // const stateRunCount = graph.getState(tree).getVariable("stateRunCount");
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
  const x = new Set([1, 6]);
  console.log({ type: typeof x, x });
  let variablesToSendToCounterpartState: {
    [parentIDSum: number]: string[];
  } = {};
  while (Object.keys(stateRunTreeBottom.branches).length > 0) {
    console.log({ levelsRun });
    if (levelsRun >= 10) {
      // if (testAtStateRunCount(levelsRun, graph)) {
      //   console.log("passes");
      // }
      console.log("too many levels were run");
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
    /*
      IEEE_Software_Design_2PC.pdf
      IEEE Software Blog_ Your Local Coffee Shop Performs Resource Scaling.pdf
      */

    // printRunTree(runTree, graph);

    // console.log({ pairs });
    // console.log({ graph });
    // console.log({
    //   timelineIDs1: graph.getStateById(18).timelineIDs,
    //   timelineIDs2: graph.getStateById(6).timelineIDs,
    // });

    let branchIDStateIDs: { [branchID: number]: StateRunStatus[] } = {};
    // statesWithChanges
    let stateIDBranchID: { [key: number]: any } = {};

    Object.keys(stateRunTreeBottom.branches)
      .map(Number)
      .forEach((branchID: number) => {
        stateRunTreeBottom.currentBranchID = branchID;
        const { currentStateID } = stateRunTreeBottom.branches[branchID];
        const { edgesGroupIndex, parentID, parentBranchID } =
          runTree[branchID][currentStateID];
        const currentState = graph.getStateById(currentStateID);
        const { edges, areParallel } =
          currentState.getEdges(edgesGroupIndex) || {};

        branchIDStateIDs[branchID] = [];

        console.log({ branchID, edges });
        let statePasses = false;
        edges.forEach(({ nextStateID }) => {
          if (!areParallel && statePasses) {
            return;
          }
          console.log({ nextStateID });
          const state = graph.getStateById(nextStateID);
          const parentState = currentState.areEdgesStart(edgesGroupIndex)
            ? currentState
            : graph.getStateById(parentID);
          if (currentState.areEdgesStart(edgesGroupIndex)) {
            console.log({ parent: currentState });
          } else {
            console.log({ parent: graph.getStateById(parentID) });
          }
          /*

          need next state to wait if next state still has locks to unlock
          need current state to be end state if next state has > 1 remaining locks on it
          
          */

          // assume state and counterpart state are at the same level
          // assume the paths to the state and counterpart state are the same length
          // if (state.pairID) {
          //   console.log("david", { pairID: state.pairID });
          //   const parentIDSum = state.id + state.pairID;
          //   // using parent ids instead of branch id
          //   /**
          //    * fails
          //   stateId1|stateId2: { [branchId1, branchId2], branchId1|branchId2: {variables}}
          //   runtree
          //   customer and cashier need to have the same parent state
          //   customer|cashier|barista state
          //     pairState1 (holds all variables customer, cashier, and barista share)
          //       customer (isPaired so "place order" knows to go up 2 levels to find variables)
          //       cashier (isPaired)
          //       barista (isPaired)
          //     pair2
          //    */
          //   // 618
          //   // 6|18
          //   // 61|8
          //   const parentIDPairID = `${state.id}|${state.pairID}`;
          //   const parentPairIDID = `${state.pairID}|${state.id}`;

          //   if (!(parentIDPairID in variablesToSendToCounterpartState)) {
          //     if (!(parentPairIDID in variablesToSendToCounterpartState)) {
          //       // variablesToSendToCounterpartState[parentIDPairID] = []
          //     }
          //   }
          //   if (!(parentIDSum in variablesToSendToCounterpartState)) {
          //     variablesToSendToCounterpartState[parentIDSum] = [];
          //   }
          // }
          // if (parentState.pairID) {
          //   const parentIDSum = parentState.pairID + parentState.id;
          //   console.log("david", {
          //     state,
          //     parentID: parentState.id,
          //     parentPairID: parentState.pairID,
          //     parentIDSum: parentIDSum,
          //     variablesToSendToCounterpartState:
          //       variablesToSendToCounterpartState[parentIDSum],
          //   });
          //   // need to make sure the right state gets tried first
          //   // state is locked (locked count > 0)
          //   //  state lock is decremented by 1 if > 0 and tried again in next round for branchID (only locked state is retried)
          //   // first state
          //   //  if variablesToSendToCounterpartState[parentIDSum] is empty
          //   //    put variables from state into variablesToSendToCounterpartState[parentIDSum]
          //   // second state (from counterpart parent)
          //   //  if variablesToSendToCounterpartState[parentIDSum] has at least 1 variable name
          //   //  transfer to state(counterpart state) at branchID
          // }
          // if state has to transfer a value
          //   assume state is child of paired parent
          // const variables = state.getVariableBranches();
          // console.log("make variable", {
          //   variables,
          //   state,
          // });

          // if (!variables.includes(String(state.id))) {
          //   const initBranchState = state.getInitVariables();
          //   // console.log({ initBranchState });
          //   if (initBranchState) {
          //     const result = initBranchState.variableTreeToInitJson();
          //     // console.log({ result });
          //     const newBranchVariables = result;
          //     const newBranchVariableID = makeVariable({
          //       stateTree: newBranchVariables,
          //       indexObject: graph.statesObject,
          //       name: state.id,
          //       runTree,
          //       graph,
          //     });
          //     state.branchIDVariableID[state.id] = newBranchVariableID;
          //     // console.log({
          //     //   graph,
          //     //   currentBranch: runTree.currentBranchID,
          //     //   statesRunTree: state.runTree.currentBranchID,
          //     // });
          //     if (state.pairID) {
          //       // console.log("pair test");
          //       // console.log({ state, branchID });
          //       const counterpartState = graph.getStateById(state.pairID);
          //       console.log({
          //         counterpartState,
          //       });
          //       if (state.functionName === "customer") {
          //         const drinkName = state.getVariable("drink");
          //         console.log({ drinkName });

          //         const currentOrder =
          //           counterpartState.getVariable("currentOrder");
          //         console.log({ currentOrder });

          //         const drinkState = graph.getStateById(
          //           state.branchIDVariableID[state.id]
          //         );
          //         const otherVariables = graph.getStateById(
          //           counterpartState.branchIDVariableID[counterpartState.id]
          //         );

          //         const result2 = drinkState.variableTreeToInitJson();
          //         const result3 = otherVariables.variableTreeToInitJson();
          //         console.log({ result2 });
          //         const newBranchVariables2 = { ...result2, ...result3 };
          //         const newBranchVariableID2 = makeVariable({
          //           stateTree: newBranchVariables2,
          //           indexObject: graph.statesObject,
          //           name: counterpartState.id,
          //           runTree,
          //           graph,
          //         });
          //         counterpartState.branchIDVariableID[counterpartState.id] =
          //           newBranchVariableID2;
          //         const drinkName2 = counterpartState.getVariable("drink");
          //         console.log({ drinkName2 });
          //         const currentOrder2 =
          //           counterpartState.getVariable("currentOrder");
          //         const price2 = counterpartState.getVariable("price");
          //         console.log({ currentOrder2, price2 });
          //       }
          //     }
          //   }
          // }
          if (state.functionCode(graph)) {
            statePasses = true;
          }
          branchIDStateIDs[branchID].push({
            id: state.id,
            health: calculateHealth(state, statePasses),
          });
        });
      });
    // console.log({ runTree: JSON.parse(JSON.stringify(runTree)) });

    Object.keys(stateRunTreeBottom.branches)
      .map((branchID: string) => Number(branchID))
      .forEach((branchID: number) => {
        const { currentStateID } = stateRunTreeBottom.branches[branchID];
        const currentState = graph.getStateById(currentStateID);

        const {
          edgesGroupIndex,
          parentID,
          parentBranchID,
          currentStateHealth,
        } = runTree[branchID][currentStateID];

        // 1 or more winning states is in the WAIT status
        // filter out WAIT states
        //  if there are no more states left
        //    return
        // n locked edges and 0 regular edges
        //  does nothing
        // n locked edges and 1 regular edge
        //  moves to next state using same branch
        // n locked edges and 2+ regular edges
        //  moves to next states using new branches and moves original branch

        const stateIDs = branchIDStateIDs[branchID];
        console.log("updating branch", { branchID });
        // const areEdgesStart = currentState.areEdgesStart(edgesGroupIndex);
        // run without using any states not in the current timeline
        // add dummy states to keep the paired timelines running only their states

        // transfer variable data directly to paired parent state
        // filter out all winning states not child of parent state(this could be current state, but might also be current state's parent)
        // a winning state might not be a child of parent state
        // console.log({
        //   branchID: branchID,
        //   currentStateID: currentStateID,
        //   winningStates: branchIDStateIDs[branchID],
        // });
        if (
          branchIDStateIDs[branchID].length === 0 ||
          branchIDStateIDs[branchID].every(
            (stateRunStatus: StateRunStatus) => stateRunStatus.health === FAIL
          )
        ) {
          traverseUp(
            graph,
            runTree,
            currentState,
            branchID,
            currentStateID,
            stateRunTreeBottom
          );
          // todo:
          // if all next states failed, then the current branch is done.
          // parent state failing after submachine fails is treated differently than
          // when parent state fails immediately after running
          // we know parent state failed after traversing up tree.
          // backtrack to prev state
          // rerun all prev state's next states than haven't failed but not in this code block.
        } else if (currentStateHealth === PENDING) {
          // child states
          branchIDStateIDs[branchID].forEach(
            (stateRunStatus: StateRunStatus, i: number) => {
              const { id: winningStateID } = stateRunStatus;
              stateRunTreeBottom.maxBranchID += 1;
              const newBranchID = stateRunTreeBottom.maxBranchID;
              runTree[branchID][currentStateID].activeChildStates[newBranchID] =
                winningStateID;
              const winningState = graph.getStateById(winningStateID);
              runTree[newBranchID] = {
                [winningStateID]: {
                  activeChildStates: {},
                  parentBranchID: branchID,
                  parentID: currentStateID,
                  edgesGroupIndex: START_CHILDREN,
                  currentStateHealth:
                    winningState.children.length > 0 ? PENDING : PASS,
                },
              };
              // make record state holding the changes
              // add new branch entry in bottom
              stateRunTreeBottom.branches[newBranchID] = {
                currentStateID: winningStateID,
              };
              delete stateRunTreeBottom.branches[branchID];
            }
          );
        } else if (currentStateHealth === PASS) {
          // next states
          if (stateIDs.length === 1) {
            const { id: winningStateID } = stateIDs[0];

            stateRunTreeBottom.branches[branchID] = {
              currentStateID: winningStateID,
            };
            runTree[branchID][winningStateID] = {
              ...runTree[branchID][currentStateID],
            };
            delete runTree[branchID][currentStateID];
          } else {
            branchIDStateIDs[branchID].forEach(
              (stateRunStatus: StateRunStatus, i: number) => {
                const { id: winningStateID } = stateRunStatus;
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
                  const winningState = graph.getStateById(winningStateID);
                  runTree[newBranchID] = {
                    [winningStateID]: {
                      activeChildStates: {},
                      parentBranchID: parentBranchID,
                      parentID: parentID,
                      edgesGroupIndex: START_CHILDREN,
                      currentStateHealth:
                        winningState.children.length > 0 ? PENDING : PASS,
                    },
                  };
                  // // add new branch entry in bottom
                  stateRunTreeBottom.branches[newBranchID] = {
                    currentStateID: winningStateID,
                  };
                }
              }
            );
          }
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
        const { currentStateID } =
          stateRunTreeBottom["branches"][branchID] || {};
        const { edgesGroupIndex } = runTree[branchID][currentStateID];

        console.log(`branch id ${branchID}`);

        console.log(`  nextStates: undefined`);

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
    printRunTree(runTree, stateRunTreeBottom, graph);

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
const printRunTree = (runTree: Tree, TreeBottom: TreeBottom, graph: Graph) => {
  console.log(
    `   current runTree: \n       ${Object.keys(runTree)
      .filter((key) => key !== "currentBranchID")
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
                currentStateHealth,
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
            } (id: ${stateID}): {edgesGroupIndex: ${edgesGroupIndex}, activeChildStates: [${activeChildStatesString}], currentStateHealth: |${currentStateHealth}|\n                    parentBranch: { parent name ${name}, parentID ${parentID},  parentBranchID ${parentBranchID}}}}`;
          })}`;
      })
      .join(", \n       ")}`
  );
  console.log(`   current branch id: ${TreeBottom.currentBranchID}`);
};
export { VisitAvaliableBranches };
