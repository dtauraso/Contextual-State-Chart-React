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
      state: {
        functionCode: returnTrue,
        edgeGroups: [
          {
            edges: [
              { nextStateName: ["Coffee Shop"] },
              { nextStateName: ["Customer"] },
            ],
            areParallel: true,
          },
        ],
        haveStartChildren: true,
        children: {
          "Coffee Shop": {
            state: {
              currentTimelineID: -1,

              functionCode: returnTrue,
              edgeGroups: [
                {
                  edges: [
                    { nextStateName: ["Cashier"] },
                    { nextStateName: ["Barista"] },
                  ],
                  areParallel: true,
                },
              ],
              haveStartChildren: true,
              children: {
                Barista: {
                  state: {
                    functionCode: returnTrue,
                    edgeGroups: [
                      {
                        edges: [{ nextStateName: ["Make drink"] }],
                        areParallel: true,
                      },
                    ],
                    haveStartChildren: true,
                    children: {
                      "Make drink": {
                        state: {
                          functionCode: returnTrue,
                          edgeGroups: [
                            {
                              edges: [{ nextStateName: ["Output buffer"] }],
                              areParallel: false,
                            },
                          ],
                          haveStartChildren: false,
                        },
                      },
                      "Output buffer": {
                        state: {
                          functionCode: returnTrue,
                          edgeGroups: [
                            {
                              edges: [{ nextStateName: ["Sip coffee"] }],
                              areParallel: false,
                            },
                          ],
                          haveStartChildren: false,
                        },
                      },
                    },
                  },
                },
                Cashier: {
                  state: {
                    edgeGroups: [
                      {
                        edges: [
                          { nextStateName: ["Take order", "from customer"] },
                        ],
                        areParellel: true,
                      },
                    ],
                    haveStartChildren: true,
                    children: {
                      "Take order": {
                        "from customer": {
                          state: {
                            functionCode: returnTrue,
                            edgeGroups: [
                              {
                                edges: [{ nextStateName: ["Compute Price"] }],
                                areParallel: false,
                              },
                            ],
                            haveStartChildren: false,
                          },
                        },
                      },
                      "Compute price": {
                        state: {
                          functionCode: returnTrue,
                          edgeGroups: [
                            {
                              edges: [
                                {
                                  variablesToTransferToDifferentTimeline: [
                                    "price",
                                  ],
                                  nextStateName: ["Dig up money"],
                                },
                                { nextStateName: ["Compute change"] },
                                {
                                  variablesToTransferToDifferentTimeline: [
                                    "price",
                                  ],
                                  nextStateName: ["auditorStateName"],
                                },
                              ],
                              areParallel: true,
                            },
                          ],
                          haveStartChildren: false,
                        },
                      },
                      "Compute change": {
                        state: {
                          functionCode: returnTrue,
                          edgeGroups: [
                            {
                              edges: [
                                { nextStateName: ["No change"] },
                                {
                                  variablesToTransferToDifferentTimeline: [
                                    "change",
                                  ],
                                  nextStateName: ["Put away change"],
                                },
                              ],
                            },
                          ],
                          haveStartChildren: false,
                        },
                      },
                      "No change": {
                        state: { functionCode: returnTrue },
                      },
                    },
                    variables: {
                      init: { currentOrder: 0 },
                    },
                    timelineIDs: {},
                    destinationTimelines: ["Customer", "Auditor", "VIP"],
                  },
                },
              },
              variables: {
                init: { orderQueue: [], outputBuffer: [] },
              },
            },
          },
          Customer: {
            state: {
              functionCode: returnTrue,
              children: {
                "Place order": {
                  state: {
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
                },
                "Dig up money": {
                  state: {
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
                },
                "Put away change": {
                  state: {
                    functionCode: returnTrue,
                    differentTimelineCount: 1,
                  },
                },
                "Sip coffee": {
                  state: {
                    functionCode: returnTrue,
                    differentTimelineCount: 1,
                  },
                },
              },
              variables: {
                init: {},
                // otherTimelines: {
                //   Cashier: 1,

                //   // , startNameForLinkTable: true
                // },
                // timelineLinkTables: {
                //   "cashier customer nth id pair": {
                //     // selectable timelines
                //     branchIDOfCustomer: {
                //       branchIDOfCashier: -1,
                //       selectable: true,
                //     },
                //   },
                // },
                currentTimelineID: 0, // from stateRunTreeBottom["branches"]
                currentTimelineIDs: {
                  timelineIDNumber: {
                    timelineIDOfOtherTimeline: -1,
                  },
                },
              },
              timelineIDs: {
                1: 2,
              },
              timelinePairs: {
                Cashier: 1,
              },
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
