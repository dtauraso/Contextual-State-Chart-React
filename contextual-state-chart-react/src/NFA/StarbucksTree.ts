import {
  returnTrue,
  returnFalse,
} from "../Calculator/CalculatorStateFunctions";
import {
  barista,
  cashier,
  customer,
} from "../Starbucks/StarbucksStateFunctions";

let StartbucksStateTree = {
  machine: {
    StarbucksMachine: {
      state: {
        functionCode: returnTrue,
        edgeGroups: [
          {
            edges: [
              { nextStateName: ["Coffee Shop"] },
              { nextStateName: ["dummyState"] },
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
                    functionCode: barista,
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
                          edgeGroups: [],
                          haveStartChildren: false,
                        },
                      },
                    },
                  },
                },
                Cashier: {
                  state: {
                    functionCode: cashier,
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
                      "Compute Price": {
                        state: {
                          functionCode: returnTrue,
                          edgeGroups: [
                            {
                              edges: [{ nextStateName: ["Compute change"] }],
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
                              edges: [{ nextStateName: ["No change"] }],
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
                      init: {
                        currentOrder: { value: 23456 },
                        price: { value: 0 },
                      },
                    },
                    timelineIDs: {},
                    destinationTimeline: "Customer",
                  },
                },
              },
              variables: {
                init: {
                  orderQueue: { value: [] },
                  outputBuffer: { value: [] },
                },
              },
            },
          },
          dummyState: {
            state: {
              functionCode: returnTrue,
              edgeGroups: [
                {
                  edges: [{ nextStateName: ["Customer"] }],
                  areParallel: false,
                },
              ],
              haveStartChildren: true,
              children: {
                Customer: {
                  state: {
                    functionCode: customer,
                    edgeGroups: [
                      {
                        edges: [{ nextStateName: ["Place order"] }],
                        areParallel: false,
                      },
                    ],
                    haveStartChildren: true,
                    children: {
                      "Place order": {
                        state: {
                          functionCode: returnTrue,
                          edgeGroups: [
                            {
                              edges: [
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
                              edges: [{ nextStateName: ["Put away change"] }],
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
                      init: { drink: { value: "frap choco" } },
                    },
                    timelineIDs: {},
                    destinationTimeline: "Cashier",
                  },
                },
              },
            },
          },
        },
        // database
        variables: {
          drinks: [
            {
              name: { value: "Pistachio" },
              desciption: { value: "desciption 1" },
            },
          ],
          options: [
            { value: "size" },
            { value: "flavors" },
            { value: "toppings" },
          ],
          sizes: {
            large: { value: 1 },
            grande: { value: 1 },
            vente: { value: 1 },
          },
          flavors: {
            Sauces: [{ value: "Dark Caramel Sauce" }, { value: "Mocha Sauce" }],
            syrups: [
              { value: "Brown Sugar Syrup" },
              { value: "Caramel Syrup" },
            ],
          },
          toppings: { "cold foam": { value: "Chocolate Cream Cold Foam" } },
        },
      },
    },
  },
};
/*
size: {
  large: 1, grande: 1, vente: 1
}


database
trie:
  size: 0
  large: 1
  grande: 2
  vente: 3

0) name: "size", value: {1:1, 2:1, 3:1}
1) name: "1", value: "large"
2) name: "2", value: "grande"
3) name: "3", value: "vente"

graph.get("size") = {name: "size", value: {1:1, 2:1, 3:1}}
graph.get("size").get(customerSize) = "large"
*/

export { StartbucksStateTree };
