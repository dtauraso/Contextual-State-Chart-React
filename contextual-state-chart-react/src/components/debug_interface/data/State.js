import React from 'react'
import MyObject from './MyObject';
const State = (props) => {


    // console.log(props.changes)
    const { parentState,
            stateName,
            firstParent,
            isParent,
            dataCopiedDown,
            variablesChanged } = props.changes
    // console.log(variablesChanged)
    return (
        <div>
            <p>{stateName.join(' ')}</p>
            <MyObject changes={props.changes}/>
        </div>
    )
}
export default State;