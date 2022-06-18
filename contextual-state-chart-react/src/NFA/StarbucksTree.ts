import {
  returnTrue,
  returnFalse,
} from "../Calculator/CalculatorStateFunctions";

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
                      init: { currentOrder: { value: 0 }, price: { value: 0 } },
                    },
                    timelineIDs: {},
                    destinationTimelines: ["Customer"],
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
                    edgeGroups: [
                      {
                        edges: [
                          {
                            nextStateName: ["Take order", "from customer"],
                          },
                          { nextStateName: ["Dig up money"] },
                          { nextStateName: ["Sip coffee"] },
                        ],
                        areParallel: true,
                      },
                    ],
                    haveStartChildren: false,
                  },
                },
                "Dig up money": {
                  state: {
                    functionCode: returnTrue,
                    edgeGroups: [
                      {
                        edges: [
                          {
                            nextStateName: ["Compute change"],
                          },
                          { nextStateName: ["Put away change"] },
                        ],
                        areParallel: true,
                      },
                    ],
                    haveStartChildren: false,
                  },
                },
                "Put away change": {
                  state: {
                    functionCode: returnTrue,
                  },
                },
                "Sip coffee": {
                  state: {
                    functionCode: returnTrue,
                  },
                },
              },
              variables: {
                init: {},
              },
              timelineIDs: {
                1: 2,
              },
              destinationTimelines: ["Cashier"],
            },
          },
        },
      },
    },
  },
  database: {
    drinks: {
      names: ["Pistachio"],
      options: {
        size: { value: 1 },
        flavors: { value: 1 },
        toppings: { value: 1 },
      },
    },
    size: {},
    flavors: {},
    toppings: {},
  },
};

export { StartbucksStateTree };
