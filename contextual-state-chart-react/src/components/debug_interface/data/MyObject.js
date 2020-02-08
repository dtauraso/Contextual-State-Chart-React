import React from 'react'

// no more nesting
const getNestedObject = (variableName, variablesChanged) => {


    console.log(variablesChanged[variableName])
    if(Object.keys(variablesChanged[variableName]).length === 0) {
        return '{}'
    }
    let typeName = variablesChanged[variableName]['data']['type']
    .map(charRecord => (charRecord['data']))
    .join('')
    if(typeName === 'object') {
        console.log(variablesChanged[variableName]['data']['value']['data'])
        let x = JSON.stringify(variablesChanged[variableName]['data']['value']['data'])
        // console.log(x)
        let atributes = Object.keys(variablesChanged[variableName]['data']['value']['data'])
        // for nested objects
        atributes.forEach(attribute => {
            let firstElement = variablesChanged[variableName]['data']['value']['data'][attribute]
            if(typeof(firstElement['data'] === 'string')) {
                // console.log('string')
                let myDataString = variablesChanged[variableName]['data']['value']['data'][attribute]
                                    .map(charRecord => (charRecord['data']))
                                    .join('')
                return myDataString

            }
        })
        // how to crawl JSON and only show the data for the nth level
    }
    
}
const MyObject = (props) => {

    // present the object data depending on what kind of state it comes from
    // if it's from an initialization state(firstParent: true) show the entire string
    // else show the first 5 changes with an extention button every 5 changes
    // if it's a nested object only show the first level and provide a button to expand each level
    const { parentState,
        stateName,
        firstParent,
        isParent,
        dataCopiedDown,
        variablesChanged } = props.changes

    // console.log(variablesChanged)
    let variableNames = Object.keys(variablesChanged)
    console.log('firstParent', firstParent, 'isParent', isParent)
    variableNames.forEach(key => {
        console.log(key, variablesChanged[key])
    })
    console.log('\n')
    if(firstParent) {
        // the object should have a flag and data keys becuase it's guaranteed by converting
        // the data in the tree and the hopper copies the data
        // get the variable data
        variableNames.forEach(key => {
            // console.log(variablesChanged[key]['data'])
            let typeName = variablesChanged[key]['data']['type']
                            .map(charRecord => (charRecord['data']))
                            .join('')
            // console.log(typeName)
            if(typeName === 'string') {
                let myString = variablesChanged[key]['data']['value']
                                .map(charRecord => (charRecord['data']))
                                .join('')
                console.log(myString)
            } else if(typeName === 'object') {
                // console.log(variablesChanged[key]['data']['value']['data'])
                // let x = JSON.stringify(variablesChanged[key]['data']['value']['data'])
                // // console.log(x)
                // let atributes = Object.keys(variablesChanged[key]['data']['value']['data'])
                // // for nested objects
                // atributes.forEach(attribute => {
                //     let firstElement = variablesChanged[key]['data']['value']['data'][attribute]
                //     if(typeof(firstElement['data'] === 'string')) {
                //         // console.log('string')
                //         let myDataString = variablesChanged[key]['data']['value']['data'][attribute]
                //                             .map(charRecord => (charRecord['data']))
                //                             .join('')
                //         console.log(myDataString)

                //     }
                // })
                // how to crawl JSON and only show the data for the nth level
            }
        })
    
    } else {
        variableNames.forEach(key => {
            console.log(key, variablesChanged[key])
            // getNestedObject(key, variablesChanged)
        })

    }
    return (
        <div>

        </div>
    )
}
export default MyObject;