import {
  insertName,
  setAttribute,
  setupState,
  getStateNames,
  makeArrays,
} from "../ContextualStateChartInit";
const getStateId = (namesTrie, stateName) => {
  let stateId = 0;
  let namesTrieTracker = namesTrie;
  let isFound = true;
  stateName.forEach((namePart) => {
    if (!isFound) {
      return;
    }
    if (namePart in namesTrieTracker) {
      if ("id" in namesTrieTracker[namePart]) {
        stateId = namesTrieTracker[namePart].id;
      }
      namesTrieTracker = namesTrieTracker[namePart];
    } else {
      isFound = false;
    }
  });
  if (!isFound) {
    return -1;
  }
  return stateId;
};
const getState = (graph, stateName) => {
  const stateId = getStateId(graph.namesTrie, stateName);
  return graph.states[stateId];
};
const insertState = (graph, state, variables = {}) => {
  // const name1 = state.name;
  const { tree, updatedName } = insertName(
    graph.namesTrie,
    state.name,
    graph.states.length
  );
  graph.namesTrie = tree;
  // console.log({ updatedName });
  //
  // graph.namesTrie = insertName(
  //   graph.namesTrie,
  //   state.name,
  //   graph.states.length
  // );
  // const name2 = state.name;
  // if (name1.length < name2.length) {
  // console.log({ name2 });
  // }
  graph.states.push(state);
  if (Object.keys(variables).length > 0) {
    console.log("add variables");
  }
};
export const visitor = (startStateName, graph) => {
  /*
    setup trackers

    bottom level state
        child links point to the current node on each timeline
    reverse tree
        connect by parent link

    */
  let levelId = 0;
  let timeLineId = 0;
  let parentTrackerName = [`level ${levelId}, timeLine ${timeLineId}`];
  const bottomName = ["calculator", "run state machine", "bottom"];
  insertState(graph, { name: bottomName, children: [parentTrackerName] });

  // bottom acts as a reader of the tree timelines like a disk read write head on a disk drive
  insertState(graph, {
    name: parentTrackerName,
    parent: null,
    next: [startStateName],
    children: [],
    variables: {
      nextStates: [startStateName],
      winningStateName: null,
    },
  });
  console.log({ graph });
  let bottom = getState(graph, bottomName);
  let stateRunCount = 0;
  while (bottom.children.length > 0) {
    bottom.children.forEach((timeLine, i) => {
      let currentTracker = getState(graph, timeLine);
      // add a next states contest to currentTimeLine
      console.log({ graph, currentTracker });
      while (currentTracker.variables.nextStates.length > 0) {
        console.log({ stateRunCount });
        if (stateRunCount >= 1) {
          console.log("state run count is too high");
          return false;
        }
        currentTracker.variables.nextStates.forEach((stateToRunName) => {
          if (currentTracker.variables.winningStateName !== null) {
            return;
          }
          console.log(stateToRunName);
          const state = getState(graph, stateToRunName);
          console.log({ functionCode: state.functionCode });
          if (state.functionCode(graph)) {
            currentTracker.variables.winningStateName = stateToRunName;
          }
        });
        if (currentTracker.variables.winningState === null) {
          // all of the states failed
          return false;
        }
        const winningState = getState(
          graph,
          currentTracker.variables.winningStateName
        );
        if ("children" in winningState) {
          // there are children states to run
          console.log("there are children states to run");
          // update level id
          levelId += 1;
          const newTrackerName = [`level ${levelId}, timeLine ${timeLineId}`];
          // make new level tracker node and doubly link it with the current level
          // tracker node
          insertState(
            graph,
            {
              name: newTrackerName,
              next: [...winningState.children],
              parent: currentTracker.name,
              children: [],
              // unclear way variables are being used
              variables: {
                nextStates: [winningState.name],
                winningStateName: null,
              },
            },
            {
              nextStates: [winningState.name],
              winningStateName: null,
            }
          );
          currentTracker.children.push(newTrackerName);

          bottom.children[i] = newTrackerName;
          currentTracker = getState(graph, newTrackerName);
          console.log({ currentTracker });
          console.log({
            graph,
            bottom,
            currentTracker,
          });
          insertState(graph, {
            name: ["calculator", "run state machine", "bottom"],
          });
          console.log({ graph });
        } else if ("next" in winningState) {
          if (winningState.next.length > 0) {
            // there are next states to run
          } else {
            // winningState is an end state
          }
        }
        stateRunCount += 1;

        // return false;
      }
    });
    return false;
  }
};
