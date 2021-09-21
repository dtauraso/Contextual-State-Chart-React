export let stateTree = {
  calculator: {
    functionCode: "returnTrue",
    children: {
      createExpression: {
        functionCode: "returnTrue",
        next: ["evaluateExpression"],
        start: ["number"],
        children: {
          number: {
            functionCode: "returnTrue",
            next: ["is input valid", "operator"],
            // children: ["number get digit"],
            start: ["number get digit"],
            children: {
              "number get digit": {
                functionCode: "numberGetDigit",
                next: ["number get digit", "save number"],
              },
              "save number": {
                functionCode: "saveNumber",
              },
            },
          },
          "is input valid": {
            functionCode: "isInputValid",
            // returns true if we hit end of input and it's a valid expression
          },
          operator: {
            functionCode: "returnTrue",
            next: ["number"],
            start: ["operator, get"],
            // children: ["operator get operator"],
            children: {
              operator: {
                get: {
                  // getOperator
                  functionCode: "operatorGetOperator",
                  next: ["operator, save"],
                },
                save: {
                  functionCode: "saveOperator",
                },
              },
            },
          },
        },
        variables: { token: { value: "" } },
      },
      evaluateExpression: {
        functionCode: "returnTrue",
        next: ["inputHas1Value" /*,'evaluateExpression'*/],
        start: ["a0"],
        children: {
          // get, save, increment or update the array
          a0: {
            functionCode: "getA2", // increment
            next: ["resetForNextRoundOfInput", "op", "opIgnore"],
          },

          op: {
            functionCode: "isOp2", // increment
            next: ["b evaluate"],
          },
          // add new step to save b?
          // make a result variable to show the result?
          // the item 'b evaluate' put in is the same item 'a0' starts on
          "b evaluate": {
            functionCode: "evaluate2", // updates the array
            next: ["a0"],
          },

          opIgnore: {
            functionCode: "ignoreOp2", // increment
            next: ["a0"],
          },

          // some of this is wrong
          resetForNextRoundOfInput: {
            functionCode: "resetForNextRound2",
            next: [/*'endOfEvaluating'*/ "inputHas1Value", "a0"],
          },
        },
        variables: {
          i2: {
            value: 0,
          },
          a: {
            value: 0,
          },
          b: {
            value: 0,
          },
          operators: {
            value: ["*", "/", "-", "+"],
          },
          j: {
            value: 0,
          },
          operatorFunctions: {
            value: { "*": "mult", "/": "divide", "+": "plus", "-": "minus" },
          },
        },
      },
      inputHas1Value: {
        functionCode: "showAndExit2",
      },
    },
    variables: {
      i1: {
        value: 0,
      },
      input: {
        value: "1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12",
      },
      expression: {
        value: [],
      },

      // read through the input and makes an expression if one can be made
    },
  },
};