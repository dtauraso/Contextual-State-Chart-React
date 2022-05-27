import {
  returnTrue,
  returnFalse,
} from "../Calculator/CalculatorStateFunctions";
// convenient way to set the tree up
const state9 = {
  state: {
    functionCode: returnTrue,
    edgeGroups: [{ edges: [["x"], ["y"]], isParallel: true }],
    haveStartChldren: true,
    children: {
      x: {
        state: {
          functionCode: returnTrue,
          edgeGroups: [],
          children: {},
        },
      },
      y: {
        state: {
          functionCode: returnTrue,
          edgeGroups: [],
          children: {},
        },
      },
    },
  },
};
const state7 = {
  state: {
    functionCode: returnTrue,
    edgeGroups: [
      {
        edges: [["8"], ["a"], ["b"], ["c"], ["d"], ["e"], ["9"]],
        areParallel: true,
      },
    ],
    haveStartChildren: true,
    children: {
      "9": state9,
      "8": {
        state: { functionCode: returnTrue },
      },
      a: {
        state: { functionCode: returnTrue },
      },
      b: {
        state: {
          functionCode: returnTrue,
        },
      },
      c: { state: { functionCode: returnTrue } },
      d: {
        state: {
          functionCode: returnTrue,
        },
      },
      e: {
        state: { functionCode: returnTrue },
      },
    },
  },
};
// there is no state shortcut for states with multiple parents
let NFAStateTree = {
  NFA: {
    state: {
      functionCode: returnTrue,
      edgeGroups: [{ edges: [["0"]], areParallel: true }],
      haveStartChildren: true,
      children: {
        "0": {
          state: {
            functionCode: returnTrue,
            edgeGroups: [{ edges: [["1"], ["2"]], areParallel: true }],
            haveStartChildren: true,
            children: {
              "1": {
                state: {
                  functionCode: returnTrue,
                  edgeGroups: [{ edges: [["3"], ["4"]], areParallel: true }],
                  haveStartChildren: true,
                  children: {
                    "3": {
                      state: { functionCode: returnTrue },
                    },
                    "4": {
                      state: {
                        functionCode: returnTrue,
                        edgeGroups: [{ edges: [["7"]], areParallel: true }],
                        haveStartChildren: true,
                        children: { "7": state7 },
                      },
                    },
                  },
                },
              },
              "2": {
                state: {
                  functionCode: returnTrue,
                  edgeGroups: [{ edges: [["5"], ["6"]], areParallel: true }],
                  haveStartChildren: true,
                  children: {
                    "5": {
                      state: {
                        functionCode: returnTrue,
                        edgeGroups: [{ edges: [["7"]], areParallel: true }],
                        haveStartChildren: true,
                        children: { "7": state7 },
                      },
                    },
                    "6": {
                      state: {
                        functionCode: returnTrue,
                        edgeGroups: [{ edges: [["10"]], areParallel: true }],
                        haveStartChildren: true,
                        children: {
                          "10": {
                            state: {
                              functionCode: returnTrue,
                              edgeGroups: [
                                { edges: [["9"]], areParallel: true },
                              ],
                              haveStartChildren: true,
                              children: { "9": state9 },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export { NFAStateTree };
