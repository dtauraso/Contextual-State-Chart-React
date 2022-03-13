import {
  returnTrue,
  returnFalse,
} from "../Calculator/CalculatorStateFunctions";

let coffeeFrappuccino = {
  Coffee: {},
  Frappuccino: {},
};
let StartbucksStateTree = {
  machine: {
    StarbucksMachine: {
      functionCode: returnTrue,
      areChildrenParallel: true,
      start: [
        { nextStateName: ["Coffee Shop"] },
        { nextStateName: ["Customer"] },
      ],
      children: {
        "Coffee Shop": {
          currentTimelineID: -1,
          functionCode: returnTrue,
          areChildrenParallel: true,
          start: [
            { nextStateName: ["Cashier"] },
            { nextStateName: ["Barista"] },
          ],
          children: {
            Barista: {
              functionCode: returnTrue,
              areChildrenParallel: true,
              start: [{ nextStateName: ["Make drink"] }],
              children: {
                "Make drink": {
                  functionCode: returnTrue,
                  next: [{ nextStateName: ["Output buffer"] }],
                },
                "Output buffer": {
                  functionCode: returnTrue,
                  next: [
                    {
                      linkToDifferentTimeline: true,
                      nextStateName: ["Sip coffee"],
                    },
                  ],
                },
              },
            },
            Cashier: {
              areChildrenParallel: true,
              start: [{ nextStateName: ["Take order", "from customer"] }],
              children: {
                "Take order": {
                  "from customer": {
                    state: {
                      currentTimelineID: -1,

                      // branch bottom inside graph
                      // variable access, (branchID, parentStateName, variableName)
                      functionCode: returnTrue,
                      differentTimelineCount: 1,
                      // if variable can't be fetched set variable to undefined and print error message
                      // let machine crash
                      variableAccessDataFromDifferentTimelines: {
                        // parentStateName
                        Customer: {
                          timelineID: -1,
                          variableName: "customerOrder",
                        },
                      },
                      next: [{ nextStateName: ["Compute Price"] }],
                    },
                  },
                },
                "Compute price": {
                  functionCode: returnTrue,
                  areNextParallel: true,
                  next: [
                    {
                      linkToDifferentTimeline: true,
                      nextStateName: ["Dig up money"],
                    },
                    {
                      nextStateName: ["Compute change"],
                    },
                  ],
                },
                "Compute change": {
                  functionCode: returnTrue,
                  differentTimelineCount: 1,
                  next: [
                    { nextStateName: ["No change"] },
                    {
                      linkToDifferentTimeline: true,
                      nextStateName: ["Put away change"],
                    },
                  ],
                },
                "No change": {
                  functionCode: returnTrue,
                },
              },
            },
          },
          variables: {
            init: { orderQueue: [], outputBuffer: [] },
          },
        },
        Customer: {
          functionCode: returnTrue,
          children: {
            "Place order": {
              functionCode: returnTrue,
              areNextParallel: true,
              next: [
                {
                  linkToDifferentTimeline: true,
                  nextStateName: ["Take order", "from customer"],
                },
                { nextStateName: ["Dig up money"] },
                { nextStateName: ["Sip coffee"] },
              ],
            },
            "Dig up money": {
              functionCode: returnTrue,
              differentTimelineCount: 1,
              areNextParallel: true,
              next: [
                {
                  linkToDifferentTimeline: true,
                  nextStateName: ["Compute change"],
                },
                { nextStateName: ["Put away change"] },
              ],
            },
            "Put away change": {
              functionCode: returnTrue,
              differentTimelineCount: 1,
            },
            "Sip coffee": {
              functionCode: returnTrue,
              differentTimelineCount: 1,
            },
          },
        },
      },
    },
  },
  database: {
    names: {
      children: {
        Pistachio: {},
        ...coffeeFrappuccino,
      },
    },
    drinkNames: {
      start: [["Pistachio"]],
    },
    milkOptions: {
      start: [[]],
      "whole milk": {
        state: {
          variables: {
            left: 5, // units
          },
        },
        // have the trie tree be word based
      },
    },
    // barista resources context name for how much of the item there is
  },
};

export { StartbucksStateTree };
