import React from "react"

class InsertWords extends React.Component {

    // F
    //         Is black box
    //             Return false
    //         Is not black box
    //               Is not active
    //                   return true
    //                 Is active
    //                   Return 3rd


    // G
    //         If not f
    //             Return black box version of code being run
    //             [not active, black box payload]
    //         If not 3rd
    //                 If active budget is full
    //                         Set current scoped active to on and clear out budget
    //                         return [active,  no payload]
    //                 Else
    //                       Return [not active, no payload]


    // will be put everywhere
    // [isActive, black box payload] = g()

    // if not isActive
    //   return black box payload or nothing
    // else
    //   return component code with debugger tags

    constructor(props) {
        super(props)
        this.state = {
            data: {
                Version1: {
                    active_budget: 1,   // assume user pressed button
                    TrieTreeInsertWords2: {
                        current_node_id: null,
                        current_node: null,

                        current_node_id_stack: [],
                        current_node_stack: [],
                        print_payload: [],   // this is for returning all the messages made in that function

                      init: {
                        black_box: false,
                        active: false,
                        // appears to work
                        code_block: (function_object) => {
                            console.log("my function object", function_object)
                          function_object.current_node_id = 0
                          function_object.current_node_id_stack.push(0)
                        }
                      },
                      forLoop: {
                        black_box: false,
                        active: false,
            
                        setup: {
                          
                        },
                        innerForLoop: {
                          setup: {
            
                          },
                          is_edge_equal_to_negative_1 : {
                            // only gets run if condition is true
            
                          },
                          is_edge_greater_than_0 : {
            
                          }
            
                        }
                  
                      }
                    }
                }
            }
            ,
            // may need to put the functions in here(code blocks and nested calls)
            // data: props.props.Version1,

            F: (block) => {
                // console.log("block", block)
                if(block.black_box) {
                    return 0
                } else {
                    if(!block.active) {
                        return 1
                    } else {
                        return 2
                    }
                }
            },
            G: (block, global) => {
                // do we activeate the code block display or black box it?

                // will still activate all items the user has already activated

                console.log("block", block)
                console.log("global", global)
                // console.log(this.state.F(this.state.data.init))
                const result = this.state.F(block)
                console.log("result", result)
                // black box
                if(result === 0) {
                    return [false, "black box"]
                    // no black box and not active
                } else if(result === 1) {
                    // what happens if we want to loop a code block via button?
                    // only let display if user pressed the button
                    if(global.active_budget === 1) {
                        block.active = true
                        global.active_budget = 0
                        return [true, "no black box"]
                    } else {
                        return [false, "no black box"]

                    }
                    // no black box and active
                } else if(result === 2) {
                    // console.log("already active")
                    return [true, "no black box"]
                }

            },
            insertWords: () => {
                // assuming the user runs the function each timestep all the activated code will be run again
                // unless we force each code block to not run if the user ran it las time insertWords was called
                let messages = []
                console.log(this.state.data)
                // the user will press a button to progress 1 timestep forward
                // only code blocks in it's specifited timestep will run
                let [is_active, payload] = this.state.G(this.state.data.Version1.TrieTreeInsertWords2.init, this.state.data.Version1)
                console.log(is_active, payload)
                // console.log(props.props.Version1)
                // early exit
                // code gets run both times, the question is "will the code be displayed as a black box or not"
                // if user has already activated this code
                    // don't rerun it
                    // show the component debug data already collected from the stacks

                if(!is_active) {
                    console.log("return", payload)
                    this.state.data.Version1.TrieTreeInsertWords2.init.code_block(this.state.data.Version1.TrieTreeInsertWords2)
                    messages.push(<div key={0}>{"we have only black box work or nothing"}</div>)
                } else {
                    this.state.data.Version1.TrieTreeInsertWords2.init.code_block(this.state.data.Version1.TrieTreeInsertWords2)
                    messages.push(<div key={1}>{"keep going with execution"}</div>)
                    messages.push(<div key={2}>{String(this.state.data.Version1.TrieTreeInsertWords2.current_node_id)}</div>)


                }
                // return <div>{"keep going with execution"}</div>
                // console.log("middle", this.state.data)

                // this.state.data.active_budget = 1;
                // pass in an expresion saying if we are repeating
                // while repeat is true
                    // do 1 round of for loop
                [is_active, payload] = this.state.G(this.state.data.Version1.TrieTreeInsertWords2.forLoop, this.state.data.Version1)
                console.log(is_active, payload)
                // console.log(props.props.Version1)

                    if(!is_active) {
                        console.log("return", payload)
                        messages.push(<div key={3}>{"we have only black box work or nothing"}</div>)
                    } else {
                        messages.push(<div key={4}>{"keep going with execution"}</div>)

                    }
                return messages
                // if we can't run this block
                    // back out with empty div
                
                // props.current_state_id = 0
                // record the data
                // send record to display


                // if we can't run the for loop
                    // back out with empty div

                // each code block can early return
            }
        }
    }

    render() {
        return (
            <div>
                {this.state.insertWords()}
            </div>
        )
    }

}

export default InsertWords;