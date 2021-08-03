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
export const visitor = (startStateName, namesTrie, states) => {
  /*
    setup trackers

    bottom level state
        child links point to the current node on each timeline
    reverse tree
        connect by parent link

    */
  const bottom = ["calculator", "run state machine", "bottom"];
  namesTrie = insertName(namesTrie, bottom, states.length);
  let levelId = 0;
  let timeLineId = 0;
  let firstTrackerName = [`level ${levelId}, timeLine ${timeLineId}`];
  // bottom acts as a reader of the tree timelines like a disk read write head on a disk drive
  states.push({
    name: bottom,
    children: [firstTrackerName],
  });

  namesTrie = insertName(namesTrie, firstTrackerName, states.length);
  states.push({
    name: firstTrackerName,
    next: [startStateName],
  });
  console.log({ namesTrie, states });
  let timeLines = getState(namesTrie, states, bottom);
  let stateRunCount = 0;
  while (timeLines.children.length > 0) {
    timeLines.children.forEach((timeLine) => {
      let currentTimeLine = getState(namesTrie, states, timeLine);
      // add a next states contest to currentTimeLine
      currentTimeLine["variables"] = {
        nextStates: currentTimeLine.next,
        winningState: "",
      };
      console.log({ namesTrie, states, currentTimeLine });
      while (currentTimeLine.variables.nextStates.length > 0) {
        if (stateRunCount === 1) {
          debugger;
        }
        currentTimeLine.variables.nextStates.forEach((stateToRunName) => {
          console.log(stateToRunName);
          const stateToRun = getState(namesTrie, states, stateToRunName);
          console.log({ functionCode: stateToRun.functionCode });
        });
        return false;
      }
    });
    return false;
  }
};
