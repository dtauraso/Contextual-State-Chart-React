import {
  returnTrue,
  returnFalse,
} from "../Calculator/CalculatorStateFunctions";
// convenient way to set the tree up
const state9 = {
  "9": {
    state: {
      functionCode: returnTrue,
      areChildrenParallel: true,
      start: [["x"], ["y"]],
      children: {
        x: {
          state: {
            functionCode: returnTrue,
            areChildrenParallel: false,
            areNextParallel: false,
            children: {},
            // next: [],
          },
        },
        y: {
          state: {
            functionCode: returnTrue,
            areChildrenParallel: false,
            areNextParallel: false,
            children: {},
            // next: [],
          },
        },
      },
    },
  },
};
const state7 = {
  "7": {
    state: {
      functionCode: returnTrue,
      areChildrenParallel: true,
      start: [["8"], ["a"], ["b"], ["c"], ["d"], ["e"], ["9"]],
      children: {
        ...state9,
        "8": {
          state: { functionCode: returnTrue },
        },
        a: {
          state: { functionCode: returnTrue },
        },
        b: {
          state: {
            functionCode: returnTrue,
            areNextParallel: true,
            // next: [], //[["c"], ["d"]],
          },
        },
        c: { state: { functionCode: returnTrue } },
        d: {
          state: {
            functionCode: returnTrue,
            areNextParallel: true,
            // next: [], //[["e"]],
          },
        },
        e: {
          state: { functionCode: returnTrue },
        },
      },
    },
  },
};

let NFAStateTree = {
  NFA: {
    state: {
      areChildrenParallel: true,
      functionCode: returnTrue,
      start: [["0"]],
      children: {
        "0": {
          state: {
            functionCode: returnTrue,
            areChildrenParallel: true,
            start: [["1"], ["2"]],
            children: {
              "1": {
                state: {
                  areChildrenParallel: true,
                  functionCode: returnTrue,
                  start: [["3"], ["4"]],
                  children: {
                    "3": {
                      state: { functionCode: returnTrue },
                    },
                    "4": {
                      state: {
                        functionCode: returnTrue,
                        areChildrenParallel: true,
                        start: [["7"]],
                        children: { ...state7 },
                      },
                    },
                  },
                },
              },
              "2": {
                state: {
                  areChildrenParallel: true,
                  functionCode: returnTrue,
                  start: [["5"], ["6"]],
                  children: {
                    "5": {
                      state: {
                        functionCode: returnTrue,
                        areChildrenParallel: true,
                        start: [["7"]],
                        children: { ...state7 },
                      },
                    },
                    "6": {
                      state: {
                        areChildrenParallel: true,
                        functionCode: returnTrue,
                        start: [["10"]],
                        children: {
                          "10": {
                            state: {
                              functionCode: returnTrue,
                              areChildrenParallel: true,
                              start: [["9"]],
                              children: { ...state9 },
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
