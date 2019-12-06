import React from "react"

class Data extends React.Component{
    constructor() {
        super();
        this.state = {
            'input' : /* passes '1 + 2 + 3 + 4',*//*'1 + 2 + 3 + 4 - 5 + 6 + 7 - 8 - 9 + 10 + 11 + 12',*//*'1+',*//*'1 +2',*/'1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12', // '1 '
            // 10 - 18 - 8 - 42
            'expression' : [],
            'collectedString' : '',
            'i' : 0,
        
            'operationVars' : {
        
                'a' : 0,
        
                'b' : 0},
        
            'lexVars' : {
                'operators' : ['*', '/', '-', '+'],
                'j' : 0,
                'operations' : {'*': "mult", '/': "divide", '+': "plus", '-': "minus"}},
            // this control graph uses string for states and cases
            'nodeGraph2' : {
        
                    // any next states having {} means it is a finishing state(but having no edges as true signals an error )
                    // {'next': [], 'children':[], 'functions':[]}
                    // {'next': {'0': {}}, 'children':{'0': {}}, 'functions':{'0'}}
        
                    'split' :
                        {'next': {'0': {'validate':'0', 'invalid':'0'}},
                        'children': {'0': {'char':'0'}},
                        'functions':{'0':"returnTrue"},
                        'parents' :{'0':{'root':'0'}}},
        
        
        
                    'validate' :
                        {'next': {'0': {'evaluateExpression': '0'}},
                        'children':{'0': {}}, 
                        'functions':{'0': "validate"},
                        'parents' :{'0':{}}},
        
        
                    'evaluateExpression' :
                        {'next': {'0': {'inputHas1Value':'0','evaluateExpression':'0'}},
                        'children':{'0': {'a':'0'}},
                        'functions':{'0': "returnTrue"},
                        'parents' :{'0':{}}},
        
        
        
                    'reset_for_next_round_of_input':
                        {'next': {'0': {'end_of_evaluating': '0'}},
                        'children':{'0':{}},
                        'functions':{'0':"resetForNextRound"},
                        'parents': {'0':{}}},
        
        
                    'end_of_evaluating' :
                        {'next': {'0': {}},
                        'children':{'0': {}},
                        'functions':{'0':"returnTrue"},
                        'parents':	{'0':{}}},
        
                    'input_has_1_value' :
                        {'next': {'0': {}},
                        'children':{'0': {}},
                        'functions':{'0':"showAndExit"},
                        'parents': {'0':{}}},
        
        
                        // split
                        'char':
                            {'next': {'0': {'last_to_save': '0', 'char': '0', 'save': '0'}},
                            'children':{'0': {}},
                            'functions':{'0':"collectChar"},
                            'parents': {'0':{'split':'0'}}}, // actually needs parents because it's the first state checked from split
        
                        'save':
                            {'next': {'0': {' ': '0'}},
                            'children':{'0': {}},
                            'functions':{'0':"save"},
                            'parents': {'0':{}}},
        
                        ' ' :
                            {'next': {'0':{' ':'0','init':'0'}},
                            'children':{'0':{}},
                            'functions':{'0':"cf.parseChar"},
                            'parents': {'0':{}}},
        
        
                        'init':
                            {'next': {'0': {'char': '0'}},
                            'children':{'0': {}},
                            'functions':{'0': "init"},
                            'parents': {'0':{}}},
        
                        'last_to_save' :
                            {'next': {'0': {}},
                            'children':{'0': {}},
                            'functions':{'0': "lastToSave"},
                            'parents': {'0':{}}},
        
        
        
                        // evaluateExpression
                        'a' :
                            {'next': {'0' : {'reset_for_next_round_of_input':'0', 'op':'0', 'op_ignore':'0'}},
                            'children': { '0':{}},
                            'functions' : {'0':"getA"/*  setKindOfNumberToA */},
                            'parents': {'0':{'evaluateExpression': '0'}}},
        
                        'op' :
                            {'next': {'0':{'error': '0', 'b':'evaluate'}},
                            'children': {'0':{}}, 
                            'functions' : { '0': "cf.parseChar"},
                            'parents': {'0':{}}},
        
                        'b' :
                            {'next': { 'evaluate':{'reset_for_next_round_of_input':'0', 'a':'0', 'op_ignore':'0'}},
                            'children': {'evaluate':{}},
                            'functions' : {'evaluate':"evaluate"},
                            'parents': {'0':{}, 'evaluate':{}}},
        
        
                        'op_ignore' :
                            {'next': {'0':{'error': '0', 'value_ignore':'0'}},
                            'children': {'0':{}},
                            'functions' : {'0':"cf.parseChar"},
                            'parents': {'0':{}}},
        
                        'value_ignore' :
                            {'next': {'0':{'reset_for_next_round_of_input':'0', 'op_ignore':'0', 'value_ignore': 'valid_op'},'valid_op': {'op':'0'}},
                            'children': {'0':{}, 'valid_op': {}},
                            'functions' : {'0':"cf.parseChar", 'valid_op': "validOp"},
                            'parents': {'0':{'ignore':'0'}, 'valid_op': {}}},
        
        
        
        
                        'error' :
                            {'next': {'0':{}},
                            'children':{'0':{}},
                            'functions':{'0':"noMoreInput"},
                            'parents':{'0':{}}},
        
        
                        'invalid' :
                            {'next': {'0': {}},
                            'children':{'0': {}},
                            'functions':{'0': "inputIsInvalid"},
                            'parents': {'0': {}}}
        
        
        
        
        
                }
        };
    }
    getA = (store, var_store, node) => {
        // use setState(), no mutation
        // https://stackoverflow.com/questions/18933985/this-setstate-isnt-merging-states-as-i-would-expect
        // https://github.com/VoliJS/NestedLink
        // test and figure out what works before converting everything
        // this.setState({ selected: { name: 'Barfoo' }});

        // var newSelected = Object.assign({}, this.state.selected);
        // newSelected.name = 'Barfoo';
        // this.setState({ selected: newSelected });

        // this.setState({ selected: Object.assign({}, this.state.selected, { name: "Barfoo" }) });


        // all chains start with this function
        this.state = {
            ...this.state,
            operation_vars: {chain_length: 0}
        }
        // this.setState({operationVars: {chainLength: 0}})
        // var_store['operation_vars']['chain_length'] = 0
    
        //console.log(var_store['operation_vars']['kind_of_number'])
        let i = this.state['i']
        let input = this.state['input']
        this.state = {
            ...this.state,
            operation_vars: {a: input[i]}
        }
        // this.setState({operation_vars: {a: input[i]}})
        // var_store['operation_vars']['a'] = input[i]
        let chainLength = this.state["operationVars"]["chainLength"]
        this.state = {
            ...this.state,
            operation_vars: {chainLength: chainLength + 1}
        }
        // this.setState({operation_vars: {chainLength: chainLength + 1}})
        this.state = {
            ...this.state,
            i: this.state["i"] + 1
        }
        // var_store['operation_vars']['chain_length'] += 1
        // this.setState({i: this.state["i"] + 1})
        // var_store['i'] += 1
        //console.log(var_store)
    
        return true
    }
    
    getB = (store, var_store, node) => {
    
        //console.log(var_store['operation_vars']['kind_of_number'])
        let i = var_store['i']
        let input = var_store['input']
        var_store['operation_vars']['b'] = input[i]
        var_store['operation_vars']['chain_length'] += 1
        var_store['i'] += 1
        //console.log(var_store)
    
        return true
    }
    
    // isOp = (store, var_store, node) => {
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
    
    
    
    
    
    // returnTrue = (store, var_store, node) => {
    //     return true
    // }
    // returnFalse = (store, var_store, node) => {
    //     return false
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
    
    
    
    
    // collectChar = (store, var_store, node) => {
    
    //     let i = var_store['i']
    //     let input = var_store['input']
    //     //console.log(input[i])
    //     if (input[i] != ' ')
    //     {
    //         var_store['collected_string'] += input[i]
    //         var_store['i'] += 1
    //         return true
    
    //     }
    //     return false
    // }
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


// applications: calculator -> representation -> langugae
// make the language with this
    render() {
        return (
            <div></div>
        )
    }
}
export default Data