import React from 'react';

import './App.css';
import Header from "./components/debug_interface/Header";
import Data from "./components/debug_interface/data/Data";
import InsertWords from "./components/debug_interface/data/InsertWords";
// import Variables from "./components/debug_interface/data/Variables";
// I ported the trie tree representation from C to JavaScript so I could finish
// the algorithm using react to assist debuggin(printing to a console is not
// user friendly and I don't want to loose what Lambda School taught me about react).
// I expect it will take me many months to finish this project to a 1.0 version


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
class App extends React.Component {

  constructor() {
    super();
    this.state = {
      // white box training wheels to black box batch testing for trie
      // put each old debugging version for the section into a modal when done
      // need people to see the previous debugging systems while I make progress on the 
      // functions are the saem, but the props are different
      // only let the function run when the button has activated
      
      
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Data />
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
        <InsertWords props={this.state}/>
        {/* <Variables /> */}
      </div>
    );
  }
}

export default App;
