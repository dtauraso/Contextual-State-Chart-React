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
            data: props.props.Version1.TrieTreeInsertWords2,

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
                console.log("block", block, "global", global)
                // console.log(this.state.F(this.state.data.init))
                const result = this.state.F(this.state.data.init)
                console.log("result", result)
                // black box
                if(result === 0) {
                    return [false, "black box"]
                    // no black box and not active
                } else if(result === 1) {
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
                    return [true, "no black box"]
                }

            },
            insertWords: () => {
                console.log(this.state.data)
                const [is_active, payload] = this.state.G(this.state.data.init, props.props.Version1)
                // console.log(is_active, payload)
                // console.log(props.props.Version1)
                if(!is_active) {
                    console.log("return", payload)
                    return <div>{"we have nothing"}</div>
                }
                return <div>{"keep going with execution"}</div>
                
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