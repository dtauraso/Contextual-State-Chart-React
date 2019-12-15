import React from "react"



const findState = (tree, path) => {
    // let i = 0

    if(tree === undefined) {
        return null
    }
    if(path.length === 0) {
        return tree
    }
    let firstNode = path[0]

    return findState(tree[firstNode], path.filter((node, i) => i > 0))

}
/*
{
    ...state:
    string : f(state[string])
}
*/


const setToValue = (container, value) => {
    return value
}
const append = (container, value) => {

    return [...container, value]
}
const deepAssign = (state, path, value, cb) => {
    // state is an object
    // console.log("deep copy", path)
    // console.log("path", path)
    // console.log("reduced path", path.filter((node, i) => i > 0))
    // console.log(path.length === 0)
    // console.log(state)

    if(path.length === 0) {
        // console.log("replace", state, value)
        return cb(state, value)

    } else if(path.length > 0) {

        const firstNode = path[0]

        if(!state.hasOwnProperty(firstNode)) {

            // copy of original with some object references from the original?
            return {...state}
        }
        else {
            return {
                ...state,
                // [] seems to protect the variable name from being treated as a key
                [firstNode]: deepAssign(    state[firstNode],
                                            path.filter((node, i) => i > 0),
                                            value,
                                            cb)
            }
        }
    }
     
    
}
// this.state = {
    //         ...this.state,
    //         'stateTrie' : {
    //             ...this.state['stateTrie'],
    //             'x' : {
    //                 ...this.state['stateTrie']['x'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['x']['variable'],
    //                     'value' : input[i]
    //                 }
    //             },
    //             'operatorChainLength' : {
    //                 ...this.state['stateTrie']['operatorChainLength'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['operatorChainLength']['variable'],
    //                     'value' : chainLength + 1
    //                 }
    //             },
    //             'i' : {
    //                 ...this.state['stateTrie']['i'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['i']['variable'],
    //                     'value' : i + 1
    //                 }
    //             }
    //         }
    //     }




// I'm aware all states and vars are accessible using tree(It's a convenience for now),
// but the idea is for the child states to only use data from the parent
// This is not only about making a calculator app.
// It's about making a flexible program representation and the calculator app
// is just a test input.
const returnTrue = (tree, parent, currentState) => {
    return true
}
const returnFalse = (tree, parent, currentState) => {
    return false
}


const replaceContext = (path, extra, cutoffPosition) => {

    let oldPath = [...path]
    oldPath = oldPath.filter((node, i) => i < cutoffPosition)
    return [...oldPath, ...extra]
}
const getDownStreamStart = (tree, currentState) => {

    let variableState = [...currentState, 'downstream', 'start']
    // console.log("messed up variable name", currentState, variableState)

    let currentStateTree = findState(tree, variableState)
    let inputVariable = currentStateTree
    if(inputVariable === null) {
        return null
    }
    return inputVariable

}
const getDownStreamEnd = (tree, currentState) => {

    let variableState = [...currentState, 'downstream', 'end']
    // console.log("messed up variable name", currentState, variableState)

    let currentStateTree = findState(tree, variableState)
    let inputVariable = currentStateTree
    if(inputVariable === null) {
        return null
    }
    return inputVariable

}
const getChildVariable = (tree, currentState, variableName) => {
    let variableState = [...currentState, 'variables']
    // console.log("messed up variable name", currentState, variableState)
    let currentStateTree = findState(tree, variableState)
    // console.log(currentStateTree, variableName)
    let inputVariable = findState(currentStateTree, variableName)
    console.log(inputVariable)
    if(inputVariable === null) {
        return null
    }
    return inputVariable['variable']
}
const makePath = (currentState, variableNameList) => {
    return ['stateTrie', ...currentState, 'variables', ...variableNameList]
}
const startState = (parent, currentState) => {
    // parent is currently root which is a non-existtant dummy state
    // load up the downstream
    // ['stateTrie']
    console.log("start state", currentState)
    // use the full path name [curentState, 'variables', 'input']
    let variableName = ['input']
    let fullVariablePath = ['stateTrie', ...currentState, 'variables', ...variableName]
    console.log("fullVariablePath", fullVariablePath)
    let variable = findState(tree, fullVariablePath)
    //getChildVariable(tree['stateTrie'], currentState, variableName)
    if(variable === null) {
        return false
    }
    console.log("current state tree", variable)
    // needs error checking
    let downStreamStateStart = getDownStreamStart(tree['stateTrie'], currentState) //makeDownStreamContext(currentState)
    console.log(downStreamStateStart)
    // console.log(tree)
    // missing the path to the downstream start
    // need the full path starting from 'stateTrie' and replaceContext only appends
    console.log(['stateTrie', ...currentState, 'downstream', 'start'])
    // ["start", "0"] (3) ["stateTrie", "downstream", "start"]
    // console.log("messed up context name", currentState, replaceContext(['stateTrie', ...currentState], ['downstream', 'start'], 2))

    tree = deepAssign(  tree,
                        ['stateTrie', ...currentState, 'downstream', 'start'],
                        fullVariablePath,
                        append)
    console.log("my tree", tree)
    // downStreamStateStart['start'] = result
    // downStreamStateStart = {
    //     ...downStreamStateStart,
    //     'start' : result
    // }
    // console.log(downStreamStateStart)
    // console.log(tree)
    // debugger
    // the data in the tree must be of the same format(can't autogenerate new variables for tree)
    // console.log(findState(tree, downStreamState))
    // // if()
    // console.log(findState(tree, currentState))
    return true
}

const splitState = (parent, currentState) => {
    console.log('in split', parent, currentState)
    console.log("my tree", tree)
    let fullVariablePaths = findState(tree, ['stateTrie', ...currentState, 'downstream', 'end'])
    console.log(fullVariablePaths)
    let variableMapList = [makePath(currentState, ['input'])]
    console.log("variables to map", variableMapList)
    let hopperVariableToStateVariable = fullVariablePaths.map((fullVariablePath, i) => {
        return [fullVariablePath, variableMapList[i]]
    })
    console.log(hopperVariableToStateVariable)

    hopperVariableToStateVariable.forEach(pair => {

        let [hopperVariable, stateVariable] = pair
        console.log(hopperVariable, stateVariable)
        let variable = findState(tree, hopperVariable)
        console.log(variable['variable'], [...stateVariable, 'variable'])
        tree = deepAssign(  tree,
                            [...stateVariable, 'variable'],  // path
                            variable['variable'], // data to set
                            setToValue)

    })
    tree = deepAssign(  tree,
                        ['stateTrie', ...currentState, 'downstream', 'end'],
                        [],
                        setToValue
                        )
    console.log(tree)
    return true
    // let variable = findState(tree, hopperVariableToStateVariable[0][0])
    // console.log(variable)
    // console.log(hopperVariableToStateVariable[0])
    // for each state
        // 

    // the parent states store the downstream end data for their children


}
const getVariableValueFromParent = (parent, variableName) => {

    return findState(tree, ["stateTrie", ...parent, 'variables', variableName, 'variable', 'value'])
}
const collectChar = (parent, currentState) => {
    

    // let i = var_store['i']
    // let input = var_store['input']
    // //console.log(input[i])
    // if (input[i] != ' ')
    // {
    //     var_store['collected_string'] += input[i]
    //     var_store['i'] += 1
    //     return true

    // }
    // return false
    console.log(tree)
    console.log("got here")
    console.log(parent)
    // let variableName = 'input'
    let variable = getVariableValueFromParent(parent, 'input')
    console.log(variable)
    return true
}
var tree = {

    // /* done */'input' : /* passes '1 + 2 + 3 + 4',*//*'1 + 2 + 3 + 4 - 5 + 6 + 7 - 8 - 9 + 10 + 11 + 12',*//*'1+',*//*'1 +2',*/'1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12', // '1 '
    // 10 - 18 - 8 - 42
    //  /* done */'expression' : [],
    // 'collected_string' : '',
    // 'i' : 0,

    // 'operationVars' : {

    //     'a' : 0,

    //     'b' : 0},

    // 'lexVars' : {
    //     'operators' : ['*', '/', '-', '+'],
    //     'j' : 0,
    //     'operations' : {'*': "mult", '/': "divide", '+': "plus", '-': "minus"}},
    // this control graph uses string for states and cases
    'stateTrie' : {

            // any next states having {} means it is a finishing state(but having no edges as true signals an error )
            // {'next': [], 'children':[], 'functions':[]}
            // {'next': {'0': {}}, 'children':{'0': {}}, 'functions':{'0'}}
            // [start, 0], [start, variables]
            // 'function'   : "",
            // 'next'       : [[]],
            // 'children'   : [[]],
            // 'variable'   : ,
            // 'parents'    : [[]]
            // 'varChildren'
            // 'prev'

            // will have to check for key membership before accessing
            // I am  using object trees and linked lists as a more scalable way to solve nonlinear
            // problems than using a solution that would only work for the linear nature of this problem.
            // That way these techniques can be applied to many different kinds of programs much more different
            // than the calculator problem.
            'start' : {
                '0': {
                    'function'  : startState,
                    'children'  : [['split', '0']],
                    'parents'   : [['root', '0']],
                    // var names only have to be unique within the scope of a unique state
                    // make these children again per unique state

                    'variables' : {
                        'input' : {
                            'variable'  : {'type': 'string', 'value': '1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12'},
                            'parents'   : [['start', '0']]
                        },
                        'extra' : {
                            'variable'  : {'type': 'string', 'value': 'abc'},
                            'parents'   : [['start', '0']]
    
                        },
                        // 'varChildren'  : {'input': {'0' : 1}},
                    },
                    'downstream' : {
                        'start' : []
                    },
                    // 'upstream' : {
                    //     'end' : {}
                    // }
                },
                
                
                
            },
                'split' : {
                    '0' : {
                        'function'  : splitState,
                        'next'      : [['validate'], ['invalid']],
                        'children'  : [['char']],
                        'parents'   : [['start', '0']],// "variabls" are nested states from the "class" state
                        'variables' : {
                            'input' : {
                                'variable'  : null,
                                'parents'   : [['split', '0']]
                            },
                            'collectedString' : {
                                'variable' : {'type':'string', 'value': ''},
                                'parents'   : [['split', '0']]

                            },
                            'tokens' : {
                                'variable' : {'type': 'list', 'value': []},
                                'parents'   : [['split', '0']]
                            }
                        },
                        // ['start', 'variables', 'input']
                        // downstream end must not have a state ending in the same name(can't guarantee this)
                        // if the user can set the names in order then user can use the var name they want and assume it will map to the correct state
                        'downstream' : {
                            'end' : []
                        },
                        // 'upstream' : {
                        //     'start' : []
                        // }
                    },
                    
                    
                },
                    'collectedString' : {
                        'variable' : {'type':'string', 'value': ''}
                    },
                    'tokens' : {
                        'variable' : {'type': 'list', 'value': []}
                    },
                    // split
                    'char' : {
                        'function'   : collectChar,
                        'next'       : [['last_to_save'], ['char'], ['save']],
                        'parents'    : [['split']] // actually needs parents because it's the first state checked from split
                    },

                    'save': {
                        'function'   : "save",
                        'next'       : [[' ']]                                
                    },

                    ' ' : {
                        'function'   : "cf.parseChar",
                        'next'       : [[' '], ['init']]
                    },

                    'init': {
                        'function'   : "init",
                        'next'       : [['char']]
                    },

                    'last_to_save' : {
                        'function'   : "lastToSave"
                    },
                

                'validate' : {
                    'function'  : "validate",
                    'next'      : [['evaluateExpression', '0']]
                },
                 
                // represents a state machine so needs to have variables
                'order of operations' : {
                    '0' : {
                        'function'   : "returnTrue",
                        'next'       : [['inputHas1Value'], ['evaluateExpression']],
                        'children'   : [['accumulator', '0']],

                    },
                    'variables' : {
                        // variables in keep only loose their value
                        'keep' : {
                            'varChildren' : {'i' : 1, 'currentOperator': 1, 'operators' : 1, 'currentTermStateName' : {'0' : 1}}

                        }

                    }                        
                },
                    // variable state so don't need to say variales
                    'operators' : {
                        'varChldren' : {'*' : 1, '/' : 1, '+' : 1, '-' : 1}
                    },

                        '*' : {
                            'function' : "mult",
                            'next' : [['/']],
                            'parents' : [['operators']]
                        },
                        '/' : {
                            'function' : "divide",
                            'next' : [['+']],
                            'parents' : [['operators']]

                        },
                        '+' : {
                            'function' : "add",
                            'next' : [['-']],
                            'parents' : [['operators']]

                        },
                        '-' : {
                            'function' : "subtract",
                            'parents' : [['operators']]

                        },

                    'currentTermStateName' : {
                        '0' : {
                            'variable' : {'type': 'list', 'value': ['item', '0']},
                            'parents' : [['accumulator']]

                        }
                        ,
                        '1' : {
                            'variable' : {'type': 'list', 'value': ['item', '0']},
                            'parents' : [['accumulator']]

                        },
                        '2' : {
                            'variable' : {'type': 'list', 'value': ['item', '0']},
                            'parents' : [['accumulator']]

                        }
                    },
                    'accumulator' : {
                        // accumulator
                        '0' : {
                            'children' : [['operation']],
                        
                        },
                        'variables' : {
                            'keep' : {
                                'varChildren' : {'operator': 1, 'acc' : 1, 'currentTermStateName' : {'1' : 1}}

                            }
                        },
                        // the only code I can automate is the data being transfered on the ferry
                        'downstream' : {
                            'start' : []
                        },
                        'upstream' : {
                            'end' : []
                        }
                        
                    },
                        'operator' : {
                            'variable' : {'type': 'string', 'value': ''},
                            'parents' : [['accumulator', '0']]

                        },
                        'acc' : {
                            'variable' : {'type': 'int', 'value': 0},
                            'parents' : [['accumulator', '0']]
                        },


                        // assume each parent may have a 'ferry' context for results going upstream or downstream. 
                        'operation' : {
                            '0' : {
                                'children' : [['a']],

                            },
                            'variables' : {
                                'keep' : {
                                    // 2 kinds of data
                                    // representation data
                                    // temporary data
                                    // assume the things made in the functions will be put into an erase category?
                                    'varChildren' : { 'x' : 1, 'y' : 1, 'z' : 1, 'currentTermStateName' : {'2' : 1}}

                                }

                            },
                            // this context will hold the value of z, because x, y, and z will be erased
                            // when b is done running
                            'upstream' : {
                                'start' : []
                            },
                            'downstream' : {
                                'end' : []
                            }
                        },
                            'x' : {
                                'variable' : {'type': 'int', 'value': 0},
                                'parents' : [['operation']]

                            },
                            'y' : {
                                'variable' : {'type': 'int', 'value': 0},
                                'parents' : [['operation']]

                            },
                            'z' : {
                                'variable' : {'type': 'int', 'value': 0},
                                'parents' : [['operation']]

                            },
                            // a + b
                            // a / b
                            // a op b stuff goes here
                            'a' : {
                                'function'   : "getA"/*  setKindOfNumberToA */,
                                'next'       : [['op'], ['chain is over']],
                                'parents'    : [['evaluateExpression']]

                            },
    
                            'op' : {
                                'function'   : "cf.parseChar",
                                'next'       : [['error'], ['b', 'evaluate']]
                            },

                            'b' : {
                                'evaluate' : {
                                    'function'   : "evaluate",
                                }
                            }, 
                    // a + b + c
                    // acc op= b stuff goes here
                    // deal with jumping across breaks in the accumulator chain
                    // start putting in evaluator with      
                // 
                // order of operations goes here
                // evaluateChain


                'i' : {
                    'variable' : {'type': 'int', 'value': 0}
                },

                'currentOperator' : {
                    'variable' : {'type': 'int', 'value': 0}
                },

                    'expression' : {
                        'variable'   : {'type': 'list', 'value': []},
                        'parents'    : [['evaluateExpression']]

                    },

                         
    
                    'op_ignore' : {
                        'function'   : "cf.parseChar",
                        'next'       : [['error'], ['value_ignore', '0']]
                    },
    
                    'value_ignore' : {
                        '0' : {
                            'function'   : "cf.parseChar",
                            'next'       : [['reset_for_next_round_of_input'], ['op_ignore'], ['value_ignore', 'valid_op']]
                        },
                        'valid_op' : {
                            'function'   : "validOp",
                            'next'       : [['op']]
                        }
                    },

                    'error' : {
                        'function'   : "noMoreInput"
                    },

                    'invalid' : {
                        'function'   : "inputIsInvalid"
                    },

                'reset_for_next_round_of_input' : {
                    'function'   : "resetForNextRound",
                    'next'       : [['end_of_evaluating']]
                },

                'end_of_evaluating' : {
                    'function'   : "returnTrue",

                },
                'input_has_1_value' : {
                    'function'   : "showAndExit",

                }
    }
}
class Data extends React.Component{
    constructor() {
        super();
        this.state = {}
    }

    // for now let all functions access all variables using a path of length 1
    // the point is to fight react as little as possible(don't know if we can access
    // and modify nested state by using recursion and a path of state)
    // the variable's role determines where it is in the graph 
   
    // save = (store, var_store, node) => {
    
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     if (input[i] === ' ')
    //     {
    //         let collected_string = var_store['collected_string']
    //         var_store['expression'].push(collected_string)
    //         return true
    
    //     }
    //     return false
    // }
    // init = (store, var_store, node) => {
    
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     if (input[i] != ' ')
    //     {
    //         var_store['collected_string'] = ''
    //         return true
    //     }
    //     return false
    // }
    
    // lastToSave = (store, var_store, node) => {
    
    //     if (endOfInput(store, var_store, node))
    //     {
    //         let collected_string = var_store['collected_string']
    //         var_store['expression'].push(collected_string)
    //         var_store['input'] = var_store['expression']
    //         var_store['i'] = 0
    //         var_store['expression'] = []
    //         var_store['collected_string'] = ''
    //         return true
    //     }
    //     return false
    // }
    // getA = (parent, currentState) => {
    //     // use setState(), no mutation
    //     // https://stackoverflow.com/questions/18933985/this-setstate-isnt-merging-states-as-i-would-expect
    //     // https://github.com/VoliJS/NestedLink
    //     // test and figure out what works before converting everything
    //     // this.setState({ selected: { name: 'Barfoo' }});

    //     // var newSelected = Object.assign({}, this.state.selected);
    //     // newSelected.name = 'Barfoo';
    //     // this.setState({ selected: newSelected });

    //     // this.setState({ selected: Object.assign({}, this.state.selected, { name: "Barfoo" }) });
    //     // 'evaluateExpression' , '0'
    //     // let a = stateTrie['x']

    //     // all chains start with this function
    //     // this.state = {
    //     //     ...this.state,
    //     //     operation_vars: {chain_length: 0}
    //     // }
    //     // this.setState({operationVars: {chainLength: 0}})
    //     // var_store['operation_vars']['chain_length'] = 0
    
    //     //console.log(var_store['operation_vars']['kind_of_number'])
    //     let i = this.state['stateTrie']['i']
    //     let input = this.state['stateTrie']['input']
    //     let chainLength = this.state['stateTrie']['chainLength']

    //     // a = input[i]

        

    //     // this.state = {
    //     //     ...this.state,
    //     //     operation_vars: {a: input[i]}
    //     // }
    //     // this.setState({operation_vars: {a: input[i]}})
    //     // var_store['operation_vars']['a'] = input[i]

    //     // let chainLength = this.state["operationVars"]["chainLength"]
    //     // this.state = {
    //     //     ...this.state,
    //     //     operation_vars: {chainLength: chainLength + 1}
    //     // }
    //     // this.setState({operation_vars: {chainLength: chainLength + 1}})
    //     // this.state = {
    //     //     ...this.state,
    //     //     i: this.state["i"] + 1
    //     // }

    //     this.state = {
    //         ...this.state,
    //         'stateTrie' : {
    //             ...this.state['stateTrie'],
    //             'x' : {
    //                 ...this.state['stateTrie']['x'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['x']['variable'],
    //                     'value' : input[i]
    //                 }
    //             },
    //             'operatorChainLength' : {
    //                 ...this.state['stateTrie']['operatorChainLength'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['operatorChainLength']['variable'],
    //                     'value' : chainLength + 1
    //                 }
    //             },
    //             'i' : {
    //                 ...this.state['stateTrie']['i'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['i']['variable'],
    //                     'value' : i + 1
    //                 }
    //             }
    //         }
    //     }
    //     // var_store['operation_vars']['chain_length'] += 1
    //     // this.setState({i: this.state["i"] + 1})
    //     // var_store['i'] += 1
    //     //console.log(var_store)
    
    //     return true
    // }
    
    // getB = (parent, currentState) => {
    
    //     //console.log(var_store['operation_vars']['kind_of_number'])
    //     let i = this.state['stateTrie']['i']
    //     let input = this.state['stateTrie']['input']
        
    //     var_store['operation_vars']['b'] = input[i]
    //     var_store['operation_vars']['chain_length'] += 1
    //     var_store['i'] += 1

    //     // update
    //     this.state = {
    //         ...this.state,
    //         'stateTrie' : {
    //             ...this.state['stateTrie'],
    //             'x' : {
    //                 ...this.state['stateTrie']['x'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['x']['variable'],
    //                     'value' : input[i]
    //                 }
    //             },
    //             'operatorChainLength' : {
    //                 ...this.state['stateTrie']['operatorChainLength'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['operatorChainLength']['variable'],
    //                     'value' : chainLength + 1
    //                 }
    //             },
    //             'i' : {
    //                 ...this.state['stateTrie']['i'],
    //                 'variable' : {
    //                     ...this.state['stateTrie']['i']['variable'],
    //                     'value' : i + 1
    //                 }
    //             }
    //         }
    //     }

        
    //     //console.log(var_store)
    
    //     return true
    // }
    
    // isOp = (parent, currentState) => {
    //     // check current operand with jth operand
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     //console.log(input[i])
    //     let j = var_store['lex_vars']['j']
    //     let operators = var_store['lex_vars']['operators']
    //     return input[i] === operators[j]
    
    // }
    
    // evaluate = (store, var_store, node) => {
    
    //     //console.log(var_store)
    
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     var_store['operation_vars']['b'] = input[i]
    
    
    //     let a = Number(var_store['operation_vars']['a'])
    //     let b = Number(var_store['operation_vars']['b'])
    
    //     let j = var_store['lex_vars']['j']
    //     let operators = var_store['lex_vars']['operators']
    //     let operations = var_store['lex_vars']['operations']
    
    //     var_store['operation_vars']['a'] = operations[operators[j]] (a, b)
    //     var_store['operation_vars']['b'] = 0
    //     var_store['i'] += 1
    //     let str_a = String(var_store['operation_vars']['a'])
    
    
    //     let chain_length = var_store['operation_vars']['chain_length']
    
    //     let before_the_chain = var_store['input'].slice(0, i - 2)
    
    //     let before_the_chain_len = before_the_chain.length
    //     let the_chain = str_a
    
    //     let after_the_chain = var_store['input'].slice(i + 1, var_store['input'].length)
    
    //     var_store['input'] = before_the_chain
    
    //     var_store['input'].push(the_chain)
    //     for(var k in after_the_chain)
    //     {
    //         var_store['input'].push(after_the_chain[k])
    //     }
    
    //     var_store['i'] = before_the_chain_len
    
    //     return true
    // }
    
    // ignoreOp = (store, var_store, node) => {
    
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     //console.log(input[i])
    //     let j = var_store['lex_vars']['j']
    //     let operators = var_store['lex_vars']['operators']
    //     //console.log(operators[j])
    //     //console.log((input[i] === operators[j]))
    //     // need to prove input[i] is an operator, but not operators[j]
    //     //console.log(input[i], operators.includes(input[i]))
    //     if (endOfInput(store, var_store, node))
    //     {
    //         return false
    //     }
    //     if (operators.includes(input[i]) && (input[i] != operators[j]))
    //     {
    //         var_store['operation_vars']['a'] = 0
    //         return true
    //     }
    //     return false
    // }
    
    
    
    // endOfInput = (store, var_store, node) => {
    
    //     //console.log(node)
    //     //console.log(var_store)
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     //console.log(i, i >= input.length)
    //     return i >= input.length
    // }
    
    // inputIsInvalid = (store, var_store, node) => {
    //     console.log('your input is invalid')
    //     return true
    // }
    
    // noMoreInput = (store, var_store, node) => {
    
    //     //console.log('at noMoreInput')
    //     return endOfInput(store, var_store, node)
    
    // }
    
    
    // saveDigit = (store, var_store, node) => {
    //     let char = cf.getChar(store, var_store)
    
    //     return (char >= '0' && char <= '9')
    
    
    // }
    
    
    
    
    
    // isWhiteSpace = (store, var_store) => {
    
    //     return cf.getChar(store, var_store) === ' '
    // }
    
    
    
    // mult = (a, b) => {
    
    //     return a * b
    // }
    // divide = (a, b) => {
    
    //     return a / b
    // }
    // plus = (a, b) => {
    //     //console.log(a, b)
    //     return a + b
    // }
    // minus = (a, b) => {
    
    //     return a - b
    // }
    
    
    
    // parsing_checks = {
    
    //     'op' : {'0':isOp},
    //     'value_ignore' : {'0':cf.isDigit},
    //     'op_ignore' : {'0': ignoreOp},
    //     ' ' : {'0':isWhiteSpace},
    
    // }
    
    
    
    
    
    
    // resetForNextRound = (store, var_store, node) => {
    
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     if (i >= input.length)
    //     {
    //         //console.log(node)
    //         var_store['lex_vars']['j'] += 1
    //         var_store['i'] = 0
    //         return true
    //     }
    
    //     return false
    // }
    
    // showAndExit = (store, var_store, node) => {
    
    //     let input = var_store['input']
    //     if(input.length === 1)
    //     {
    //         console.log(input[0])
    //         return true
    //     }
    
    //     return false
    
    // }
    
    
    
    

    // validOp = (store, var_store, node) => {
    
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     if (isOp(store, var_store, node))
    //     {
    //         var_store['operation_vars']['a'] = input[i - 1]
    //         return true
    //     }
    //     return true
    // }
    // validate = (store, var_store, node) => {
    
    //     // expressions list
    //     // len > 3
    //     // alternate # and op
    //     // make sure the alternate starts and ends with #
    //     var i = 1
    //     let input = var_store['input']
    //     //console.log(input)
    
    //     if (input.length >= 3)
    //     {
    //         if (Number(input[0]) === NaN)
    //         {
    
    //             return false
    //         }
    //         while (i < input.length)
    //         {
    //             // 2, 4, 6
    //             if (i % 2 === 1)
    //             {
    
    //                 if (!var_store['lex_vars']['operators'].includes(input[i]))
    //                 {
    //                     return false
    //                 }
    //             }
    //             // 1, 3, 5
    //             else
    //             {
    //                 if (Number(input[i]) === NaN)
    //                 {
    //                     return false
    //                 }
    //             }
    
    //             i += 1
    //         }
    //         if (Number(input[input.length - 1]) === NaN)
    //         {
    //             return false
    //         }
    
    //         return true
    
    
    
    //     }
    //     return false
    
    // }
// make a half-designed version of this for making the full version
// make it without the variable name generator and make the ferry function assume the ferry context wasn't made yet

// assume a state tracker is an array of strings(need a trie because the ferry function
// has to know if user make a ferry context already and for automatic variable generator)
// flags:
    // children are parallel
    // bottom up dump vars(start and end)
    // top down dump vars(start and end)
    // the dump vars are to ferry data from
    // parent/child machine to another child/parent machine automitcally
    // make sure starts and ends don't overlap
    // next state can assume the prev's children have taken the data and sent it to the parent
    // f(next states)

// nfa && dfa style
// 1 loop for each state
    // dump data from parent if endpoint is specified
    // 1 loop to rerun any if the deep part doesn't pass ; backtracking
        // 1 loop to get the winnig state and index

        // get the status of node run
            // if child, put the next states into next states
            // if parent
                
                // if parent.parallel
                    // concurrency
                    // for each parent next state
                        // {status, react-html(history of data), dataToTransfer(ferry vars through hierarchy)} = f([next state])
                        
                        // backtracking
                        // if status is true
                            // the winning state is true
                            // dump data to parent from child if endpoint is specified
                            // break
                    // if all status's are false
                        // the winning state is false

                    // cncurrent paths conclude here
                // status = f(next states)

                // backtracking
                // if status is true
                    // break
                // if status is false
                    // the winning state is false
// auto clean
// delete all objects in the temp context of the parent machine
// get data from the ferry context and transfer it to drop site

// [free object] => parent of the children the ferry context was going to put into without visiting the intermediate nodes
// now we already know what the start and stop points are, so the only thing needed is to say pass to child or pass to parent
// the children receiveing the data can be considered 1 object
// control flow and state can be reused via the hierarchy
// have the object be a free state so anyone in any part of the tree needing to use it can use it
// the control flow tree can be resued by having multiple parents
// can't eliminate the transport data idea, just don't cross the streams
// control flow can take 1 path to the functions using the data
// object model can take another path to the functions using the data
// applications: calculator -> representation -> langugae
// make the language with this
    isParent = (state) => {
        // return state.con
        return Object.keys(state).includes('children')
        // console.log(Object.keys(state).includes('function'))
    }
    isStream = (parent) => {
        console.log('isStream')
        console.log(parent)
        // let x = replaceContext(parent, [], 1)
        // console.log("base state", x)
        let y = findState(tree['stateTrie'], parent)
        console.log("state object", parent, y)
        let keys = Object.keys(y)
        let filteredKeys = keys.filter(key => key === "downstream" || key === "upstream")
        console.log("stream keys", filteredKeys)
        return filteredKeys.length > 0
        // get the parent keys(have to modify the parent)
        // find out if upStream or downStream are members of the key set
    }
    isDownStream = (state) => {
        let y = findState(tree['stateTrie'], state)

        let keys = Object.keys(y)
        return keys.includes("downstream")
    }
    handleStreamData = (state, downStream, upStream) => {
        // let x = replaceContext(state, [], 1)

        let y = findState(tree['stateTrie'], state)

        let keys = Object.keys(y)
        if(keys.includes("downstream")) {
            console.log("we are in downstream")
            let downStreamStateStart = getDownStreamStart(tree['stateTrie'], state) //makeDownStreamContext(currentState)
            let downStreamStateEnd = getDownStreamEnd(tree['stateTrie'], state)
            // need to check for the stream key instead?
            if(downStreamStateStart !== null) {

                console.log("our hoopper start data", downStreamStateStart)
                // adding data
                tree = deepAssign(  tree,
                                    ['stateTrie', ...state, 'downstream', 'start'],
                                    [],
                                    setToValue)
                // make one that takes away data
                return downStreamStateStart
            }
            else if(downStreamStateEnd !== null) {
                console.log("our hoopper end data", downStream , "=>", downStreamStateEnd)
                // let dataFromHopper = [...downStreamStateEnd]
                console.log(downStream)

                /// put data in downstream hopper
                tree = deepAssign(  tree,
                                    ['stateTrie', ...state, 'downstream', 'end'],
                                    downStream,
                                    setToValue)
                console.log(tree)
                // console.log(downStream)

                console.log("done", downStream)
                // erase carrying data
                return
            }
            
        } else {

        }
        // does parent have downstream?
            // end
                // save downStream to parent's downStream end
            // start
                // store downStream from parent's downStream start and erase the parent's downStream start
        // else if uspstream
            // end
                // save upStream to parent's upStream end
            // start
                // store upStream from parent's upStream start and erase the parent's upStream start
    }

    visit = (parent, nextStates, recursiveId, downStream, upStream) => {
        // ['start', '0'] will be the parent 2 times in a row
        console.log("visit", recursiveId, parent, nextStates)
        // console.log(Object.keys(tree['stateTrie']))
        if(recursiveId === 3) {
            console.log('done')
            console.log()
            return
        }
        // try all the states
        // replace with a forEach
        let resultOfFunction = false

        nextStates.forEach(state => {

            // return state

            if(!resultOfFunction) {

                // can only do this to deposit data
                if(this.isStream(state)) {
                    if(this.isDownStream(state)) {
                        console.log("at downstream end for", state, downStream)
                        this.handleStreamData(state, downStream, upStream)

                    }

                }
                let currentState = findState(tree['stateTrie'], state)
                                // save the stream data here
                // the hopper data for this state should be deposited before the state is run(so the state can get it)
                // is this the child we actually need the stream data for?
                // the parent is used to access the data the state will use()
                resultOfFunction = currentState['function'](parent, state)
                // console.log(this.findState(tree['stateTrie'], nextStates[i]))
                // console.log(resultOfFunction)
                if(resultOfFunction) {
                    // is the current state a parent?
                    if(this.isParent(currentState)) {
                        console.log("after function", tree)
                        console.log("stat ran", state)
                        let downStreamStateStart = getDownStreamStart(tree['stateTrie'], state) //makeDownStreamContext(currentState)
                        console.log("data from downstream start hopper", downStreamStateStart)

                        console.log("has children", currentState['children'])
                        // can only do this to pickup data
                        if(this.isStream(state)) {
                            // dowStreamStart
                            // downStreamStateStart will not always be there
                            console.log("collect", downStreamStateStart)
                            // constantly going to replace downStream with whatever is in the current downstream
                            downStream = this.handleStreamData(state, downStream, upStream)
                            console.log(tree)
                            console.log("data to send downstream", downStream)
            
                        } else {
                            console.log("can't collect")
                        }
                        // if parent has this, it's the same parent the state send to stream
                        // we are transport data up or down from A to B only
                        // does parent have any stream?
                            // does parent have downstream?
                                // end
                                    // save downStream to parent's downStream end
                                // start
                                    // store downStream from parent's downStream start and erase the parent's downStream start
                            // else if uspstream
                                // end
                                    // save upStream to parent's upStream end
                                // start
                                    // store upStream from parent's upStream start and erase the parent's upStream start
                        // else if no stream
                            // don't do anything with stream data
                        // get downstream data from parent and pass it down
                        this.visit(state, currentState['children'], recursiveId + 1, downStream, upStream)
                        // console.log('recursion unwinding')
                        // console.log([...currentState['children']])
                    } else {
                        console.log("no children")
                        nextStates = currentState['next']
                        console.log(nextStates, 'to try')
                    }
                    // break

                }
            }
        })

        // console.log(this.traverseTrie(tree['stateTrie'], currentState))
        // console.log(tree['stateTrie'][currentState[0]])
    }
    render() {
        return (
            <div >
                {/* {console.log('happening')} */}
                {/* the parent and the first state to run need to be the same for the first call */}
                <button onClick={() => this.visit(['start', '0'], [['start', '0']], 0, null, null)}>start</button>
            </div>
        )
    }
}
export default Data