import { Graph } from "../App.types";

import { makeArrays } from "./Init/ContextualStateChartInit";
let tree = ["tree"];

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

export { pushBranch };
