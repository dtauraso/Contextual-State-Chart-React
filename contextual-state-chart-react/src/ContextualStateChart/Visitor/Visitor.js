import {
  insertName,
  setAttribute,
  setupState,
  getStateNames,
  makeArrays,
} from "../ContextualStateChartInit";
export const visitor = (startStateName, namesTrie, states) => {
  /*
    setup trackers

    bottom level state
        child links point to the current node on each timeline
    reverse tree
        connect by parent link

    */
  const name = ["calculator", "run state machine", "bottom"];
  namesTrie = insertName(namesTrie, name, states.length);

  states.push({
    name: name,
    children: [startStateName],
  });
  console.log({ namesTrie, states });
};
