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
const getState = (namesTrie, states, stateName) => {
  const stateId = getStateId(namesTrie, stateName);
  return states[stateId];
};
const insertState = (graph, state) => {
  graph.namesTrie = insertName(
    graph.namesTrie,
    state.name,
    graph.states.length
  );
  graph.states.push(state);
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
  let bottom = getState(graph.namesTrie, graph.states, bottomName);
  let stateRunCount = 0;
  while (bottom.children.length > 0) {
    bottom.children.forEach((timeLine, i) => {
      let currentTracker = getState(graph.namesTrie, graph.states, timeLine);
      // add a next states contest to currentTimeLine
      console.log({ graph, currentTracker });
      while (currentTracker.variables.nextStates.length > 0) {
        console.log({ stateRunCount });
        if (stateRunCount >= 2) {
          console.log("state run count is too high");
          return false;
        }
        currentTracker.variables.nextStates.forEach((stateToRunName) => {
          if (currentTracker.variables.winningStateName !== null) {
            return;
          }
          console.log(stateToRunName);
          const state = getState(graph.namesTrie, graph.states, stateToRunName);
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
          graph.namesTrie,
          graph.states,
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
          /* parent and child nodes are not getting setup properly */
          insertState(graph, {
            name: newTrackerName,
            next: [...winningState.children],
            parent: currentTracker.name,
            children: [],
            variables: {
              nextStates: [winningState.name],
              winningStateName: null,
            },
          });
          currentTracker.children.push(newTrackerName);

          bottom.children[i] = newTrackerName;
          currentTracker = getState(
            graph.namesTrie,
            graph.states,
            newTrackerName
          );
          // let nextLevel = getState(
          //   graph.namesTrie,
          //   graph.states,
          //   newTrackerName
          // );
          // set variables for newTracker name like this
          // nextLevel["variables"] = {
          //   nextStates: [winningState.start],
          //   winningStateName: null,
          // };
          console.log({ currentTracker });
          // currentTimeLine.children.push(newTrackerName);
          // move the bottom down
          // let bottomLevelState = getState(
          //   graph.namesTrie,
          //   graph.states,
          //   bottom
          // );
          // bottomLevelState.children[i] = currentTimeLine.children[0];

          // works but don't know why(actually doesn't work)
          // parentTrackerName = newTrackerName;

          // currentTimeLine = getState(
          //   graph.namesTrie,
          //   graph.states,
          //   newTrackerName
          // );
          console.log({
            name: graph.namesTrie,
            graph: graph,
            bottom,
            currentTracker,
            newLevel: graph.states[graph.states.length - 1],
          });
          console.log({ currentTracker });
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
