import React from "react"

class VariableTimeline extends React.Component {

    constructor(props) {
        super(props)
        this.state = props
        // have 2 parts [0, n-2], [n-1]
        // forward direction
        // will need to reset
        // have a curser for the last position recorded
    }

    rerender() {
        return (
            // variable name
            
            // all the value the variable has had
            // the more recient value is a different color via span
            <div>
                {/* var name */}
                {/* [0, n - 2] values the variable has been set to */}
                {/* the last value computed a different color via span */}
            </div>
        )
    }
}
export default VariableTimeline;