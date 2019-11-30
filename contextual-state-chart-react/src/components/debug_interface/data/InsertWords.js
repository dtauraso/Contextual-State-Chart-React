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
            messages: [],
            message_block: [],
            key_count: 0,
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
            MakeMessages: (is_active, messages, message_block, key_count) => {
                if(!is_active) {
                    // console.log("return", payload)
                    

                    messages.push(<div key={key_count}>{`we have only black box work or nothing`}</div>)
                    // needs to be a class variable so accessing it in the function calls is easier
                } else {
                    // console.log("run the function")

                    messages.push(<div key={key_count}>{`keep going with loop execution`}</div>)
                    // console.log("key count", this.state.data.Version1.TrieTreeInsertWords2.key_count)

                    // should be the payload messges for the ith block run
                    // messages.push(<div key={key_count}>{`${insert_words_block.forLoop.i} th stuff ${insert_words_block.stuff[insert_words_block.forLoop.i]}`}</div>)
                    // console.log(this.state.data.Version1.TrieTreeInsertWords2.forLoop.print_payload)
                    messages.push(...message_block)


                }
            },
            F1: (G, MakeMessages, this_state_data_Version1_TrieTreeInsertWords2_init, this_state_data_Version1,
                this_state_data_Version1_TrieTreeInsertWords2, key_count, messages, message_block) => {
                    let [is_active, payload] = G(this_state_data_Version1_TrieTreeInsertWords2_init, this_state_data_Version1)

                    message_block = this_state_data_Version1_TrieTreeInsertWords2_init.code_block(this_state_data_Version1_TrieTreeInsertWords2, key_count)
                    key_count += 1
    
                    MakeMessages(is_active, messages, message_block, key_count)
    
                    message_block = []
    
                    key_count += 1
    
    


            },
            data: {
                Version1: {
                    active_budget: 1,   // assume user pressed button
                    messages: [],
                    TrieTreeInsertWords2: {
                        key_count: 0,
                        current_node_id: null,
                        current_node: null,

                        current_node_id_stack: [],
                        current_node_stack: [],
                        stuff: [1, 2],
                        
                        black_box: false,
                        active: false,
                        one_click: false,
                        init: {
                            black_box: false,
                            active: false,
                            one_click: false,
                            // appears to work
                            code_block: (function_object, key_count) => {
                                let my_messages = []
                                function_object.current_node_id = 0
                                function_object.current_node_id_stack.push(0)
                                // need a different payload for each code block

                                my_messages.push(<div key={key_count}>{`current node ${function_object.current_node_id}`}</div>)
                                // messages.push(<div key={key_count}>{`current node ${this.state.data.Version1.TrieTreeInsertWords2.current_node_id}` }</div>)
                                return my_messages
                            }
                        },
                        forLoop: {
                            black_box: false,
                            active: false,
                            one_click: false,
                            i: 0,
                            repeat: true,
                            code_block: (function_object, key_count) => {
                                let my_messages = []

                                // console.log("key count", function_object.key_count)
                                
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

                                        // console.log(function_object.stuff[function_object.forLoop.i])
                                        

                                        // messages.push(<div key={key_count}>{`${insert_words_block.forLoop.i} th stuff ${insert_words_block.stuff[insert_words_block.forLoop.i]}`}</div>)
                                        my_messages.push(<div key={key_count}>
                                            {`${function_object.forLoop.i} th stuff ${function_object.stuff[function_object.forLoop.i]}`}
                                            </div>)

                                    } else {
                                        // console.log(function_object.stuff[function_object.stuff.length - 1])

                                    }

                                }
                                return my_messages
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
            // normally, the timelines the code blocks run would be run inside the users head
            insertWordsControlFlowArray: [
                (function_block, messages, message_block, key_count) => {

                    function_block.state.F1(function_block.state.G,
                        function_block.state.MakeMessages,
                        function_block.state.data.Version1.TrieTreeInsertWords2.init,
                        function_block.state.data.Version1,
                        function_block.state.data.Version1.TrieTreeInsertWords2,
                        key_count,
                        messages,
                        message_block)
                }

            ],
            // if the ith click was passed in then this could select the right one
            insertWords: () => {
                // assuming the user runs the function each timestep all the activated code will be run again
                // unless we force each code block to not run if the user ran it las time insertWords was called
                // let messages = []
                // let key_count = this.state.data.Version1.TrieTreeInsertWords2.key_count
                console.log(this.state.data)
                // let key_count = 0
                // the user will press a button to progress 1 timestep forward
                // only code blocks in it's specifited timestep will run
                // use a bunch of local variables to change and pass the data to(so code can be factored out as function calls)
                // f(G, MakeMessages, this.state.data.Version1.TrieTreeInsertWords2.init, this.state.data.Version1,
                // this.state.data.Version1.TrieTreeInsertWords2, key_count, messages, message_block, is_active)
                this.state.insertWordsControlFlowArray[0](this, this.state.messages, this.state.message_block, this.state.key_count)
                // this.state.F1(this.state.G,
                //         this.state.MakeMessages,
                //         this.state.data.Version1.TrieTreeInsertWords2.init,
                //         this.state.data.Version1,
                //         this.state.data.Version1.TrieTreeInsertWords2,
                //         key_count,
                //         messages,
                //         message_block)
                // this.state.messages was passed in as a value, but the value is a reference
                // this.state.key_count was passed in as a value so this this.state.key_count didn't get updated       
                // not good design to have to compensate for problems 
                this.state.key_count += 2
                // console.log(key_count, messages)
                // debugger
                // let [is_active, payload] = this.state.G(this.state.data.Version1.TrieTreeInsertWords2.init, this.state.data.Version1)
                // console.log(is_active, payload)
                // console.log(props.props.Version1)
                // early exit
                // code gets run both times, the question is "will the code be displayed as a black box or not"
                // if user has already activated this code(how do we know this?)
                    // don't rerun it
                    // show the component debug data already collected from the stacks

                // message_block = this.state.data.Version1.TrieTreeInsertWords2.init.code_block(this.state.data.Version1.TrieTreeInsertWords2, key_count)
                // key_count += 1
                // console.log("key count", this.state.data.Version1.TrieTreeInsertWords2.key_count)
                // store each tracking if else in an array
                // when user clicks, keep track of the ith click
                // run the ith function
                // still thinks duplicate key is being used
                // this.state.MakeMessages(is_active, messages, message_block, key_count)
                // for consistency
                // message_block = []

                // key_count += 1

                // return <div>{"keep going with execution"}</div>
                // console.log("middle", this.state.data)

                this.state.data.Version1.active_budget = 2;
                // let count = 0
                let insert_words_block = this.state.data.Version1.TrieTreeInsertWords2
                // console.log("current status", insert_words_block)
                // want to run the ith iteration
                // change "while" to "if"
                // # of iterations is dependent on the number of user clicks
                // what happens when we want 1 click to run entire for loop?
                // enclose the if in a while?
                // make a 1 click run setting that runs the whole thing as an option?
                // need to have the same level of control over macro code blocks(consisting of > 1 code block) as code blocks
                // how does the 1 click run entire loop work on nested loops without using props?
                // settting a 1_click value for each inner scope would fix this.
                // f(this, insert_words_block)
                // how to make this map to multiple clicks? does it need to?
                // but we need settings for n clicks and the 1 click too.
                /*
                click #
                bin tree for each code block
                    1 click(active_budget == -1, all the code is run for 1 time step) or n clicks(active_budget == 1)
                1 click = 1 round of the dft loop through the code blocks
                                if the block is set to 1_click
                                    if the block is not a loop
                                        run the subblocks as bft
                                    else
                                        use the codeblock's repeat condition to run same block untill it's done
                        make dummy tree to represent this at a very simple level(scopes and strings) then a simple level(flags), then a regular level(add 1 click to them)
                                    
                    any -> x
                    are all the clicks a 1 click?
                1 -> a
                >= 2 and forLoop.repeat
                    is it a 1 click?
                        no
                            then run the if
                        yes
                            then run the if while repeat is true
                */

                while(this.state.data.Version1.active_budget > 0 && insert_words_block.forLoop.repeat) {
                    // if(count >= 5) {
                    //     // debugger
                    // }
                    // this.state.insertWordsControlFlowArray[1](this, this.state.messages, this.state.message_block, this.state.key_count)
                    this.state.F1(this.state.G,
                        this.state.MakeMessages,
                        this.state.data.Version1.TrieTreeInsertWords2.forLoop,
                        this.state.data.Version1,
                        this.state.data.Version1.TrieTreeInsertWords2,
                        this.state.key_count,
                        this.state.messages,
                        this.state.message_block)
                    this.state.key_count += 2


                    insert_words_block.forLoop.i += 1
                    // console.log(insert_words_block.forLoop.i)
                    insert_words_block.forLoop.repeat = insert_words_block.forLoop.i < insert_words_block.stuff.length
                    // count += 1
                }
                // while repeat is true
                    // do 1 round of for loop
                return this.state.messages
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
                {/* make a new function to handle the click conversion */}
            </div>
        )
    }

}

export default InsertWords;