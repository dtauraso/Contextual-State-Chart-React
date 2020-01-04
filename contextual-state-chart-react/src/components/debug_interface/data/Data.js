import React from "react"

// 'added'
// 'deleted'
// 'unset'
// make records shallow and deep
// alter records shallow and deep
// collect records shallow and deep
// user interface for adjusting records
// collecting records
// cleaning records
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

const convertToCallBackRecursive = (object, cb) => {

    // console.log(object)
    if(typeof(object) === 'string') {
        let newArray = []
        for(let i = 0; i < object.length; i++) {
            // O(n^2) but no mutation
            newArray = [    ...newArray,
                            cb(object[i])]
        }        
        return newArray
    }
    else if(Array.isArray(object)) {

        let newArray = []
        for(let i = 0; i < object.length; i++) {
            // O(n^2) but no mutation
            newArray = [    ...newArray,
                convertToCallBackRecursive(object[i], cb) ]
        }
        return newArray

    }
    else if(typeof(object) === 'object') {
        // console.log("object", object)
        // key -> value
        let keys = Object.keys(object)

        // n^2
        let newObject = {}
        for(var i in keys) {
            let ithKey = keys[i]
            newObject = {   ...newObject,
                            [ithKey]: convertToCallBackRecursive(object[ithKey], cb)}
        }
        // console.log(newObject)
        return cb(newObject)
    }
}

const updateFlagsRecursive = (object, newFlagValue) => {
        // data, flag
        // object is the tracked object
        // newFlagValue is a string
        // console.log(object)
        if(Array.isArray(object)) {
    
            let newArray = []
            for(let i = 0; i < object.length; i++) {
                // O(n^2) but no mutation
                newArray = [    ...newArray,
                                updateFlagsRecursive(object[i], newFlagValue) ]
            }        
            return newArray
    
        }
        else if(typeof(object) === 'object') {
            // console.log("object", object)
            // key -> value
            let keys = Object.keys(object)
    
            // n^2
            let newObject = {}
            keys.forEach(key => {
                newObject = {   ...newObject,
                                [key]:  key === 'flag' ?
                                            newFlagValue :
                                            updateFlagsRecursive(object[key], newFlagValue)}

            })
            // console.log(newObject)
            return newObject
        }
        else {
            // object should be a single string now
            return object
        }
    
}

// these functions are meant to operate on variable data deep inside the state chart
// the same data for teh type was used as the value
const pushBack = (packageArray) => {
    // console.log('push')
    // console.log(packageArray)
    let [trackedObject, newItem] = packageArray
    // console.log('keys', Object.keys(array))
    // console.log(trackedObject)
    
    return {
        flag: trackedObject['flag'],
        data: {
            type: [...trackedObject['data']['type']],
            value: [...trackedObject['data']['value'], makeNode(newItem)]
        }
    }
    // return [...array, makeNode(value)]
}
const popBack = (array) => {
    // console.log('pop')

    // console.log(array, array['data']['value'].map((item, i) => (i === array['data']['value'].length - 1) ? deleteNode(item) : item))
    return {
        flag: array['flag'],
        data: {
            type: [...array['data']['type']],
            value: [...array['data']['value'].map((item, i) => (i === array['data']['value'].length - 1) ? deleteNode(item) : item)]
        }
    }
    // return array.map((item, i) => (i === array.length - 1) ? deleteNode(item) : item)
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

const collectMostShallowChange = (object) => {

    // the most shallow changes are collected(they bring all the deep changes with them)
    // object is the tracked object
    // need to return an array of tracked objects or a single tracked object
    // console.log(object)

    if(Array.isArray(object)) {

        let newArray = []

        // O(n^2) but no mutation
        object.forEach(element => {
            let newElement = collectMostShallowChange(element)
            if(newElement !== null) {
                newArray = [    ...newArray,
                                newElement
                ]
            }
        })
        return newArray

    }
    else if(typeof(object) === 'object') {
        // console.log("object", object)
        // key -> value

    
        if(object['flag'] === 'deleted' || object['flag'] === 'new') {
            
            return object
        }
        // base case for {flag: "unset", data: "+"}
        else if(object['flag'] === 'unset') {
            if(typeof(object['data']) === 'string') {
                return null
            }
            else {
                // dig into the tree
                let newObject = collectMostShallowChange(object['data'])
                // console.log('object from data', newObject, newObject.length)
                return newObject
            }
        }
        else {
            // data inside the object the 'data' key points to
            let newObject = {}
            let keys = Object.keys(object)
            // special case
            // assume there are object that only have the keys of type and value
            // and for those cases we only want the changed value not ('value' -> changed value)
            keys.forEach(key => {
                let newItem = collectMostShallowChange(object[key])

                // edge cases of the base cases being returned
                if(newItem !== null) {
                    if(Array.isArray(newItem)) {
                        if(newItem.length > 0) {
                            // console.log('array', newItem)

                            if(key === 'value') {
                                newObject = newItem
                            }
                            else {
                                newObject = {   ...newObject,
                                                [key]: newItem}
                            }
                        }
                    }
                    else if(typeof(newItem) === 'object') {
                        if(Object.keys(newItem).length > 0) {
                            // console.log('object', newItem)

                            // need to know what type the value is to only return the value and not the key 'value' value pair
                            if(key === 'value') {
                                newObject = newItem
                            }
                            else {
                                newObject = {   ...newObject,
                                                [key]: newItem}
                            }
                        }
                    }
                }
            })
            return newObject
        }
    }
    else {
        // object should be a single string now
        return object
    }
}


const collectFlaggedElements = (array) => {

    return array.filter(item => item.flag !== 'unset')
}


const cleanFlaggedElements = (array) => {

    return array
                .filter(item => item.flag !== 'deleted')
                .map(item => (item.flag !== 'unset' ? unsetNode(item) : item))
}
const cleanRecordsMostShallow = (object) => {
    
    // delete the most shallow objects
    // change 'new' flags to 'unset' on the most shallow items

    // object is the tracked object
    // need to return an array of tracked objects or a single tracked object
    // console.log(object)
    if(Array.isArray(object)) {

        let newArray = []
        // O(n^2) but no mutation

        object.forEach(element => {
            let newItem = cleanRecordsMostShallow(element)
            if(newItem !== null) {
                newArray = [    ...newArray,
                                newItem
                    ]
            }
        })
        return newArray
    }
    else if(typeof(object) === 'object') {
        // console.log("object", object)
        // key -> value

        // what happens when we are in the keys of the data part of record?
        if(object['flag'] === 'deleted') {
            return null
        }
        // all the data was nuked
        else if(object['flag'] === 'new') {
            // reset this one to unset and call the remaining items
            let newObject1 = cleanRecordsMostShallow(object['data'])
            // not sure if this works
            return unsetNode(
                {
                    'flag' : object['flag'],
                    'data' : newObject1
                }
            )
        }
        else if(object['flag'] === 'unset') {
            let newObject = cleanRecordsMostShallow(object['data'])
            // not sure if this works
            return {
                'flag' : object['flag'],
                'data' : newObject
            }
        }
        else {
            let keys = Object.keys(object)
    
            // n^2
            let newObject = {}
            keys.forEach(key => {
                let newItem = cleanRecordsMostShallow(object[key])
                if(newItem !== null) {
                    newObject = {   ...newObject,
                                    [key]: newItem}
                }

            })
            // console.log(newObject)
            return newObject
        }
    }
    else {
        // object should be a single string now
        return object
    }
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

//////
// deepAssign rerouting functions from user functions

const unsetFlags = (container, value) => {

    return updateFlagsRecursive(value, 'unset')
}
const deletedFlags = (container, value) => {

    return updateFlagsRecursive(value, 'deleted')
}

const newFlags = (container, value) => {

    return updateFlagsRecursive(value, 'new')
}

const deletedFlag = (container, value) => {

    return deleteNode(value)
}

const cleanFlaggedRecordsMostShallow = (container, value) => {
    return cleanRecordsMostShallow(value)
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
    // console.log('convertToRecord', conainer, value)
    return convertToRecordingForm(value)
}

////////
/// deepAssign routing functions

const setToValue = (container, value) => {
    return value
}
const append = (container, value) => {

    return [...container, value]
}
////////
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

// for converting only the value in {type: string, value: '543242} to record from
const getVariableValuePath = (parent, variableName) => {
    // console.log(['stateTrie', ...parent, 'variables', variableName, 'variable', 'value'])
    return ['stateTrie', ...parent, 'variables', variableName, 'variable', 'value']
}

// for converting the entire object {type: string, value: '543242} to record from
const getVariableValuePath2 = (parent, variableName) => {
    return ['stateTrie', ...parent, 'variables', variableName, 'variable']
}

const getVariableValueFromParent = (parent, variableName) => {

    return findState(tree, getVariableValuePath(parent, variableName))
}

const getVariableValueFromParent2 = (parent, variableName) => {

    return findState(tree, getVariableValuePath2(parent, variableName))
}
/////
// user functions for shallow operations
const userAppend = (tree, parentState, variableName, value) => {

    // console.log(parentState, variableName, value)
    const variableValuePath = getVariableValuePath2(parentState, variableName)
    // console.log(variableValuePath)
    tree = deepAssign(  tree,
                        variableValuePath,  // path
                        [findState(tree, variableValuePath), value], // data to set
                        pushBackItem)
    return tree
}
const userPopBack = (tree, parentState, variableName) => {

    const variableValuePath = getVariableValuePath2(parentState, variableName)

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
const addDatasToPath = (path) => {
    // path is a list of strings
    let newPath = []
    path.forEach(item => {
        newPath = [...newPath, 'data', item]
    })
    return newPath
}
const userDeepDeleteKeyValue = (tree, parent, variableName, pathToKey) => {
    //have to put data between each item in pathToKey
    const fullPath = [...getVariableValuePath2(parent, variableName), ...addDatasToPath(pathToKey)]
    // console.log(fullPath)
    // console.log('data found', findState(tree, fullPath))
    tree = deepAssign(  tree,
                        fullPath,  // path
                        findState(tree, fullPath), // data to set
                        deletedFlag) // only delete the level the user specifies
    return tree
}
/////

const cleanRecords = (tree, parent, variableName) => {
    const variableValuePath = getVariableValuePath(parent, variableName)

    tree = deepAssign(  tree,
        variableValuePath,  // path
        findState(tree, variableValuePath), // data to set
        cleanArray)
    return tree

}
const cleanRecordsDeep = (tree, parent, variableName) => {

    // erase all objects having a flag of deleted
    // change all 'new' flags to unset
    let path = getVariableValuePath2(parent, variableName)

    tree = deepAssign(  tree,
                        path,  // path
                        findState(tree, path), // data to set
                        cleanFlaggedRecordsMostShallow)
    return tree
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



// const makePath = (currentState, variableNameList) => {
//     // variable name is not a list anymore
//     return ['stateTrie', ...currentState, 'variables', ...variableNameList]
// }

// can the tracking system be done without the user writing any tracking code?
// yes if the tracking code is made before or after the state function code gets run
const startState = (parent, currentState) => {
    // parent is currently root which is a non-existtant dummy state
    // load up the downstream
    // ['stateTrie']
    // console.log("start state", currentState)
    // storeIntoDownStreamStart(currentState, 'input')

    // console.log("my tree", tree)

    return true
}


const splitState = (parent, currentState) => {
    // console.log('in split', parent, currentState)
    // console.log("my tree", tree)
    // storeIntoDownStreamEnd(currentState, 'input')
    // console.log(tree)
    return true


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
    // console.log("collectChar")
    // console.log(tree)

    // console.log(parent)
    // let variableName = 'input'
    // console.log(getVariableValuePath2(parent, 'input'))
    // console.log(findState(tree, getVariableValuePath2(parent, 'input')))
    let variable = getVariableValueFromParent2(parent, 'input')
    // console.log('input', variable)
    // console.log(getVariableValueFromParent(parent, 'tokens'))
    let x = convertToRecordingForm([2, 3, 4])
    // console.log(x)

    let y = convertToRecordingForm('12345')
    // console.log(y)

    let z = convertToRecordingForm(
        [{group: 'no', object: {token: '12', category: 'number'}}]
    )
    // console.log(z)
    // the original record for array assumed the array was not already turned into a dict, hence the need for varaible
    // now that variable is gone, we are not at an array anymore
    // converted an empty string to an empty array in the value attribute
    // tree = userConvertToRecord(tree, parent, 'collectedString')
    // let variableValuePath = getVariableValuePath(parent, 'collectedString')
    // ["stateTrie", ...parent, 'variables', 'collectedString', 'variable', 'value']
    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     findState(tree, variableValuePath), // data to set
    //                     convertToRecord)
    // console.log('converted', getVariableValueFromParent2(parent, 'collectedString'))

    // convert tree variable
    // append
    tree = userAppend(tree, parent, 'collectedString', '1')

    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     [findState(tree, variableValuePath), '1'], // data to set
    //                     pushBackItem)
    // console.log('append', getVariableValueFromParent(parent, 'collectedString'))

    tree = userAppend(tree, parent, 'collectedString', '+')

    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     [findState(tree, variableValuePath), '+'], // data to set
    //                     pushBackItem)
    // console.log('append', getVariableValueFromParent(parent, 'collectedString'))

    // popBack
    tree = userPopBack(tree, parent, 'collectedString')
    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     findState(tree, variableValuePath), // data to set
    //                     popBackItem)
    // console.log('popBack', getVariableValueFromParent(parent, 'collectedString'))

    // collect records
    // let records = collectFlaggedElements(getVariableValueFromParent(parent, 'collectedString'))
    // console.log(records)
    // clean out
    // tree = cleanRecords(tree, parent, 'collectedString')

    // tree = deepAssign(  tree,
    //                     variableValuePath,  // path
    //                     findState(tree, variableValuePath), // data to set
    //                     cleanArray)
    // console.log('cleaned', getVariableValueFromParent(parent, 'collectedString'))
    // console.log(tree)


    tree = userConvertToRecord(tree, parent, 'tokens')


    tree = userAppend(tree, parent, 'tokens', '12')
    tree = userAppend(tree, parent, 'tokens', '+')
    tree = userAppend(tree, parent, 'tokens', '20')

    tree = userPopBack(tree, parent, 'tokens')

    // console.log('tokens result', getVariableValueFromParent(parent, 'tokens'))
    // let tokensRecords = collectMostShallowChange(getVariableValueFromParent(parent, 'tokens'))
    // console.log('chages from tokens', tokensRecords)

    // tree = cleanRecordsDeep(tree, parent, 'tokens')
    // console.log(tree)

    // console.log('testing recursive convert to recording form')
    // const newStuff = getVariableValueFromParent2(parent, 'input')
    // console.log('here is recording form', newStuff)
    // let result = convertToCallBackRecursive({'type': 'string', 'value': '1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12', 'test' : {'key': 'nested value'}}, makeNode)
    // console.log(result)
    // console.log('testData stuff', getVariableValueFromParent2(parent, 'testData'))
    tree = userDeepDeleteKeyValue(tree, parent, 'testData', ['test'])
    // tree = cleanRecordsDeep(tree, parent, 'testData')
    // let path = getVariableValuePath2(parent, 'testData')
    // tree = deepAssign(     tree,
    //                         path,  // path
    //                         findState(tree, path), // data to set
    //                         unsetFlags)
    // console.log("done with collectChar", tree)
    // const resultChangedFlag = updateFlagsRecursive(newStuff, 'unset')
    // console.log(resultChangedFlag)
    // console.log('done')
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
                            'variable'  : convertToCallBackRecursive({'type': 'string', 'value': '1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12'}, makeNode),
                            'parents'   : [['start', '0']]
                        },
                        'testData' : {
                            'variable'  : convertToCallBackRecursive({'type': 'string', 'value': '1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12', 'test' : {'key': 'nested value'}}, makeNode),
                            'parents'   : [['start', '0']]
                        }                    
                    },
                    'downstream' : {
                        'start' : { 'input': ['split', '0'],
                                    'testData': ['split', '0']}
                    }

                    // source: user: [[varName, VarNamevarName]]   machne: {varName: data, destination: state}
                    // destination: 1 to 1

                    // hopper table: split, 0, variables, input -> [start, 0, variables, input]
                    // ordered pairs of 1 source and many possible distinations(must all be unique)
                    // start has 
                    //[{source, {destination: {varNameSource: varNameDestination}}}]


                    // {destinationString, {source: {varName: data}}}

                    // end has
                    //[{destination, {source: {varName: data}}}]

                    // A, not B(how long does A wait?kill all at end of last machine and note the ones that never got to B)
                    // not A, B(Nothing came to B)
                    // not A, not B(Do we check for travel lines that don't exist by accident?)
                    // A, B(data was detected by B)
                    // if data makes it
                        // there is a destination key to find at the destination state
                    // else
                        // there is no destination key
                        // print out there is a problem from the source to the destination and the data never came(no data came)
                    // else if the user tries to access a variable that was supposed to be set by the transport system(how to know this?)
                        // print out there is a problem from the source to the destination and the data never came(the specifically accessible data
                        // never came)
                   
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
                            'testData' : {
                                'variable'  : null,
                                'parents'   : [['split', '0']]
                            },
                            'collectedString' : {
                                'variable' : convertToCallBackRecursive({'type':'string', 'value': ''}, makeNode),
                                'parents'   : [['split', '0']]

                            },
                            // make full representation when building the trie
                            // split/0/tokens/0...n =>  [[group: no, object: {token: '12', category: 'number'}]]

                            'tokens' : {
                                'variable' : convertToCallBackRecursive({'type': 'list', 'value': []}, makeNode),
                                'parents'   : [['split', '0']]
                            }
                        },
                        'downstream' : {
                            'end' : {   'input': ['start', '0'],
                                        'testData': ['start', '0']
                        }
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

var stateChangesAllLevels = []

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
    /// stream functions
    isDownStream = (state) => {
        let y = findState(tree['stateTrie'], state)

        let keys = Object.keys(y)
        // console.log(y)
        return keys.includes("downstream")
    }
    isDownStreamEnd = (state) => {
        if(this.isDownStream(state)) {
            return this.getDownStreamEnd(tree['stateTrie'], state) !== null
        }
    }
    isDownStreamStart = (state) => {
        if(this.isDownStream(state)) {
            return this.getDownStreamStart(tree['stateTrie'], state) !== null
        }

    }
    getDownStreamStart = (tree, currentState) => {
    
        return findState(tree, [...currentState, 'downstream', 'start'])
    
    }
    getDownStreamEnd = (tree, currentState) => {
    
        return findState(tree, [...currentState, 'downstream', 'end'])
    
    }

    // how they are used
    // storeIntoDownStreamStart(currentState, 'input')

    // storeIntoDownStreamEnd(currentState, 'input')

    stringifyState = (state) => {
        return state.join('~')
    }
    getDownStreamStartVariables = (tree, state, downstream) => {

        // the data from downstream the user setup is in the form {variableName: destinationState}
        // we want to return data in the form {varName: varData}
        // console.log('here')
        // console.log(state)
        const fullOutgoingVariablePaths = ['stateTrie', ...state, 'downstream', 'start']
        const variables = findState(tree, fullOutgoingVariablePaths)
        // console.log(variables)
        const variableNames = Object.keys(variables)
        variableNames.forEach(variableName => {

            // console.log(variableName, variables[variableName])
            const fullVariablePath = ['stateTrie', ...state, 'variables', variableName, 'variable']
            const variableData = findState(tree, fullVariablePath)

            // The user can't use ~ to make state names or this will not work
            const stringifiedStateName = this.stringifyState(variables[variableName])

            // console.log(variableName, variableData, stringifiedStateName)
            // inefficient but works

            downstream = {  ...downstream,
                            [stringifiedStateName]: downstream !== null ? 
                                                            {   ...downstream[stringifiedStateName], [variableName]: variableData} :
                                                            {[variableName]: variableData}
                            
                                                    
                        }
            // console.log('downstream', downstream)
        })
        
        return downstream
    }

    // this.setDownStreamEndVariables(tree, state, downStream)
    storeIntoDownStreamEndVariables = (tree, state, downStream) => {

        // state is the destination state
        // we want to read data from the downStream[stringifiedStateName] in the form {varName: varData}
        // we want to store each variable name in the dict into the variable location
        // described by the state and the variable name['stateTrie', ...state, 'variables', variableName, 'variable']
    
        // console.log(state, downStream)
        const stringifiedStateName = this.stringifyState(state)
        // console.log(downStream[stringifiedStateName])
        const variableNames = Object.keys(downStream[stringifiedStateName])
        variableNames.forEach(variableName => {

            const fullVariablePath = ['stateTrie', ...state, 'variables', variableName, 'variable']

            tree = deepAssign(  tree,
                                fullVariablePath,
                                downStream[stringifiedStateName][variableName],
                                setToValue
            )
            // set the copied data in variable to 'new'
            tree = deepAssign(
                                tree,
                                fullVariablePath,
                                findState(tree, fullVariablePath),
                                newFlags
            )
        })
        // console.log('did it work?', tree)
        return tree
        // const fullVariablePath = ['stateTrie', ...state, 'variables', variableName, 'variable']
        // want to visit all the variables saved and match them to the empty variable slots in the destination state
        // make sure they match before saving them

    }
    //////
    ///// functions for collecting changes and cleaning changes in data
    collectChanges = (tree, state) => {
        const variableStateLevel = findState(tree, ['stateTrie', ...state, 'variables'])
        if(variableStateLevel !== null) {
            
            const variableNames = Object.keys(variableStateLevel)
            // console.log('variables for this level', state, variableNames)
            // console.log('tree before collecting')
            // console.log(tree)
            // problems 1
            // 4 states should have change sets to look through
            let mapping = {}
            variableNames.map(variableName => {
                // problem 2
                // doesn't find nested items and gives undfined for no changes found
                let changes = collectMostShallowChange(getVariableValueFromParent2(state, variableName))
                // console.log('here are the changes collected for', variableName)

                // console.log(variableName, changes)
                // console.log(tree)
                mapping = { ...mapping,
                            [variableName] : changes}

            })
            // console.log('after cleaning')
            // console.log(tree)
            return mapping
        }
        else {
            // console.log('no vars for this level', state)
            return {}
        }
    }
    cleanChanges = (tree, state) => {
        const variableStateLevel = findState(tree, ['stateTrie', ...state, 'variables'])
        if(variableStateLevel !== null) {
            
            const variableNames = Object.keys(variableStateLevel)
            // console.log('variables for this level', state, variableNames)
            // console.log('tree before collecting')
            // console.log(tree)
            // problems 1
            // 4 states should have change sets to look through
            // let mapping = {}
            variableNames.map(variableName => {
                // problem 2
                // doesn't find nested items and gives undfined for no changes found
                // let changes = collectMostShallowChange(getVariableValueFromParent2(state, variableName))
                // console.log(variableName, changes)
                // console.log('before cleaning')
                // console.log(tree)
                // mapping = { ...mapping,
                //             [variableName] : changes}
                tree = cleanRecordsDeep(tree, state, variableName)

            })
            // console.log('after cleaning')
            // console.log(tree)
            return tree
        }
        else {
            // console.log('no vars for this level', state)
            return tree
        }
    }
    setupMachine = () => {
        let lastOne = this.visit(['start', '0'], [['start', '0']], 0, null, null)
        stateChangesAllLevels = [lastOne, ...stateChangesAllLevels]
        console.log(stateChangesAllLevels)
    }
    // each level calls this function 1 time
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


        // transport system
        // The states are arranged in a hierarchy, and data will need to travel up and down, ideally with the
        // user doing very little.
        // The user sets the start state and the end state to enable their chosen data to automatically travel
        // between the hierarchical points.  The user doesn't need to write copy statements or prop drilling to acomplish this.  It's similar to Context API,
        // but the data will be able travel up and down.

        // sourceState: begin: varName -> destinationState : assume the varName will match the varName at
        // the destinationState
        // destinationState: end: varName -> sourceState : assume the varName will match the varName at
        // the sourceState

        // hopper table: destinationState -> {varName: varData}
        // the destination state will know the source so if the hooper data isn't there there than we know what A and B are
        // detecting the error of A -> B` -> B where B` is B but comes earlier(not currently implemented)
        // don't know how to detect other kinds of errors so the user can track them down quicker
        // generalized fully automated transport system for the user and detects 1 kind of error

        // record system
        // recording all changes the user mades to data
        // collect it after the state runs and after the hopper drops data to a parent state
        // this way we can track their changes from state to state
        // We can't run more than 1 state at a time becuase tracking and transporting data require all the data in our graph to be
        // copied.

        // if the user feels like it's cumbersome then the solution has failed
        // ['start', '0'] will be the parent 2 times in a row
        let numberOfChildrenRun = 0
        // console.log("visit", recursiveId, parent, nextStates, numberOfChildrenRun)
        // console.log(Object.keys(tree['stateTrie']))
        if(stateCount === 4) {
            console.log('done with states')
            console.log()
            return
        }
        // try all the states
        // replace with a forEach
        let resultOfFunction = false
        let ranTrueFunction = false
        let stateChangesCurrentLevel = []
        // while nextStates.length > 0 do below
        nextStates.forEach(state => {

            if(!ranTrueFunction) {

                // don't want to run the 2nd true function
                if(!resultOfFunction) {

                    let copiedDownStream = false
                    let downStreamHopperStateNamesList = []
                    if(this.isDownStreamEnd(state)) {
                        tree = this.storeIntoDownStreamEndVariables(tree, state, downStream)
                        copiedDownStream = true
                    }
                    if(copiedDownStream) {
                        let stringifiedStateName = this.stringifyState(state)
                        downStreamHopperStateNamesList = Object.keys(downStream[stringifiedStateName])
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
                        numberOfChildrenRun += 1
                        let stateRecords = {    parentState: parent,
                                                stateName: state,
                                                firstParent: false,
                                                isParent: false,
                                                dataCopiedDown: copiedDownStream,
                                                downStreamHopperStateNames: downStreamHopperStateNamesList,
                                                variablesChanged: []
                                            }
                        if(this.isParent(currentState)) {
                            if(numberOfChildrenRun === 1) {
                                
                                const mapping = this.collectChanges(tree, state)
                                // console.log('measuring changes to first parent', state, mapping)
                                tree = this.cleanChanges(tree, state)
                                stateRecords = {    ...stateRecords,
                                                    firstParent: true,
                                                    isParent: true,
                                                    variablesChanged: mapping
                                                }
                                // console.log('after cleaning')
                                // console.log(tree)

                            }
                            // the change logging must only be run one time per state
                            else {
                                // stateRecords = { ...stateRecords,
                                //                 isParent: true   }
                                const mapping = this.collectChanges(tree, parent)
                                // console.log('measuring changes to nth state', state, parent, mapping)
                                tree = this.cleanChanges(tree, parent)
                                stateRecords = {    ...stateRecords,
                                                    isParent: true,
                                                    variablesChanged: mapping
                                                }
                                // console.log('after cleaning')
                                // console.log(tree)
                            }
                            if(this.isDownStreamStart(state)) {

                                // we want to store the downstream data for each state that runs
                                downStream = this.getDownStreamStartVariables(tree, state, downStream)
                                // console.log(downStream)
                            }
                            // console.log(stateRecords)
                            stateChangesCurrentLevel = [...stateChangesCurrentLevel, stateRecords]
                            // get downstream data from parent and pass it down
                            

                            stateChangesAllLevels = [   this.visit( state,
                                                                    currentState['children'],
                                                                    recursiveId + 1,
                                                                    stateCount,
                                                                    downStream,
                                                                    upStream),
                                                        ...stateChangesAllLevels]

                            // stateChangesAllLevels
                            // console.log(x)
                            // console.log('recursion unwinding')
                            // console.log([...currentState['children']])
                        } else {
                            // console.log("no children")
                            nextStates = currentState['next']
                            const mapping = this.collectChanges(tree, parent)
                            // console.log('measuring changes to nth state', state, parent, mapping)
                            tree = this.cleanChanges(tree, parent)
                            stateRecords = {    ...stateRecords,
                                                variablesChanged: mapping
                                            }
                            // console.log(stateRecords)
                            stateChangesCurrentLevel = [...stateChangesCurrentLevel, stateRecords]
                            // stateChangesAllLevels = [...stateChangesAllLevels]

                            // console.log('after cleaning')
                            // console.log(tree)
                            // console.log(nextStates, 'to try')
                        }
                        // break

                    }
                }
            }
            
        })
        return stateChangesCurrentLevel

        // console.log(this.traverseTrie(tree['stateTrie'], currentState))
        // console.log(tree['stateTrie'][currentState[0]])
    }
    render() {
        return (
            <div >
                {/* {console.log('happening')} */}
                {/* the parent and the first state to run need to be the same for the first call */}
                <button onClick={() => this.setupMachine()}>start</button>
            </div>
        )
    }
}
export default Data