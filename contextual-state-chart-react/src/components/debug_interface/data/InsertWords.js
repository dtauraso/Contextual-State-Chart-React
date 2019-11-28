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
                        stuff: [1, 2],
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
                            i: 0,
                            repeat: true,
                            code_block: (function_object) => {

                                if(function_object.forLoop.repeat) {
                                    // console.log("i", function_object.forLoop.i)
                                    // can't have out of bounds while testing
                                    if(function_object.forLoop.i < function_object.stuff.length) {
                                        // may want to put the tracking system in here for the inner loop(then call it via function_object
                                        // .forLoop.innerForLoop)

                                        // track setup
                                        // track innerForLoop
                                            // track setup
                                            // track and is_edge_equal_to_negative_1 only if condition is true
                                            // track and is_edge_greater_than_0 only if condition is true

                                        console.log(function_object.stuff[function_object.forLoop.i])

                                    } else {
                                        console.log(function_object.stuff[function_object.stuff.length - 1])

                                    }
                                }
                            },
                            // looop throught 2 values
                            setup: {
                            
                            },
                            innerForLoop: {
                                setup: {
                    
                                },
                                is_edge_equal_to_negative_1 : {
                    
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
            // passing parts of a state dict into an arrow function
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
                // only for running 1 code block
                // no repeats
                // do we activeate the code block display or black box it?

                // will still activate all items the user has already activated

                
                // console.log("block", block)
                // console.log("global", global)
                // console.log(this.state.F(this.state.data.init))
                const result = this.state.F(block)
                // console.log("result", result)
                // console.log("budget", global.active_budget)
                // black box
                if(result === 0) {
                    return [false, "black box"]
                    // no black box and not active
                } else if(result === 1) {

                    // only let display if user pressed the button
                    if(global.active_budget > 0) {
                        block.active = true
                        global.active_budget -= 1
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
                let key_count = 0
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
                this.state.data.Version1.TrieTreeInsertWords2.init.code_block(this.state.data.Version1.TrieTreeInsertWords2)

                if(!is_active) {
                    console.log("return", payload)
                    messages.push(<div key={key_count}>{"we have only black box work or nothing"}</div>)
                    key_count += 1
                } else {
                    messages.push(<div key={key_count}>{"keep going with execution"}</div>)
                    key_count += 1
                    messages.push(<div key={key_count}>{`current node ${this.state.data.Version1.TrieTreeInsertWords2.current_node_id}` }</div>)
                    key_count += 1

                }
                // return <div>{"keep going with execution"}</div>
                // console.log("middle", this.state.data)

                this.state.data.Version1.active_budget = 2;
                // let count = 0
                let insert_words_block = this.state.data.Version1.TrieTreeInsertWords2

                while(this.state.data.Version1.active_budget > 0 && insert_words_block.forLoop.repeat) {
                    // if(count >= 5) {
                    //     // debugger
                    // }
                    [is_active, payload] = this.state.G(insert_words_block.forLoop, this.state.data.Version1)
                    // console.log(is_active, payload)
                    // console.log(props.props.Version1)
                    insert_words_block.forLoop.code_block(insert_words_block)

                    if(!is_active) {
                        // console.log("return", payload)
                        

                        messages.push(<div key={key_count}>{`we have only black box work or nothing${key_count}`}</div>)
                        key_count += 1
                    } else {
                        // console.log("run the function")

                        messages.push(<div key={key_count}>{`keep going with execution ${key_count}`}</div>)
                        key_count += 1
                        messages.push(<div key={key_count}>{`${insert_words_block.forLoop.i} th stuff ${insert_words_block.stuff[insert_words_block.forLoop.i]}`}</div>)
                        key_count += 1

                    }
                    insert_words_block.forLoop.i += 1
                    // console.log(insert_words_block.forLoop.i)
                    insert_words_block.forLoop.repeat = insert_words_block.forLoop.i < insert_words_block.stuff.length
                    // count += 1
                }
                // while repeat is true
                    // do 1 round of for loop
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
                {/* look at modal view in Celebrity Dead or Alive */}
                <button >1 step</button>
                {this.state.insertWords()}
            </div>
        )
    }

}

export default InsertWords;