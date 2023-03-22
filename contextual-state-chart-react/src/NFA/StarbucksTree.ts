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
  Cashier: {
    state: {
      functionCode: returnTrue, //customer,
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
            lockedByStates: { "Compute Price": true },
            lockedByStatesCount: 1,
          },
        },
        "Put away change": {
          state: {
            functionCode: returnTrue,
            lockedByStates: { "Compute change": true },
            lockedByStatesCount: 1,
          },
        },
        "Sip coffee": {
          state: {
            functionCode: returnTrue,
            lockedByStates: { "Output buffer": true },
            lockedByStatesCount: 1,
          },
        },
      },
      variables: {
        init: { drink: { value: "frap choco" } },
      },
      timelineIDs: {},
    },
  },
  Barista: {
    state: {
      functionCode: returnTrue,
    },
  },
};
let Cashier = {
  state: {
    functionCode: returnTrue, //cashier,
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
            lockedByStates: { "Place order": true },
            lockedByStatesCount: 1,
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
          lockedByStates: { "Dig up money": true },
          lockedByStatesCount: 1,
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
    functionCode: returnTrue, //barista,
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
              { nextStateName: ["Register"] },
              { nextStateName: ["Barista"] },
            ],
            areParallel: true,
          },
        ],
        haveStartChildren: true,
        variables: {
          init: {
            orderQueue: { value: [] },
            drinkOrder: { value: [] },
            outputBuffer: { value: [] },
          },
        },
        children: {
          Register: {
            state: {
              functionCode: returnTrue,
              edgeGroups: [
                {
                  edges: [
                    { nextStateName: ["Customer", "Cashier"] },
                    { nextStateName: ["Cashier"] },
                  ],
                  areParallel: true,
                },
                {
                  edges: [{ nextStateName: ["Customer", "Barista"] }],
                },
              ],
              haveStartChildren: true,
              variables: {
                init: { drinkPrice: { value: 0 }, change: { value: 0 } },
              },
              children: {
                Customer,
                Cashier,
              },
            },
          },
          Barista,
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
