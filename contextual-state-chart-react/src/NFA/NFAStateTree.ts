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

  calculator: {
    state: {
      functionCode: returnTrue,
      start: [["createExpression"]],
      children: {
        createExpression: {
          state: {
            functionCode: returnTrue,
            next: [["test", "evaluateExpression"]],
            start: [["number"]],
            children: {
              number: {
                state: {
                  functionCode: returnTrue,
                  next: [["is input valid"], ["operator"]],
                  // children: ["number get digit"],
                  start: [["number get digit"]],
                  children: {
                    "number get digit": {
                      state: {
                        // functionCode: numberGetDigit,
                        next: [["number get digit"], ["save number"]],
                      },
                    },
                    "save number": {
                      state: {
                        // functionCode: saveNumber,
                        start: [["fake", "endState1"]],
                        children: {
                          fake: {
                            endState1: {
                              state: {
                                functionCode: returnTrue,
                                start: [["fake", "endState2"]],

                                children: {
                                  fake: {
                                    endState2: {
                                      state: {
                                        functionCode: returnTrue,
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
              "is input valid": {
                state: {
                  //   functionCode: isInputValid,
                  // returns true if we hit end of input and it's a valid expression
                },
              },
              operator: {
                state: {
                  functionCode: returnTrue,
                  next: [["number"]],
                  start: [["operator", "get"]],
                  // children: ["operator get operator"],
                  children: {
                    operator: {
                      get: {
                        state: {
                          // getOperator
                          //   functionCode: operatorGetOperator,
                          next: [["operator", "save"]],
                        },
                      },
                      save: {
                        state: {
                          //   functionCode: saveOperator,
                        },
                      },
                    },
                  },
                },
              },
            },
            variables: { token: { value: "" } },
          },
        },
        test: {
          evaluateExpression: {
            state: {
              functionCode: returnTrue,
              next: [["inputHas1Value"] /*,'evaluateExpression'*/],
              start: [["a0"]],
              children: {
                // get, save, increment or update the array
                a0: {
                  state: {
                    // functionCode: getA2, // increment
                    next: [["resetForNextRoundOfInput"], ["op"], ["opIgnore"]],
                  },
                },

                op: {
                  state: {
                    functionCode: "isOp2", // increment
                    next: [["b evaluate"]],
                  },
                },
                // add new step to save b?
                // make a result variable to show the result?
                // the item 'b evaluate' put in is the same item 'a0' starts on
                "b evaluate": {
                  state: {
                    functionCode: "evaluate2", // updates the array
                    next: [["a0"]],
                  },
                },

                opIgnore: {
                  state: {
                    functionCode: "ignoreOp2", // increment
                    next: [["a0"]],
                  },
                },

                // some of this is wrong
                resetForNextRoundOfInput: {
                  state: {
                    functionCode: "resetForNextRound2",
                    next: [/*'endOfEvaluating'*/ ["inputHas1Value"], ["a0"]],
                  },
                },
              },
              variables: {
                i2: { value: 0 },
                a: { value: 0 },
                b: { value: 0 },
                operators: [
                  { value: "*" },
                  { value: "/" },
                  { value: "-" },
                  { value: "+" },
                ],
                j: { value: 0 },
                operatorFunctions: {
                  "*": { value: "mult" },
                  "/": { value: "divide" },
                  "+": { value: "plus" },
                  "-": { value: "minus" },
                },
              },
            },
          },
          state: {
            functionCode: "yes",
          },
          anotherTest: {
            state: { functionCode: "yes" },
            testing: {
              test: {
                state: {
                  functionCode: "yes",
                },
              },
            },
          },
        },
        "another test": {
          inputHas1Value: {
            state: {
              functionCode: "showAndExit2",
            },
          },
          fakeState: {
            state: {
              functionCode: "yes",
            },
          },
        },
      },
      variables: {
        i1: { value: 0 },
        input: { value: "1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12" },
        expression: { value: [] },
        x: [
          { something: { y: { value: 0 } } },
          { a: { b: { variable: { value: {} } } } },
        ],
        y: [
          { value: 5 },
          { value: 6 },
          { value: 4 },
          { value: 3 },
          { value: 2 },
          { value: 1 },
        ],
        // read through the input and makes an expression if one can be made
      },
    },
  },
};

export { NFAStateTree };
