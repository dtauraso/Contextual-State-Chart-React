import { ArrayState, Graph, StringState } from "../App.types";

import { makeArrays, makeVariable } from "./Init/ContextualStateChartInit";
let tree = ["tree"];

// nextStateId may need to be updated after graph entries are added and deleted
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
  makeArrays(
    {
      [newBranchName[level]]: {
        [newBranchName[timeLine]]: {
          state: {
            parents: [[...currentBranchName]],
            children: {},
            variables: {
              nextStates: winningState.start.map((startState: string[]) =>
                startState.map((stateNamePart: string) => ({
                  value: stateNamePart,
                }))
              ),
              winningStateName: [],
              j: { value: 0 },
            },
          },
        },
      },
    },
    graph
  );
  let currentBranch = graph.getState(currentBranchName);
  currentBranch.children.push([...newBranchName]);
  let stateRunTreeBottom = graph
    .getState(tree)
    .getVariable("stateRunTreeBottom");
  stateRunTreeBottom.updateAt(
    i.value,
    newBranchName.map((namePart: string) => ({
      value: namePart,
    }))
  );
};

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
  console.log({ graph, nextStates, winningStateName, currentState });
  nextStates.value.forEach((id1: number) => {
    (graph.statesObject.states[id1] as ArrayState).value.forEach(
      (id2: number) => {
        console.log({ id2 });
        delete graph.statesObject.states[id2];
      }
    );
    delete graph.statesObject.states[id1];
  });
  nextStates.setValue([]);
  const newNextStates: Array<Array<string>> = [];
  //   makeArrays()

  currentState.next.forEach((stateName: string[], i: number) => {
    const newVariableId = makeVariable({
      trieTreeCollection: null, //[],
      stateTree: stateName.map((stateNamePart: string) => ({
        value: stateNamePart,
      })),
      indexObject: graph.statesObject,
      name: `${i}`,
      graph,
    });
    newNextStates.push(newVariableId);
  });
  nextStates.setValue(newNextStates);
};
export { pushBranch, updateBranch };
