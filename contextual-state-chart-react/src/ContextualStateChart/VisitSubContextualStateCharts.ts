import { Graph } from "../App.types";
import { visitBranches } from "./Visitor";
let tree = ["tree"];

const visitAvaliableBranches = (graph: Graph) => {
  const stateRunCountMax = 5;
  const stateRunCount = graph.getState(tree).getVariable("stateRunCount");

  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");

  while (bottom.value.length > 0) {
    console.log({ stateRunCount: stateRunCount.value });
    if (stateRunCount.value >= stateRunCountMax) {
      console.log(
        `state run count is too high ${stateRunCount.value} >= ${stateRunCountMax}`
      );
      return false;
    }

    if (!visitBranches(graph)) {
      return false;
    }

    stateRunCount.add(1);
  }
  return true;
};

export { visitAvaliableBranches };
