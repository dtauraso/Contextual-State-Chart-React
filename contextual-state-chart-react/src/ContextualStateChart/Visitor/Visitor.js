import {
  insertName,
  setAttribute,
  setupState,
  getStateNames,
  makeArrays,
} from "../ContextualStateChartInit";
const getStateId = (namesTrie, stateName) => {
  // console.log({ namesTrie, stateName });
  let stateId = 0;
  let namesTrieTracker = namesTrie;
  let isFound = true;
  if (typeof stateName === "string") {
    console.log(`${stateName} is not an array`);
    return -1;
  }
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
  // console.log({ stateName });
  if (stateName === null) {
    return null;
  }
  const stateId = getStateId(graph.namesTrie, stateName);
  return graph.statesObject.states[stateId];
};
const getVariable = (graph, stateName, variableName) => {
  // console.log({ stateName });

  const state = getState(graph, stateName);
  // console.log({ state });
  if (variableName in state.variables) {
    const stateId = state.variables[variableName];
    return graph.statesObject.states[stateId];
  }
};
const setVariable = (graph, stateName, variableName, newValue) => {
  // console.log({ graph, state, variableName, newValue });
  const state = getState(graph, stateName);
  if (variableName in state.variables) {
    const stateId = state.variables[variableName];
    graph.statesObject.states[stateId].value = newValue;
    // console.log({ graph, stateId });
  }
};
const insertVariableState = (graph, state, variable) => {
  // variable is the new variable state
  // console.log({ variable });
  // fix for data structure update
  // new variable state is inside graph.states
  graph.statesObject.maxStateId += 1;
  graph.statesObject.states[graph.statesObject.maxStateId] = variable;
  // graph.states.push(variable);
  // new variable state name is inside state.variableNames
  state.variables[variable.name[0]] = graph.statesObject.maxStateId;
};
const insertState = (graph, state, variables = {}) => {
  graph.statesObject.maxStateId += 1;
  const { tree, updatedName } = insertName(
    graph.namesTrie,
    state.name,
    graph.statesObject.maxStateId
  );
  console.log({ graph });
  graph.namesTrie = tree;
  // console.log({ updatedName });
  state.name = updatedName;
  if (Object.keys(variables).length > 0) {
    state["variables"] = {};
  }
  graph.statesObject.states[graph.statesObject.maxStateId] = state;
  // only works for variable names of 1 dimention
  // the variable can only be accesible from the current state
  // each state can only have 1 unique user defined variable name
  // all variables need to be 1 dimentional
  Object.keys(variables).forEach((variableName) => {
    // do not insert variable names into the main graph
    // duplicate names are ok as long as their id number is different(variable names only)
    insertVariableState(graph, state, {
      name: [variableName],
      value: variables[variableName],
    });
  });

  return updatedName;
};
const deleteNodes = (graph, name) => {
  // console.log({ node, name });
  deleteNodesHelper(graph.namesTrie, graph.statesObject.states, name);
};
const deleteNodesHelper = (namesTrie, states, name) => {
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
  let parentTrackerName = [`level ${levelId}`, `timeLine ${timeLineId}`];
  let bottomName = ["calculator", "run state machine", "bottom"];
  bottomName = insertState(graph, {
    name: bottomName,
    children: [parentTrackerName],
  });

  // bottom acts as a reader of the tree timelines like a disk read write head on a disk drive
  parentTrackerName = insertState(
    graph,
    {
      name: parentTrackerName,
      parent: null,
      children: [],
    },
    {
      nextStates: [startStateName],
      winningStateName: null,
    }
  );
  // console.log({ graph });
  let bottom = getState(graph, bottomName);
  let stateRunCount = 0;
  while (bottom.children.length > 0) {
    bottom.children.forEach((timeLine, i) => {
      let currentTracker = getState(graph, timeLine);
      // add a next states contest to currentTimeLine
      // console.log({
      //   graph,
      //   currentTracker,
      //   nextStates: getVariable(graph, currentTracker, "nextStates"),
      // });
      let nextStates = getVariable(
        graph,
        currentTracker.name,
        "nextStates"
      ).value;
      while (nextStates.length > 0) {
        console.log({ nextStates, stateRunCount });
        if (stateRunCount >= 7) {
          console.log("state run count is too high");
          // test delete code
          // deleteNodes(graph, ["calculator"]);

          // deleteNodes(graph, ["calculator", "run state machine", "bottom"]);

          // console.log({ graph });
          return false;
        }
        let winningStateName = getVariable(
          graph,
          currentTracker.name,
          "winningStateName"
        );
        console.log({ currentTracker, winningStateName });
        nextStates.forEach((stateToRunName) => {
          if (winningStateName.value !== null) {
            return;
          }
          console.log({ stateToRunName });
          const state = getState(graph, stateToRunName);
          console.log({ functionCode: state.functionCode });
          if (typeof state.functionCode === "string") {
            console.log(
              `can't run a string ${state.functionCode} as a function`
            );
            return;
          }
          if (state.functionCode(graph, state)) {
            winningStateName.value = stateToRunName;
          }
        });
        if (winningStateName.value === null) {
          // all of the states failed
          return false;
        }
        const winningState = getState(graph, winningStateName.value);
        if ("children" in winningState) {
          // there are children states to run
          console.log("there are children states to run");
          // update level id
          levelId += 1;
          const newTrackerName = [`level ${levelId}`, `timeLine ${timeLineId}`];
          // make new level tracker node and doubly link it with the current level
          // tracker node
          console.log({ winningState });
          insertState(
            graph,
            {
              name: newTrackerName,
              parent: currentTracker.name,
              children: [], // is updated each loop on line 193
            },
            {
              nextStates: [winningState.name],
              winningStateName: null,
            }
          );
          currentTracker.children.push(newTrackerName);

          bottom.children[i] = newTrackerName;
          currentTracker = getState(graph, newTrackerName);
          // console.log({ currentTracker });
          // console.log({
          //   graph,
          //   bottom,
          //   currentTracker,
          // });
          // insertState(graph, {
          //   name: ["calculator", "run state machine", "bottom"],
          // });
          // insertState(graph, {
          //   name: ["calculator", "run state machine", "bottom"],
          // });
          // insertState(graph, {
          //   name: ["calculator", "run state machine", "bottom"],
          // });
          // insertState(graph, {
          //   name: ["calculator", "run state machine", "bottom"],
          // });
          // insertState(graph, {
          //   name: ["calculator", "run state machine", "bottom"],
          // });
          // insertState(graph, {
          //   name: ["calculator", "run state machine", "bottom"],
          // });
          // console.log({ graph, winningState, nextStates });
          // return false;
          setVariable(
            graph,
            currentTracker.name,
            getVariable(graph, currentTracker.name, "nextStates").name[0],
            winningState.start
          );
          nextStates = getVariable(
            graph,
            currentTracker.name,
            "nextStates"
          ).value;
        } else if ("next" in winningState) {
          setVariable(
            graph,
            currentTracker.name,
            getVariable(graph, currentTracker.name, "nextStates").name[0],
            winningState.next
          );
          setVariable(
            graph,
            currentTracker.name,
            getVariable(graph, currentTracker.name, "winningStateName").name[0],
            null
          );
          nextStates = getVariable(
            graph,
            currentTracker.name,
            "nextStates"
          ).value;
          console.log("here", { winningState, currentTracker, nextStates });

          if (winningState.next.length > 0) {
            // there are next states to run
          } else {
            // winningState is an end state
            console.log("end state", { winningState });
          }
        } else {
          // winningState is an end state
          console.log("end state", { winningState });
          /*
          move up to parent node (current node has already been checked)
          delete the current node
          while parent node exists
            if parent node has next
              stop loop
            else
              move up to parent node
              delete the current node
          if parent node doesn't exist
            state machine is done
          */
          bottom.children[i] = getState(
            graph,
            getState(graph, bottom.children[i]).parent
          ).name;
          // console.log({ bottom, currentTracker, states: graph.statesObject });
          // delete variables under currentTracker
          Object.keys(currentTracker.variables).forEach((variableName) => {
            delete graph.statesObject.states[
              currentTracker.variables[variableName]
            ];
          });
          // delete currentTracker
          deleteNodes(graph, currentTracker.name);
          currentTracker = getState(graph, bottom.children[i]);
          console.log({ bottom, currentTracker, graph });
          // while(bottom.children[i]) {

          // }
          return;
        }
        stateRunCount += 1;

        // return false;
      }
    });
    return false;
  }
};

export { getVariable, setVariable };
