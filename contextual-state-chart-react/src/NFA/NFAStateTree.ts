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
      children: {
        x: { functionCode: returnTrue },
        y: { functionCode: returnTrue },
      },
    },
  },
};
const state7 = {
  "7": {
    state: {
      functionCode: returnTrue,
      areChildrenParallel: true,
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
            next: [["c"], ["d"]],
          },
        },
        c: { state: { functionCode: returnTrue } },
        d: {
          state: {
            functionCode: returnTrue,
            areNextParallel: true,
            next: [["e"]],
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
  "0": {
    state: {
      areChildrenParallel: true,
      children: {
        "1": {
          state: {
            areChildrenParallel: true,
            children: {
              "3": {
                state: { functionCode: returnTrue },
              },
              "4": {
                state: {
                  functionCode: returnTrue,
                  areChildrenParallel: true,
                  children: { ...state7 },
                },
              },
            },
            functionCode: returnTrue,
          },
        },
        "2": {
          state: {
            areChildrenParallel: true,
            children: {
              "5": {
                state: {
                  functionCode: returnTrue,
                  areChildrenParallel: true,
                  children: { ...state7 },
                },
              },
              "6": {
                state: {
                  areChildrenParallel: true,
                  children: {
                    "10": {
                      state: {
                        functionCode: returnTrue,
                        areChildrenParallel: true,
                        children: { ...state9 },
                      },
                    },
                    functionCode: returnTrue,
                  },
                },
              },
              functionCode: returnTrue,
            },
          },
        },
        functionCode: returnTrue,
      },
    },
  },
};

export { NFAStateTree };
