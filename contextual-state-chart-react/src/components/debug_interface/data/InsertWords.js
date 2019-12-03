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
            stack: [],
            count: 0,
            messages: [],
            message_block: [],
            key_count: 0,
            // may need to put the functions in here(code blocks and nested calls)
            // data: props.props.Version1,
            // passing parts of a state dict into an arrow function
            
            
           
            
            data: {
                Version1: {
                    active_budget: 1,   // assume user pressed button
                    messages: [],
                    TrieTreeInsertWords2: {
                        string: "start",
                        key_count: 0,
                        current_node_id: null,
                        current_node: null,

                        current_node_id_stack: [],
                        current_node_stack: [],
                        stuff: [1, 2],
                        
                        black_box: false,
                        active: false,
                        one_click: false,
                        scopes : {
                            init: {
                                string: "init", 
                                black_box: false,
                                active: false,
                                one_click: false,
                                // each code block: {function: () => {}, redirect_for_code_block: [string_name_of_code_block_at_nesting_level_1]}
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
                                string: "forLoop",
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
                                            // if there was a function call here, how would I know to redirect it?
                                            // make all the if statements code blocks that only run if they are true
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

                                scopes: {
                                    // looop throught 2 values
                                    setup: {
                                        string: "forLoop setup"                     
                                    },
                                    innerForLoop: {
                                        string: "forLoop innerForLoop",

                                        scopes: {

                                            setup: {
                                                string: "forLoop innerForLoop setup"
                                            },
                                            is_edge_equal_to_negative_1 : {
                                                string: "forLoop innerForLoop is_edge_equal_to_negative_1"

                                            },
                                            is_edge_greater_than_0 : {
                                                string: "forLoop innerForLoop is_edge_greater_than_0"

                                            }
                                        }
                                        

                                    }
                                }
                                
                        
                            }
                        }
                        
                    },
                    // repeat_status is used with the repeat condition to allow the user
                    // full control of the loop

                    // the one_click status is to run 1 time step as 1 code block or 
                    // a number of code blocks(user's choice)

                    // a redirect will send control to another code block inside the function
                    // It's used in place of a function call because embeding a function call inside a code block
                    // will prevent the user from controlling the variable changes happening inside the function call
                    // the redirect is basically a goto version of a function call
        
                    code_block_tree: {
                        string: "dummy start string",
                        scopes: {
                            init: {
                                one_click: false,
                                repeat_status: false,
                                string: "init one"  // replace with a code block after dft tests pass
    
                            },
                            outerForLoop: {
                                one_click: false,
    
                                repeat_status: true,
                                repeat_condition: () => {},
    
                                string: "outerForLoop",
                                scopes: {
                                    setup: {
                                        one_click: false,
                                        repeat_status: false,
                                        string: "outerForLoop setup",
        
        
                                    },
                                    innerForLoop: {
                                        one_click: false,
        
                                        repeat_status: true,
                                        repeat_condition: () => {},
                                        string: "outerForLoop innerForLoop"
        
                                    }
                                }
                                
                            },
                            forLoopTwo: {
                                one_click: false,
    
                                repeat_status: true,
                                repeat_condition: () => {},
                                string: "forLoopTwo",
                                scopes: {
                                    innerForLoop: {
                                        one_click: false,
        
                                        repeat_status: true,
                                        repeat_condition: () => {
            
                                        },
                                        string: "forLoopTwo innerForLoop"
        
                                    }
                                }
                                
    
                            },
                            lastScope: {
                                one_click: false,
                                repeat_status: false,
                                string: "outerForLoop lastScope"
                            }
                        }
                        
                    }
                }
            },
            // stack: [{codeBlock: this.data/*.Version1["code_block_tree"]*/, ithChildCodeBlock: 0}],

            // normally, the timelines the code blocks run would be run inside the users head
            ControlFlowArray: [
                (function_block, messages, message_block, key_count) => {

                    this.F1(this.G,
                        this.MakeMessages,
                        this,
                        function_block.state.data.Version1.TrieTreeInsertWords2.init,
                        function_block.state.data.Version1,
                        function_block.state.data.Version1.TrieTreeInsertWords2,
                        key_count,
                        messages,
                        message_block)
                }

            ]
        }
    }
    F =(block) => {
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
    }
    G = (block, global) => {
        // only for running 1 code block
        // no repeats
        // do we activeate the code block display or black box it?

        // will still activate all items the user has already activated

        
        // console.log("block", block)
        // console.log("global", global)
        // console.log(this.state.F(this.state.data.init))
        const result = this.F(block)
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

    }
    MakeMessages = (is_active, messages, message_block, key_count) => {
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
    }
    F1 = (G,
        MakeMessages,
        this_,
        this_state_data_Version1_TrieTreeInsertWords2_init,
        this_state_data_Version1,
        this_state_data_Version1_TrieTreeInsertWords2,
        key_count,
        messages,
        message_block) => {
            let [is_active, payload] = this.G(this_state_data_Version1_TrieTreeInsertWords2_init, this_state_data_Version1)

            message_block = this_state_data_Version1_TrieTreeInsertWords2_init.code_block(this_state_data_Version1_TrieTreeInsertWords2, key_count)
            key_count += 1

            MakeMessages(is_active, messages, message_block, key_count)

            message_block = []

            key_count += 1




    }
    F2 = (state, function_block) => {
        // state.G,
        // state.MakeMessages,
        // state.data.Version1.TrieTreeInsertWords2.forLoop(the function),
        // state.data.Version1,
        // state.data.Version1.TrieTreeInsertWords2,
        // state.key_count,
        // state.messages,
        // state.message_block
        let [is_active, payload] = this.G(function_block, state.data.Version1)

        state.message_block = function_block.code_block(state.data.Version1.TrieTreeInsertWords2, state.key_count)
        // key_count += 1

        // MakeMessages(is_active, messages, message_block, key_count)

        // message_block = []

        // key_count += 1
    }
    // if the ith click was passed in then this could select the right one
    insertWords = () => {
        // the 1 click runs will be assumed to start from the bottom of the tree and grow up
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
        this.state.ControlFlowArray[0](this, this.state.messages, this.state.message_block, this.state.key_count)
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
            this.F1(this.G,
                this.MakeMessages,
                this,
                this.state.data.Version1.TrieTreeInsertWords2.forLoop,
                this.state.data.Version1,
                this.state.data.Version1.TrieTreeInsertWords2,
                this.state.key_count,
                this.state.messages,
                this.state.message_block)
            // this.state
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
        // this.state.data.Version1.code_block_tree
        // each code block can early return
    }
    TraverseCodeBlocks = () => {
        // console.log(this.state.data.Version1["code_block_tree"])
        // this.state.data.Version1.TrieTreeInsertWords2

        this.stack = [{codeBlock: this.state.data.Version1["TrieTreeInsertWords2"], ithChildCodeBlock: 0}]

        
        // console.log(Object.keys(this.state.data.Version1["code_block_tree"]["scopes"]))
        // console.log(stack)
        this.count = 0
        console.log("start")

        // this.state.visitOneNode(this.stack, this.count)
        // this.state.visitOneNode(this.stack, this.count)
        // this.state.visitOneNode(this.stack, this.count)
        // this.state.visitOneNode(this.stack, this.count)
        // this.state.visitOneNode(this.stack, this.count)
        // this.state.visitOneNode(this.stack, this.count)
        // this.state.visitOneNode(this.stack, this.count)
        
        // each round maps to 1 click

    }
    visitOneNode = (stack, count) => {
        if(stack.length > 0 && count <= 10) {
        
            // process
            // rearange the general order
            let node = stack[stack.length - 1]["codeBlock"]

            // process our code block
            console.log("the string", node.string)
            // console.log("node keys", Object.keys(node), (Object.keys(node).includes("scopes")))
            if(Object.keys(node).includes("scopes")) {
                // console.log("has scope")
                // console.log([...stack])

                // go deeper
                const key = Object.keys(node["scopes"])[0]

                stack.push({codeBlock: node["scopes"][key], ithChildCodeBlock: 0})
                // console.log("updated stack", [...stack])

            } else {
                // console.log("has no scope")
                // console.log([...stack])
                stack.pop()

                // console.log(stack[stack.length - 1]["ithChildCodeBlock"])
                // may not have a scope
                // console.log(stack[stack.length - 1]["codeBlock"])
                // console.log(stack[stack.length - 1]["ithChildCodeBlock"] < Object.keys(stack[stack.length - 1]["codeBlock"]["scopes"]).length - 2)

                // the long expression was accessible but js could not do it for the while loop
                let x = stack[stack.length - 1]["ithChildCodeBlock"]
                let y = stack[stack.length - 1]["codeBlock"]["scopes"]
                let z = Object.keys(y)
                let a = z.length - 2
                // console.log(x, y, z, a)

                let pullOutCount = 0
                // pull out and get the next one
                while(
                    !(
                        // is there another child to get
                        // it's okay to be on the last item
                        x <= a
                    )) {
                        
                        stack.pop()
                        if(stack.length === 0)
                        {
                            break;
                        }
                        // console.log(pullOutCount)
                        if(pullOutCount >= 20) {
                            console.log("messed up")
                            debugger
                        }
                        pullOutCount += 1
                        // console.log([...stack])
                        x = stack[stack.length - 1]["ithChildCodeBlock"]
                        y = stack[stack.length - 1]["codeBlock"]["scopes"]
                        z = Object.keys(y)
                        a = z.length - 2
                        // console.log("the group")
                        // console.log( x, y, z, a)


                    }
                if(stack.length === 0)
                {
                    return;
                }
                // console.log("top item", stack[stack.length - 1])
                // can't use the stack[stack.length - 1]["ithChildCodeBlock"] += 1 here
                stack[stack.length - 1] = {...stack[stack.length - 1],
                                            ithChildCodeBlock: stack[stack.length - 1]["ithChildCodeBlock"] + 1}

                // console.log("incremented")
                // console.log("done poping")
                // console.log([...stack])

                // console.log("adding new item")
                x = stack[stack.length - 1]["ithChildCodeBlock"]
                y = stack[stack.length - 1]["codeBlock"]["scopes"]
                z = Object.keys(y)
                a = z.length - 1
                if(x <= a) {
                    let ithChild = stack[stack.length - 1]["ithChildCodeBlock"]
                    const nextKey = Object.keys(stack[stack.length - 1]["codeBlock"]["scopes"])[  ithChild ]

                    stack.push({codeBlock: stack[stack.length - 1]["codeBlock"]["scopes"][nextKey], ithChildCodeBlock: 0})
                    // console.log("done adding")
                    // console.log([...stack])
                    
                }

            }
            count += 1
        }
    }
    // implicitely binds to the class "this"
    thisIsATest = () => {

    }
    render() {
        return (
            <div>
                {/* look at modal view in Celebrity Dead or Alive */}
                {/* <button >1 step</button> */}
                {/* {this.insertWords()} */}
                {this.TraverseCodeBlocks()}
                <button onClick={() => (this.visitOneNode(this.stack, this.count))}>
                    next step
                </button>

                {/* make a new function to handle the click conversion */}
            </div>
        )
    }

}

export default InsertWords;