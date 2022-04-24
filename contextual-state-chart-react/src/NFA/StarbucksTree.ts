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
        areChildrenParallel: true,
        start: [
          { nextStateName: ["Coffee Shop"] },
          { nextStateName: ["Customer"] },
        ],
        children: {
          "Coffee Shop": {
            state: {
              currentTimelineID: -1,

              functionCode: returnTrue,
              areChildrenParallel: true,
              start: [
                { nextStateName: ["Cashier"] },
                { nextStateName: ["Barista"] },
              ],
              children: {
                Barista: {
                  state: {
                    functionCode: returnTrue,
                    areChildrenParallel: true,
                    start: [{ nextStateName: ["Make drink"] }],
                    children: {
                      "Make drink": {
                        state: {
                          functionCode: returnTrue,
                          next: [{ nextStateName: ["Output buffer"] }],
                        },
                      },
                      "Output buffer": {
                        state: {
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
                  },
                },
                Cashier: {
                  state: {
                    areChildrenParallel: true,
                    start: [{ nextStateName: ["Take order", "from customer"] }],
                    children: {
                      "Take order": {
                        "from customer": {
                          state: {
                            // branch bottom inside graph
                            /* variable access, (   branchID,
                                                    parallelBranchEnumerationID,
                                                    parentStateName,
                                                    variableName)
                            */
                            functionCode: returnTrue,
                            // access same timeline counter reguardless of how many times the state
                            // runs
                            stateRunCounts: {
                              timelineIDNumber: {
                                differentTimelineCountBeforeRunningState: 1,
                              },
                            },

                            // if variable can't be fetched set variable to undefined and print error message
                            // let machine crash
                            // variableAccessDataFromDifferentTimelines: {
                            //   // parentStateName
                            //   Customer: {
                            //     timelineID: -1,
                            //     variableName: "customerOrder",
                            //   },
                            // },
                            next: [{ nextStateName: ["Compute Price"] }],
                          },
                        },
                      },
                      "Compute price": {
                        state: {
                          functionCode: returnTrue,
                          areNextParallel: true,
                          // branchID
                          // accessing variables
                          // accessing curently active branchID
                          currentBranchID: -1,
                          next: [
                            // transfer variables from parent state 1 to parent state 2
                            // decrement the wait counter for next state
                            {
                              variablesToTransferToDifferentTimeline: ["price"],
                              nextStateName: ["Dig up money"],
                            },
                            {
                              nextStateName: ["Compute change"],
                            },
                            {
                              variablesToTransferToDifferentTimeline: ["price"],
                              nextStateName: ["auditorStateName"],
                            },
                          ],
                        },
                      },
                      "Compute change": {
                        state: {
                          functionCode: returnTrue,
                          differentTimelineCount: 1,
                          next: [
                            { nextStateName: ["No change"] },
                            {
                              variablesToTransferToDifferentTimeline: [
                                "change",
                              ],
                              nextStateName: ["Put away change"],
                            },
                          ],
                        },
                      },
                      "No change": {
                        state: { functionCode: returnTrue },
                      },
                    },
                    variables: {
                      init: {},
                      // otherTimelines: { Customer: 1 },
                      // timelineLinkTables: {
                      //   "cashier customer nth id pair": {
                      //     branchIDOfCashier: "branchIDOfCustomer",
                      //   },
                      // },
                    },
                    // only 1 -> 1 mapping allowed
                    // know what timelineID of different timeline to access ith version of variable inside parent
                    // state to copy variable into
                    // use 2sum solution with the keys being the destinationTimeline ID's
                    // branches[ithTimelineID].currentStateID
                    // test solution separately
                    timelineIDs: {
                      2: 1,
                    },
                    // if a state has an edge for a state with no timeline branch
                    // state cannot be run
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
