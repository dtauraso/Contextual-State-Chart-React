import React from "react"

// 'added'
// 'deleted'
// 'unset'
const makeNode = (value) => {

    return {data: value, flag: 'new' }
}
const deleteNode = (value) => {
    return {...value, flag: 'deleted'}
}
const unsetNode = (value) => {
    return {...value, flag: 'unset'}
}
// there is a difference between putting data in my format and marking the users level of changes
const convertToRecordingForm = (object) => {

    // console.log('convertToRecordingForm', object, typeof(object))
    
    if(typeof(object) === 'string') {
        let newArray = []
        for(let i = 0; i < object.length; i++) {
            // O(n^2) but no mutation
            newArray = [    ...newArray,
                            makeNode(object[i])]
        }        
        return newArray
    }
    if(Array.isArray(object)) {
        let newArray = []
        for(let i = 0; i < object.length; i++) {
            // O(n^2) but no mutation
            newArray = [    ...newArray,
                            makeNode(object[i])]
        }        
        return newArray

    }
    if(typeof(object) === 'object') {
        // key -> value
        let keys = Object.keys(object)
        // merge {...stuff} with keys.map while making sure the iteration doesn't become n^2
        // as things would be duplicated
        let newObject = {}
        for(var i in keys) {
            let ithKey = keys[i]
            newObject = {   ...newObject,
                            [ithKey]: makeNode(object[ithKey])}
        }
        // console.log(newObject)
        return newObject
    }
}

const pushBack = (packageArray) => {

    let [array, value] = packageArray
    // console.log('keys', Object.keys(array))
    return [...array, makeNode(value)]
}
const popBack = (array) => {

    return array.map((item, i) => (i === array.length - 1) ? deleteNode(item) : item)
}
const insertObject = (object) => {
    // recursively recreate the object and set all it's values's flag to 'added'
}
const insertItem = (array, i, value) => {

    // assumes the array has been converted to the recording form
    // the value is the data the user is interested in(not one with a recording flag)
    // friends = [
    //     ...friends.slice(0, friendIndex),
    //     friend,
    //     ...friends.slice(friendIndex + 1)
    //   ];
    return [
            ...array.slice(0, i),
            makeNode(value),
            ...array.slice(i + 1)
        ]

}
const deleteItem = (array, i) => {


}

const edit = (array, i, value) => {
    // insert value at i, delete pushed old value at i + 1
    array = insertItem(array, i, value)
    // item to delete is now at i + 1
    return array.map((item, index) => (index === (i + 1) ? deleteNode(item) : item))

}
const search = (array, value) => {
    let i = 0

    array.forEach((item, index) => {
        if(item.data === value){
            i = index
            return i
        }
    })
}

const collectFlagedItems = (parentState) => {

    // dft
    // return the top level items that have a node recorded
    // return a tree of the var names and objects holding the recorded nodes

}
const collectFlaggedElements = (array) => {

    return array.filter(item => item.flag !== 'unset')
}

const cleanUp = (stateChartTree) => {

    // delete all items flaged for removal and unset the flags of remaining items
    // dft
    // if node is recorded
        // if node is 'deleted'
            // delete it
        // else
            // set the flag to 'unset'
}

const cleanFlaggedElements = (array) => {

    return array
                .filter(item => item.flag !== 'deleted')
                .map(item => (item.flag !== 'unset' ? unsetNode(item) : item))
}
const findState = (tree, path) => {

    
    if(tree === undefined) {
        return null
    }
    if(path.length === 0) {
        return tree
    }
    let firstNode = path[0]

    return findState(tree[firstNode], path.filter((node, i) => i > 0))

}

const pushBackItem = (container, value) => {
    // the value contains the array and the item to push back
    return pushBack(value)
}
const popBackItem = (container, value) => {
    return popBack(value)
}

const cleanArray = (container, value) => {

    return cleanFlaggedElements(value)
}
const convertToRecord = (conainer, value) => {
    console.log('convertToRecord', conainer, value)
    return convertToRecordingForm(value)
}
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

const makePath = (currentState, variableNameList) => {
    // variable name is not a list anymore
    return ['stateTrie', ...currentState, 'variables', ...variableNameList]
}

const storeIntoDownStreamStart = (state, variableName) => {
    // new idea:
    // have the hopper collect all data from state to be transfered to the destination state
    // this way the entire hopper operation is automated
    // be more specific about waht vars to transfer later
    let fullVariablePath = ['stateTrie', ...state, 'variables', variableName, 'variable']
    // console.log("fullVariablePath", fullVariablePath)
    let variable = findState(tree, fullVariablePath)
    console.log('value to transfer', variable)
    //getChildVariable(tree['stateTrie'], currentState, variableName)
    if(variable === null) {
        return false
    }

    tree = deepAssign(  tree,
                        ['stateTrie', ...state, 'downstream', 'start'],
                        {[variableName]: variable},
                        append)

}

const storeIntoDownStreamEnd = (state, variableName) => {


    // currently only works for 1 variable name
    let fullVariablePaths = findState(tree, ['stateTrie', ...state, 'downstream', 'end'])
    console.log(state, 'our new variables', fullVariablePaths)
    // maps each name from the source to the destination
    fullVariablePaths.forEach(variable => {
        // console.log(getVariableValuePath(state, variableName))

        const key = Object.keys(variable)[0]
        // console.log(tree)
        // variable is not yet set so can't allow the tree to ever be null(can't drill down too far)
        tree = deepAssign(  tree,
                            ['stateTrie', ...state, 'variables', variableName, 'variable'],  // path
                            variable[key], // data to set
                            setToValue)
    })
    console.log(tree)
    // debugger
    // console.log(getVariableValuePath(state, variableName))
    // only want from 0 to the nth item the hooper is passing down
    // nth state variable name -> nth hooper value
    // map by name rather than by position
    // console.log(Object.keys(findState(tree, ["stateTrie", ...state, 'variables'])).filter((name, i) => i < fullVariablePaths.length))
    // let variableMapList = [makePath(state, variableName)]
    // console.log("variables to map", variableMapList)
    // instead of mapping by position, map by name(the source name must be the same as the destination name)
    // violates the rule that no variables with a common name can both be inside a state(only if the 2 parent variable names
    // share a prefix)
    // that rule is in place so the user can type the first name of the variable and have it be the only one findable in the parent scope
    // even if it has many more name parts
    // test the first word of each variable name and if they are the same then don't finish and quit function with a message
    // assume for now each variable name is 1 string long
    // let hopperVariableToStateVariable = fullVariablePaths.map((fullVariablePath, i) => {
    //     return [fullVariablePath, variableMapList[i]]
    // })
    // console.log(hopperVariableToStateVariable)
    // the hopper variable is a path name
    // the state variable is a path name
    // path names look like this: [string, string, ...]
    // hopperVariableToStateVariable.forEach(pair => {

    //     let [hopperVariable, stateVariable] = pair
    //     // console.log(hopperVariable, stateVariable)
    //     let variable = findState(tree, hopperVariable)
    //     // console.log(variable['variable'], [...stateVariable, 'variable'])
    //     tree = deepAssign(  tree,
    //                         [...stateVariable, 'variable'],  // path
    //                         variable['variable'], // data to set
    //                         setToValue)

    // })
    tree = deepAssign(  tree,
                        ['stateTrie', ...state, 'downstream', 'end'],
                        [],
                        setToValue
                        )

}
// can the tracking system be done without the user writing any tracking code?
// yes if the tracking code is made before or after the state function code gets run
const startState = (parent, currentState) => {
    // parent is currently root which is a non-existtant dummy state
    // load up the downstream
    // ['stateTrie']
    console.log("start state", currentState)
    storeIntoDownStreamStart(currentState, 'input')

    console.log("my tree", tree)

    return true
}


const splitState = (parent, currentState) => {
    console.log('in split', parent, currentState)
    console.log("my tree", tree)
    storeIntoDownStreamEnd(currentState, 'input')
    console.log(tree)
    return true


}
const getVariableValuePath = (parent, variableName) => {
    return ["stateTrie", ...parent, 'variables', variableName, 'variable', 'value']
}
const getVariableValueFromParent = (parent, variableName) => {

    return findState(tree, getVariableValuePath(parent, variableName))
}

const userAppend = (tree, parentState, variableName, value) => {

    // console.log(parentState, variableName, value)
    const variableValuePath = getVariableValuePath(parentState, variableName)
    // console.log(variableValuePath)
    tree = deepAssign(  tree,
                        variableValuePath,  // path
                        [findState(tree, variableValuePath), value], // data to set
                        pushBackItem)
    return tree
}
const userPopBack = (tree, parentState, variableName) => {

    const variableValuePath = getVariableValuePath(parentState, variableName)

    tree = deepAssign(  tree,
                        variableValuePath,  // path
                        findState(tree, variableValuePath), // data to set
                        popBackItem)
    return tree
}

const userConvertToRecord = (tree, parent, variableName) => {
    const variableValuePath = getVariableValuePath(parent, variableName)
    tree = deepAssign(  tree,
                        variableValuePath,  // path
                        findState(tree, variableValuePath), // data to set
                        convertToRecord)
    return tree
}
const cleanRecords = (tree, parent, variableName) => {
    const variableValuePath = getVariableValuePath(parent, variableName)

    tree = deepAssign(  tree,
        variableValuePath,  // path
        findState(tree, variableValuePath), // data to set
        cleanArray)
    return tree

}
// only mark at the level the user sets or mark all levels?
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
    console.log("collectChar")
    console.log(parent)
    // let variableName = 'input'
    let variable = getVariableValueFromParent(parent, 'input')
    console.log(variable)
    console.log(getVariableValueFromParent(parent, 'tokens'))
    let x = convertToRecordingForm([2, 3, 4])
    console.log(x)

    let y = convertToRecordingForm('12345')
    console.log(y)

    let z = convertToRecordingForm(
        [{group: 'no', object: {token: '12', category: 'number'}}]
    )
    console.log(z)
    tree = userConvertToRecord(tree, parent, 'collectedString')
    // let variableValuePath = getVariableValuePath(parent, 'collectedString')
    // ["stateTrie", ...parent, 'variables', 'collectedString', 'variable', 'value']
    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     findState(tree, variableValuePath), // data to set
    //                     convertToRecord)
    console.log('converted', getVariableValueFromParent(parent, 'collectedString'))

    // convert tree variable
    // append
    tree = userAppend(tree, parent, 'collectedString', '1')

    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     [findState(tree, variableValuePath), '1'], // data to set
    //                     pushBackItem)
    console.log('append', getVariableValueFromParent(parent, 'collectedString'))

    tree = userAppend(tree, parent, 'collectedString', '+')

    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     [findState(tree, variableValuePath), '+'], // data to set
    //                     pushBackItem)
    console.log('append', getVariableValueFromParent(parent, 'collectedString'))

    // popBack
    tree = userPopBack(tree, parent, 'collectedString')
    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     findState(tree, variableValuePath), // data to set
    //                     popBackItem)
    console.log('popBack', getVariableValueFromParent(parent, 'collectedString'))

    // collect records
    let records = collectFlaggedElements(getVariableValueFromParent(parent, 'collectedString'))
    console.log(records)
    // clean out
    tree = cleanRecords(tree, parent, 'collectedString')

    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     findState(tree, variableValuePath), // data to set
    //                     cleanArray)
    console.log('cleaned', getVariableValueFromParent(parent, 'collectedString'))
    console.log(tree)


    tree = userConvertToRecord(tree, parent, 'tokens')


    tree = userAppend(tree, parent, 'tokens', '12')
    tree = userAppend(tree, parent, 'tokens', '+')
    tree = userAppend(tree, parent, 'tokens', '20')

    tree = userPopBack(tree, parent, 'tokens')

    console.log('tokens result', getVariableValueFromParent(parent, 'tokens'))
    let tokensRecords = collectFlaggedElements(getVariableValueFromParent(parent, 'tokens'))
    console.log('new stuff from tokens', tokensRecords)

    tree = cleanRecords(tree, parent, 'tokens')
    console.log(tree)


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
                    'children'  : [['xyz']],
                    'parents'   : [['root', '0']],
                    // var names only have to be unique within the scope of a unique state
                    'variables' : {
                        'input' : {
                            'variable'  : {'type': 'string', 'value': '1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12'},
                            'parents'   : [['start', '0']]
                        },
                        'extra' : {
                            'variable'  : {'type': 'string', 'value': 'abc'},
                            'parents'   : [['start', '0']]
    
                        },
                    },
                    'downstream' : {
                        'start' : []
                    },
                },
                
                
                
            },
                // this state is only here to prove the downstream goes south from a to b
                'xyz' : {
                    'function' : returnTrue,
                    'children'  : [['split', '0']]
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
                            // make full representation when building the trie
                            // split/0/tokens/0...n =>  [[group: no, object: {token: '12', category: 'number'}]]

                            'tokens' : {
                                'variable' : {'type': 'list', 'value': []},
                                'parents'   : [['split', '0']]
                            }
                        },
                        'downstream' : {
                            'end' : []
                        },
                    },
                    
                    
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
var stateCount = 0
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
    isDownStream = (state) => {
        let y = findState(tree['stateTrie'], state)

        let keys = Object.keys(y)
        return keys.includes("downstream")
    }
    isDownStreamEnd = (state) => {
        if(this.isDownStream(state)) {
            return getDownStreamEnd(tree['stateTrie'], state) !== null
        }
    }
    isDownStreamStart = (state) => {
        if(this.isDownStream(state)) {
            return getDownStreamStart(tree['stateTrie'], state) !== null
        }

    }


    visit = (parent, nextStates, recursiveId, stateCount, downStream, upStream) => {
        // runs each runable state in the contextual state chart
        // time complexity
        // n * n
        // n nodes
        // each node runs a recording system that copies entire tree(n nodes)

        // 2 important things to be done when the user runs code in a state
        // they have to transport data from 1 level to another
        // they have to track all changes for debugging
        // this all has to fit into the unique state model(each state, each variable has a unique name so any level of 
        // context can be expressed throughout the state chart)
        // the user also must be able to type in the variable name of their orginal choosing to access it
        // while the variable is also unique(hard to solve dilemna)
        // this must be a simple to use state machine(the user must feel like it's just regular programming)
        // if the user feels like it's cumbersome then the solution has failed
        // ['start', '0'] will be the parent 2 times in a row
        console.log("visit", recursiveId, parent, nextStates)
        // console.log(Object.keys(tree['stateTrie']))
        // if(recursiveId === 4) {
        //     console.log('done with recursion')
        //     console.log()
        //     return
        // }
        if(stateCount === 3) {
            console.log('done with states')
            console.log()
            return
        }
        // try all the states
        // replace with a forEach
        let resultOfFunction = false
        let ranTrueFunction = false
        nextStates.forEach(state => {

            if(!ranTrueFunction) {


                // don't want to run the 2nd true function
                if(!resultOfFunction) {

                    // can only do this to deposit data
                    if(this.isDownStreamEnd(state)) {
                        // console.log("at downstream end for", state, downStream)
                        tree = deepAssign(  tree,
                                            ['stateTrie', ...state, 'downstream', 'end'],
                                            downStream,
                                            setToValue)

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
                        ranTrueFunction = true
                        stateCount += 1
                        // collect records of changes made in the parent's variables
                        // reset records of changes made in the parent's variables
                        // is the current state a parent?
                        if(this.isParent(currentState)) {
                            // console.log("after function", tree)
                            // console.log("stat ran", state)
                            // stringify state
                            // use the string as a key maping to the hopper value(so hopper can be used
                            // with many different transporting states at once)
                            // hopper value is expressed as a node with modification flags
                            // the flags show what was changed for the diffing algorithm to record after each state is run
                            // this way the user can directly change the machine variables(no local varaibles will be tracked)
                            // and have their changes get logged automatcally 
                            // have the transport system transport the variable and value because
                            // the machine's variables will be cleared before the machine travels up the hierarchy
                            // that means the last state has to put the variable data into the hopper to transport it up()
                            // let downStreamStateStart = getDownStreamStart(tree['stateTrie'], state) //makeDownStreamContext(currentState)
                            // console.log("data from downstream start hopper", downStreamStateStart)

                            // console.log("has children", currentState['children'])
                            // can only do this to pickup data
                            if(this.isDownStreamStart(state)) {
                                // dowStreamStart
                                // downStreamStateStart will not always be there
                                // console.log("collect", downStreamStateStart)
                                // what if I'm using multiple downstreams at once?
                                // state -> downStream data
                                // swap the state using the child state so the downStream data
                                // is still recognized as it goes down the hierarchy
                                // constantly going to replace downStream with whatever is in the current downstream
                                downStream = getDownStreamStart(tree['stateTrie'], state)
                                tree = deepAssign(  tree,
                                                    ['stateTrie', ...state, 'downstream', 'start'],
                                                    [],
                                                    setToValue)
                
                            }
                            // get downstream data from parent and pass it down
                            this.visit(state, currentState['children'], recursiveId + 1, stateCount, downStream, upStream)
                            // console.log('recursion unwinding')
                            // console.log([...currentState['children']])
                        } else {
                            // console.log("no children")
                            nextStates = currentState['next']
                            // console.log(nextStates, 'to try')
                        }
                        // break

                    }
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