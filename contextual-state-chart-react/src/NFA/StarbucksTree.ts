import {
  returnTrue,
  returnFalse,
} from "../Calculator/CalculatorStateFunctions";
import {
  barista,
  cashier,
  customer,
} from "../Starbucks/StarbucksStateFunctions";

let Customer = {
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
  },
  Cashier: {
    state: {},
  },
  Barista: {
    state: {},
  },
};
let Cashier = {
  state: {
    functionCode: cashier,
    edgeGroups: [
      {
        edges: [{ nextStateName: ["Take order", "from customer"] }],
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
            stateDependencyCount: 1,
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
  },
};
let Barista = {
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
              { nextStateName: ["dummyState"] },
            ],
            areParallel: true,
          },
        ],
        haveStartChildren: true,
        children: {
          CustomerCashier: {
            state: {
              functionCode: returnTrue,
              children: {
                Customer: {
                  Cashier: Customer.Cashier,
                },
                Cashier,
              },
            },
          },
          Barista,
          CustomerBarista: {
            state: {
              functionCode: returnTrue,
              children: {
                Customer,
                Barista,
              },
            },
          },
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
                Barista,
                Cashier,
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
                Customer,
              },
            },
          },
        },
        database: {
          // search structure
          names: {
            Pistachio: {
              drink: {
                state: {
                  edgeGroups: [
                    {
                      edges: [
                        { nextStateName: "id number of pistachio drink state" },
                      ],
                    },
                  ],
                },
              },
            },
            "Dark Caramel Sauce": {
              flavor: {
                Sauces: {
                  state: {
                    edgeGroups: [
                      {
                        edges: [
                          {
                            nextStateName:
                              "id number of dark carmel sauce state",
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
            Mocha: {
              Sauce: {
                state: {
                  edgeGroups: [
                    {
                      edges: [
                        { nextStateName: "id number of mocha sauce state" },
                      ],
                    },
                  ],
                },
              },
              Foam: {
                state: {
                  edgeGroups: [
                    {
                      edges: [
                        { nextStateName: "id number of mocha foam state" },
                      ],
                    },
                  ],
                },
              },
            },
            size: {
              options: {
                state: {
                  edgeGroups: [
                    {
                      edges: [
                        { nextStateName: "id number of size option state" },
                      ],
                    },
                  ],
                },
              },
            },
            "Chocolate Cream Cold Foam": {
              toppings: {
                "cold foam": {
                  state: {
                    edgeGroups: [
                      {
                        edges: [
                          {
                            nextStateName:
                              "id number of Chocolate Cream Cold Foam state",
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
          // data cells
          options: {
            state: {
              array: [
                { state: { value: "size" } },
                { state: { value: "flavors" } },
                { state: { value: "toppings" } },
              ],
            },
          },
          // https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations
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
          toppings: {
            "cold foam": {
              value: "Chocolate Cream Cold Foam",
              servings: 5,
              price: 1,
            },
          },
          drinks: [
            {
              name: { value: "Pistachio" },
              desciption: { value: "desciption 1" },
            },
          ],
        },
      },
    },
  },
};
/*
customer order: string
cashier: customer order -> drink data with price
barista: customer order -> drink data with resource availiability
customer order string -> parsed using names object -> compiled drink object

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
