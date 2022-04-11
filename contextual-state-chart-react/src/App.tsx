import React from "react";
import {
  insertName,
  setAttribute,
  // getStateNames,
  makeArrays,
} from "./ContextualStateChart/Init/ContextualStateChartInit";
import { Graph, NamesTrie } from "./App.types";
import { calculatorStateTree } from "./Calculator/CalculatorStateTree";
import {
  getState,
  getStateById,
  getVariable,
  getVariableById,
  stateTree,
} from "./ContextualStateChart/StateTree";
import { visitor } from "./ContextualStateChart/Visitor";
import { numberWrapper } from "./ContextualStateChart/StateTree";
import {
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject,
} from "./ContextualStateChart/Init/StatesObject";

import "./App.css";
import Header from "./components/debug_interface/Header";
// import Data from "./components/debug_interface/data/Data";
import InsertWords from "./components/debug_interface/data/InsertWords";
// basic contextual state chart editor
// drag and drop states only
// no fancy things
// don't use any of these
// https://dev.to/vaibhavkhulbe/make-interactive-node-based-graphs-with-react-flow-102d
// https://github.com/uber/react-digraph
// https://codesandbox.io/s/github/hshoff/vx/tree/master/packages/vx-demo/src/sandboxes/vx-dendrogram?file=/Example.tsx:63-72
// https://codesandbox.io/s/brave-cdn-oi45l?file=/Example.tsx
// have clickable menue modals that appear and you pick where you want the new state to go in relation to the current state
// or for swapping states
/*

https://fontawesome.com/icons/project-diagram?style=solid
https://fontawesome.com/icons/share-alt?style=solid
https://fontawesome.com/icons/sitemap?style=solid
https://thenounproject.com/term/dumbbell/168470/
https://thenounproject.com/term/dumbbell/795887/
https://thenounproject.com/term/dumbbell/201907/
https://thenounproject.com/term/binary-tree/582083/
https://fontawesome.com/icons/code?style=solid
http://blog.sklambert.com/finding-the-control-points-of-a-bezier-curve/
*/
let states = [
  {
    name: "test",
    id: 0,
    nextStates: [1, 2, 3],
    children: [4, 5, 6],
    variableNames: { i: 7, j: 8, myInput: 9 },
    value: 0,
  },
];
// f(json state tree) => trie array and state array
// can only put in a little bit of code to handle the trie and state arrays
// f(stateTree) => names and states arrays

// let stateTree = {
//   names: [],
//   states: [],
// };

/*
state id <- n next states
state id <- children
state id <- variableNamesTable

variableNamesTable
  variableName | value state id it's associated with | state id it's associated with

  i | 7 | 0
*/
// import Variables from "./components/debug_interface/data/Variables";
// I ported the trie tree representation from C to JavaScript so I could finish
// the algorithm using react to assist debuggin(printing to a console is not
// user friendly and I don't want to loose what Lambda School taught me about react).
// I expect it will take me many months to finish this project to a 1.0 version
/*
desigining all edges

grid
	represent using a sparse matrix as an adjaciency list
	1 means we are using that point for an edge between 2 nodes
	0 means the point is free


	interpolate the points and only try x, y channels that haven't been used along the segment we are using

	the max number of turns should be 4

  track#, level#, position on track
  

  each channel defined by (x = alpha, y = beta) can only be used 1 time
  each edge can only go from 1 node to 1 other node

  
  how the edges are arranged as the path changes direction
    depends on what track the state is on

    the order of the edges should reflect their order coming from the first node
      if the first edge starts at the top then when the course changes the edge
      should still be at the top.
  
  record all the lines used
  all existing edges need to be updated when we need room for a new channel
    update by shifting a point horizontally or vertically

  keep an array holding each level and the max and min y values of the boundary outer edges

  https://github.com/konvajs/react-konva


    link each pixel line to all the nodes and edges that touch it
  
    2 hash tables for each axis for measuring the location of each block

      (x) -> 1
      (y) -> 1
    
     a small nxn square of pixels is 1 block

    need prefix sums for calculating the offset amount for when each slot turns up

    across all child nodes or branch nodes
    outgoing edges and incomming edges all map to positional ports on the branch nodes

    when a node has too many ports the diagonal link to it from the prev node must be stretched(use the new slop and
      the outgoing edge port from the prev node to generate the new points)
      use the old slope and 1 of the original points to delete the old points
    
    make sure these are very small functions so any of them can be reused for when the state name component changes in size


    level order traversal
    geography of the nodes on each level
    array of the highest y value on each level

    interval of levels from the level of the source to the level of the destination
    node


    node:
      n ports
        only 1 possible incoming port
          top if it's a backlink
          bottom if it's a forward link
      port point:
      new y(y0) for the next port = (total ports used *
                                distance between edges) +
                                y part of (x, y) of top left point of state
      new x(x0) for the next part = x part of (x, y) of top left point of state

      first edge point:
        y1 = (total ports used *
              distance between edges) +
              y0

        x1= (total ports used from first node till node_i *
            distance between edges) +
            x0


      let max = 0
      for(let i = center; i < end; i++) {
          if(nodes[i].chilren.length > 1) {
            // only add the 2nd to the nth node to the count
            max += (nodes[i].chilren.length - 1)
          }
          else if(nodes[i].chilren.length === 0) {
            max--
          }
      }
      is this the right or preferred way to space horizonal timelines where we have a significan number
      of multiple branches?
      each group(not snecessarily sequential) of nodes that has multiple chilren where the child of one
      node that takes up the horizontal timeline of another node will also need to have multiple branching
      trees to keep the space
      How many nodes drive the children overflow?

      dft:

        levels[level_id] = Math.max(levels[level_id], node.childre.length / 2)

    sum of all the left children for the path
https://www.geeksforgeeks.org/print-binary-tree-2-dimensions/

    f(node, x, y)
      if node is null
        return
      else
        f(node.right, x + 5)
        y['val']++
        node.location = (x, y)
        f(node.left, x + 5)



    f(child) =
      0 if child is leaf
    
      node.childre.length / 2 + f(last child) if child is not leaf

    max(sum of all positive and negative children counts) at each level(what does this mean)
    
    holding the coordinates of the div blocks:
    xAxis = {200: {2003: 1, 2004 : 1, ...., 2020: 1}, 201: {567: 1}, ....}
    yAxis = {200: {2021: 1, 2022: 1,...,  2100: 1}, [5678]], 201: [[76543], [3456], [23419, 9876]], ....}

    horizontal scan line(y):
    
    xAxisLine = {}
    yAxisLine = {}

    startY = 200
    yAxisLine[startY] = 1


    for each x mapping to startY:
    
    // Object.keys(xAxis).forEach(interval => {

        // interval.forEach(xLine => {

          if (x, y) is in the scan dicts
            check for verticle match (y matches)
            if match stretch vertically
            else (x, y - 1) should be in the scan dicts and it is part of a 
            horizontal line
          else
            add (x, y) to the scan dicts
        })

    })

    
    the verticle distance between nodes will change once enough edges are added

    How will updating affect how future calculations are made?



  

*/

// part 1
// make an interface to represent debugging the data structure
// put in the code for each trie tree operation subsection(delete has at least 4 or 5 subsections)
// test each subsection with the interface
// expand by adding routes to places
// nave bar = [trie tree, state chart]
// advantages:
// have something to put on my portfolio and practice react skills while I finish the state machine algorithm
// and language
// use class based components
const twoSumMappingTest = () => {
  const branches = {
    0: { stateID: 1, countTillSameState: 4, currentCount: 0 },
    2: { stateID: 2, countTillSameState: 2, currentCount: 0 },
    4: { stateID: 3, countTillSameState: 2, currentCount: 0 },
    6: { stateID: 4, countTillSameState: 2, currentCount: 0 },
    8: { stateID: 5, countTillSameState: 2, currentCount: 0 },
  };

  // 1 way map from timeline state to all others
  const states = {
    1: {
      destinationTimelineStateIDs: [2, 3, 4, 5],
    },
    2: { destinationTimelineStateIDs: [3, 4, 5] },
    3: { destinationTimelineStateIDs: [4, 5] },
    4: { destinationTimelineStateIDs: [5] },
    5: {},
  };
  const counterpartTimeLine = {};

  // add branches of duplicate states
  // store branch mappings into the states object when found
};
const App = (props: any) => {
  // test();
  // console.log(x.prototype, x);
  // let myObject = arrayWrapper([7, 8, 3, 4]);
  // myObject.prototype = Object.setPrototypeOf(myObject, specialFunction);
  // myObject.prototype = Object.setPrototypeOf(myObject, specialFunction2);

  // myObject.prototype.mappy = specialFunction;
  // console.log({ myObject }, myObject.prototype);
  // console.log(myObject.value);
  // let y = myObject.value;

  // myObject.value = myObject
  //   .mapWrapper(
  //     (x: any, i: number, y: any) => ({ [i]: { x, y: y[i] + 3 } }),
  //     "test"
  //   )
  //   .mapWrapper((x: any, i: number, y: any) => ({ x, i, y: y[i] }), "test 2")
  //   .mapWrapper((x: any) => x.i * 7).value;

  // console.log(myObject.mappy2);
  // console.log("updated values", myObject.value);
  // console.log(myObject.records);

  // let i = numberWrapper();
  // i.setValue(5);
  // i.add(i.value + 1).add(1);
  // console.log({ i });
  let graph: Graph = {
    statesObject: { states: {}, nextStateId: 0 },
    namesTrie: {},
    // getState
    getState: getState,
    getStateById: getStateById,
    getVariableById: getVariableById,
  };
  makeArrays(stateTree, graph);
  let { statesObject, namesTrie } = graph;
  console.log({ namesTrie, statesObject });
  visitor(["NFA"], graph);
  // console.log(
  //   "namesTrie",
  //   JSON.parse(JSON.stringify(namesTrie)),
  //   "statesObject",
  //   JSON.parse(JSON.stringify(statesObject))
  // );

  /**
   *
   * clean up jobs before redesigning the old record system
   * 1 way to convert json to state objects(currently 2 ways to do this)
   * convert variable data structure to state objects
   * convert remaining simple data structures(string, flat array) to wrapper object
   * convert the ["run state machine", "calculator", "bottom"] state to a nested data structure
   */
  // console.log(Object.prototype.toString.call(null));
  // myObject.generic("push", 10);
  // console.log({ myObject: JSON.parse(JSON.stringify(myObject)) });
  // myObject.generic("pop");
  // console.log({ myObject });
  // jsonToStateObjects({}, []);
  // jsonToStateObjects([], []);
  // jsonToStateObjects(5, []);
  // jsonToStateObjects("5", []);
  // let objects: any = [];
  // jsonToStateObjects(
  //   {
  //     parentStateName: ["operator"],
  //     pass: true,
  //     stateName: ["operator", "get"],
  //     variables: {
  //       i1: {
  //         parentDataStateNameString: "calculator",
  //         value: 1,
  //         test: {
  //           something: 5,
  //           somethingElse: [5, 4, 3, 7, "test"],
  //         },
  //       },
  //       token: { parentDataStateNameString: "createExpression", value: "+" },
  //     },
  //   },
  //   objects,
  //   ["passing state name"]
  // );
  // console.log({ objects });

  // let idObjects = addIds(
  //   {
  //     parentStateName: ["operator"],
  //     pass: true,
  //     stateName: ["operator", "get"],
  //     variables: {
  //       i1: {
  //         parentDataStateNameString: "calculator",
  //         value: 1,
  //         test: {
  //           something: 5,
  //           somethingElse: [5, 4, 3, 7, "test"],
  //         },
  //       },
  //       token: { parentDataStateNameString: "createExpression", value: "+" },
  //     },
  //   },
  //   { id: -1 }
  // );
  // console.log({ idObjects });
  return (
    // constructor() {
    //   super();
    //   this.state = {
    //     myObject: { nestedObject: 0 },
    //     myOtherObject: { nestedObject2: 50 },
    //     // white box training wheels to black box batch testing for trie
    //     // put each old debugging version for the section into a modal when done
    //     // need people to see the previous debugging systems while I make progress on the
    //     // functions are the saem, but the props are different
    //     // only let the function run when the button has activated
    //   };
    // }

    <div className="App">
      {/* {this.thisIsATest()} */}
      {/* <Header /> */}
      {/* <Data /> */}
      <div>
        {/* {console.log('happening')} */}
        {/* the parent and the first state to run need to be the same for the first call */}
        {/* <button onClick={() => makeArrays(stateTree)}>start</button> */}
        {/* <button onClick={() => this.showStates()}>show states</button> */}

        {/* {this.state.stateChanges.length > 0 && this.state.stateChanges.map(level => (
                    level.map((state, i) => (
                        <State key={i} changes={state} />
                    ))
                ))} */}
      </div>
      {/* the action of vars changing through time and passing to functions 
        function signature
        the expressions passed in
        the values passed in
        at same level at top timeline have the function variables(reiterate the function stuff)
        need the trie tree to be fixed and on the side so we can follow the changes with the var timelines
        */}
      {/* trie tree as in https://en.wikipedia.org/wiki/Trie#/media/File:Trie_example.svg
        each node has the string traveled thus far


        have a stack of functions of variable timelines that grows and shrinks as the program executes
        once something is tested enough only the inputs and outputs will be recorded and the function will be shown to have been run
        any asyncronious variables show up at the function stack scope level when they are done(stack of async calls is optional)
        the forward button controls the time steps and control the acync vars when they show up(different timelines still run at the same time)
        it also has a copy at each function level so we can scroll down and not loose the button

        for the if statement timeline
        have a stack of decision trees(each tree is the if statement result)

        have a flag for each function's data in the dict to say if it's been tested already

         all for 1 function
          i:
          0, 1, 2, 4
          
          j:
          i, u, y, t


          i: 2                          4
          j: y                          t
          if, while loop tree 0      | if tree 1  (these segments of the forest may be recreated in each forest, fractal style)

          the timelines will be nested for the condition trees
          hilight corresponding values

          pretend f(), g() have already been tested and work
          q: f(i=1, j=u) -> [89, 9, 8, ], 

          not much we can do about this(readability counts more here)
          x: f(i=1, j=u) -> {

          },
          {

          } 
  
          h(i=4, j=t), 


          assume an object being filled is a group of variables with data set to something other than 0(unless they have been set)
          at the times they are set

          a: 1, 3, 4, 4
          b: null, null, 56, 56
          c: 0, 0, 0, 1, 1

          (a, b c) => (4 56, 1)

          will only work well if the function io is small(no superlarge json objects)
          F
            Is black box
                Return false
            Is not black box
                  Is not active
                      return true
                    Is active
                      Return 3rd
            G
            If not f
                Return black box version of code being run
                [not active, black box payload]
            If not 3rd
                    If active budget is full
                            Set current scoped active to on and clear out budget
                            return [active,  no payload]
                    Else
                          Return [not active, no payload]



            will be put everywhere
            [isActive, black box payload] = g()

            if not isActive
              return black box payload or nothing
            else
              return component code with debugger tags


            there will be code that can't be run untill the user presses the time advance button enough times





            Button sends the activate signal to the next level or next step in timeline having an active setting of false

            Press button
                Wave activates the next code block
        */}
      {/* <InsertWords props={this.state}/> */}
      {/* <Variables /> */}
    </div>
  );
};

export default App;
