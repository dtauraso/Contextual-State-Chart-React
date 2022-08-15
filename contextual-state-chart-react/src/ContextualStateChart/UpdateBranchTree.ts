import { Graph } from "../App.types";

import { makeArrays, makeVariable } from "./Init/ContextualStateChartInit";
let tree = ["tree"];

// nextStateId may need to be updated after graph entries are added and deleted

// #######################################################################
const pushBranch = (graph: Graph) => {
  /*
    (levelId, timeLineId)
      //     add 1 empty branch as a child to (0, 0) called (1, 0)
      //     change jth bottom child name to name of (1, 0)'s first state
      //     store first state as (1, 0)'s next state
      //     */
  const levelId = graph.getState(tree).getVariable("levelId");
  const timeLineId = graph.getState(tree).getVariable("timeLineId");

  const newBranchName = [
    `level ${levelId.value + 1}`,
    `timeLine ${timeLineId.value}`,
  ];
  const level = 0;
  const timeLine = 1;
  levelId.add(1);
  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");
  const i = graph.getState(tree).getVariable("i");
  const currentBranchName = graph
    .getVariableById(bottom.value[i.value])
    .collect();
  const winningStateName = graph
    .getState(currentBranchName)
    .getVariable("winningStateName");
  const winningState = graph.getState(winningStateName.value);
  // internal variable is added to trie tree
  // makeArrays(
  //   {
  //     [newBranchName[level]]: {
  //       [newBranchName[timeLine]]: {
  //         state: {
  //           parents: [[...currentBranchName]],
  //           children: {},
  //           variables: {
  //             nextStates: winningState.edgeGroups,
  //             winningStateName: [],
  //             j: { value: 0 },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   graph
  // );
  let currentBranch = graph.getState(currentBranchName);
  currentBranch.children.push([...newBranchName]);
  let stateRunTreeBottom = graph
    .getState(tree)
    .getVariable("stateRunTreeBottom");
  // storing string name into bottom
  stateRunTreeBottom.updateAt(
    i.value,
    [{ value: currentBranch.id }]
    // newBranchName.map((namePart: string) => ({
    //   value: namePart,
    // }))
  );
  // todo: compare # of push times to max height of contextual state chart tree
};
// #######################################################################
const updateBranch = (graph: Graph) => {
  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");
  const i = graph.getState(tree).getVariable("i");
  const currentBranchName = graph
    .getVariableById(bottom.value[i.value])
    .collect();
  const nextStates = graph
    .getState(currentBranchName)
    .getVariable("nextStates");
  const winningStateName = graph
    .getState(currentBranchName)
    .getVariable("winningStateName");
  const currentState = graph.getState(winningStateName.value);
  //   console.log({ graph, nextStates, winningStateName, currentState });
  // nextStates.value.forEach((id1: number) => {
  //   (graph.statesObject.states[id1] as ArrayState).value.forEach(
  //     (id2: number) => {
  //       // console.log({ id2 });
  //       delete graph.statesObject.states[id2];
  //     }
  //   );
  //   delete graph.statesObject.states[id1];
  // });
  nextStates.setValue([]);
  const newNextStates: Array<Array<string>> = [];

  // currentState.edgeGroups.forEach((stateName: string[], i: number) => {
  //   const newVariableId = makeVariable({
  //     trieTreeCollection: null,
  //     stateTree: stateName.map((stateNamePart: string) => ({
  //       value: stateNamePart,
  //     })),
  //     indexObject: graph.statesObject,
  //     name: `${i}`,
  //     graph,
  //   });
  // newNextStates.push(newVariableId);
  // });
  // nextStates.setValue(newNextStates);
};

// #######################################################################
// const moveUpToParentNode = (
//   graph: Graph,
//   bottom: ArrayState,
//   i: NumberState
// ) => {
//   // todo: make sure if there is nothing to delete don't delete anything
//   // move bottom's ith child up by 1 unit
//   const currentBranchName = graph.getVariableById(bottom.at(i)).collect();
//   console.log({ currentBranchName: graph.getVariableById(bottom.at(i)) });
//   const parentTracker = graph.getState(currentBranchName).getParent();
//   parentTracker.children.pop();
//   const currentBranch = graph.getState(currentBranchName);
//   console.log({ currentBranch });
//   // will mess things up if parentTracker connects
//   // to more than 1 branch
//   console.log("parent tracker name", { name: parentTracker });
//   parentTracker.children = [];
//   // the branch name arrays connected to bottom are only connected as past values of bottom.at(i)
//   // branch name as array bottom.at(i) links to
//   // branch state branch name links to
//   // control flow states don't have ids
//   // wrong. use existing name from table
//   // bottom.updateAt(
//   //   i.value,
//   //   parentTracker.name.map((namePart: string) => ({
//   //     value: namePart,
//   //   }))
//   // );
// };

const deleteCurrentNode = (graph: any, currentTracker: any) => {
  Object.keys(currentTracker.variables).forEach((variableName) => {
    delete graph.statesObject.states[currentTracker.variables[variableName]];
  });
  deleteNodes(graph, currentTracker.name);
};
const deleteNodes = (graph: any, name: any) => {
  // console.log({ node, name });
  deleteNodesHelper(graph.namesTrie, graph.statesObject.states, name);
};
const deleteNodesHelper = (namesTrie: any, states: any, name: any) => {
  // console.log({ namesTrie });
  if (name.length === 0) {
    if ("id" in namesTrie) {
      // console.log({ id: namesTrie.id });
      delete states[namesTrie.id];
      delete namesTrie.id;
    }
  } else if (name[0] in namesTrie) {
    deleteNodesHelper(namesTrie[name[0]], states, name.slice(1, name.length));
    // namesTrie[name[0]].id has been deleted
    if (Object.keys(namesTrie[name[0]]).length === 0) {
      // console.log({ node });
      delete namesTrie[name[0]];
    }
  }
};
// const moveAcross1Level = (
//   graph: any,
//   currentTracker: any,
//   winningState: any,
//   nextStates: any
// ) => {
//   console.log({ winningState });

//   // updateVariableVisitor(
//   //   graph,
//   //   currentTracker.name,
//   //   "nextStates",
//   //   winningState.next
//   // );
//   let winningStateName = getVariableVisitor(
//     graph,
//     currentTracker.name,
//     "winningStateName"
//   );
//   let previousSiblingWinningStateName = getVariableVisitor(
//     graph,
//     currentTracker.name,
//     "previousSiblingWinningStateName"
//   );
//   // previousSiblingWinningStateName.setValue(winningStateName.value);
//   // updateVariableVisitor(
//   //   graph,
//   //   currentTracker.name,
//   //   "previousSiblingWinningStateName",
//   //   winningStateName.value
//   //   // getVariableVisitor(graph, currentTracker.name, "winningStateName").value
//   // );
//   // previousSiblingWinningStateName
//   // winningStateName.setValue([]);
//   // updateVariableVisitor(graph, currentTracker.name, "winningStateName", []);
//   console.log({ currentTracker });
//   console.log({ graph });
//   nextStates = getVariableVisitor(graph, currentTracker.name, "nextStates");
//   nextStates.setValue(winningState.next);
//   // nextStates = getVariableVisitor(
//   //   graph,
//   //   currentTracker.name,
//   //   "nextStates"
//   // ).value;
//   console.log({ nextStates });
// };
const deleteValueTree = (graph: Graph) => {
  // if graph[i].value.type === "string"
  // delete and return
  // else
  // recurse for each id in graph[i].value
};
const travelUpBranchPath = (graph: Graph) => {
  //   winningState is an end state
  //     console.log("end state", { winningState });
  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");
  const i = graph.getState(tree).getVariable("i");
  const currentBranchName = graph.getVariableById(bottom.at(i)).collect();
  const idOfCurrentBranchName = bottom.at(i);
  const currentTracker = graph.getState(currentBranchName);
  // moveUpToParentNode(graph, bottom, i);

  console.log({ currentTracker, graph, bottom, idOfCurrentBranchName });
  // delete current branch name(current node)
  // delete branch name from trie tree
  //     deleteCurrentNode(graph, currentTracker);
  //     // levelId.subtract(1);
  //     currentTracker = getState(graph, bottom.children[i.value]);
  //     while (bottom.children[i.value] !== null) {
  //     // get the latest winning state
  //     const currentWinningState = getState(
  //         graph,
  //         getVariableVisitor(graph, currentTracker.name, [
  //         "winningStateName",
  //         ]).value
  //     );
  //     console.log({ currentWinningState });
  //     if ("next" in currentWinningState) {
  //         if (currentWinningState.next.length > 0) {
  //         console.log("don't got up higher");
  //         // set new next states
  //         moveAcross1Level(
  //             graph,
  //             currentTracker,
  //             currentWinningState,
  //             nextStates
  //         );
  //         break;
  //         }
  //     } else {
  //         console.log("move up more");
  //         moveUpToParentNode(graph, bottom, i);
  //         deleteCurrentNode(graph, currentTracker);
  //         // levelId.subtract(1);
  //         currentTracker = getState(graph, bottom.children[i.value]);
  //     }
  //     }
  //     if (bottom.children[i.value] === null) {
  //     // state machine is done
  //     console.log("state machine is done");
  //     }
  // stateRunCount += 1;
  // }
};
export { pushBranch, updateBranch, travelUpBranchPath };
