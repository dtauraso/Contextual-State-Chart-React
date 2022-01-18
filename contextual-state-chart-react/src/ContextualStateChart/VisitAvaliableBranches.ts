import { Graph } from "../App.types";
import { VisitBranches } from "./Visitor";
let tree = ["tree"];

const VisitAvaliableBranches = (graph: Graph) => {
  // use a bottom array
  // store id of the current state being run on the level at it's point in the timeline
  // have the states add themselves to the bottom and have them note the parent that got them there
  const stateRunCountMax = 8;
  const stateRunCount = graph.getState(tree).getVariable("stateRunCount");

  const bottom = graph.getState(tree).getVariable("stateRunTreeBottom");
  // bottom.value is now empty
  // todo: if last state run successfully then stop machine
  while (bottom.value.length > 0) {
    console.log({ stateRunCount: stateRunCount.value });
    if (stateRunCount.value >= stateRunCountMax) {
      console.log(
        `state run count is too high ${stateRunCount.value} >= ${stateRunCountMax}`
      );
      return false;
    }

    if (!VisitBranches(graph)) {
      return false;
    }

    stateRunCount.add(1);
  }
  return true;
};

export { VisitAvaliableBranches };
