import { getVariable, setVariable } from "../ContextualStateChart/StateTree";
import { getRunningState } from "../ContextualStateChart/Visitor";
// state names
const calculatorName = ["calculator"];
const createExpressionName = ["createExpression"];

// variable names
const inputName = "input";
const i1Name = "i1";
const tokenName = "token";
const expressionName = "expression";

// currentState needs to be reachable from graph
// graph -> bottom.children[i] -> nextStates[j] = currentState
const numberGetDigit = (graph: any) => {
  // save createExpressionName , and the current state using getVariable
  /*
  currentState: {
    variableName: {id, parentDataStateNameString, setFunctionWasCalled}

  }
  */
  // const input = getVariable(graph, calculatorName, inputName).value;
  // const i1 = getVariable(graph, calculatorName, i1Name);
  // const token = getVariable(graph, createExpressionName, tokenName).value;
  // let expression = getVariable(graph, calculatorName, expressionName).value;
  // console.log({ input, i1, token, expression });
  // if (i1.value >= input.length) {
  return false;
  // }
  // console.log(input[i1.value]);
  // if (!(input[i1.value] >= "0" && input[i1.value] <= "9")) {
  return false;
  // }
  // console.log("numberGetDigit");
  // setVariable(graph, tokenName, token + input[i1])

  // setVariable(graph, tokenName, token + input[i1.value]);
  // token.concat(input[i1.value])
  // i1.add(1);
  // setVariable(graph, i1Name, i1 + 1);
  // console.log("end of state", { graph });
  return true;
};
const saveNumber = (graph: any) => {
  // let expression = getVariable(graph, calculatorName, expressionName).value;
  // let token = getVariable(graph, createExpressionName, tokenName).value;
  // console.log({ token, test: Number(token) });
  // if (Number(token) === NaN) {
  return false;
  // }

  // expression.push(Number(token));

  // let i1 = getVariable(graph, calculatorName, i1Name);
  // let input = getVariable(graph, calculatorName, inputName).value;
  // console.log({ i1, length: input.length });

  // while (input[i1.value] && input[i1.value] === " ") {
  //   i1.add(1);
  //   // i1 += 1;
  //   if (i1.value >= input.length) {
  return false;
  //   }
  // }
  // console.log("saveNumber");
  // setVariable(graph, expressionName, expression);
  // setVariable(graph, i1Name, i1);
  // setVariable(graph, tokenName, "");
  // console.log("end of state", { graph });
  return true;
};
const isInputValid = (graph: any) => {
  // will only return true after we have read in all the input and it's a valid expression
  // const input = getVariable(graph, calculatorName, inputName).value;
  let i1 = getVariable(graph, calculatorName, i1Name);
  // let expression = getVariable(graph, calculatorName, expressionName).value;

  // if (i1.value >= input.length) {
  // console.log({ expression });
  return true;
  // }
  return false;
};

const operatorGetOperator = (graph: any) => {
  // const input = getVariable(graph, calculatorName, inputName).value;
  // const i1 = getVariable(graph, calculatorName, i1Name);
  // const token = getVariable(graph, createExpressionName, tokenName).value;
  // console.log({ input, i1, token });
  // if (i1.value >= input.length) {
  return false;
  // }
  const operators = ["*", "/", "+", "-"];
  // if (!operators.includes(input[i1.value])) {
  return false;
  // }
  // setVariable(graph, tokenName, token + input[i1.value]);
  // i1.add(1);
  // setVariable(graph, i1Name, i1 + 1);

  return true;
};

const saveOperator = (graph: any) => {
  // console.log("saveOperator");
  // let expression = getVariable(graph, calculatorName, expressionName).value;

  // console.log({parentStateName, currentStateName, expression})
  // let token = getVariable(graph, createExpressionName, tokenName).value;
  const operators = ["*", "/", "+", "-"];

  // if (!operators.includes(token)) {
  // return false;
  // }

  // expression.push(token);

  let i1 = getVariable(graph, calculatorName, i1Name);
  // const input = getVariable(graph, calculatorName, inputName).value;

  // while (input[i1.value] === " ") {
  // i1.add(1);
  // i1 += 1;
  // }
  // setVariable(graph, expressionName, expression);

  // setVariable(graph, tokenName, "");
  // setVariable(graph, i1Name, i1);

  // console.log(graph['nodeGraph2']['expression'])

  // fail
  return true;
};

// evaluator
const getA2 = (graph: any) => {
  //   // all chains start with this function

  // let i2 = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
  //   let expression = hcssm.getVariable(graph, "root", "expression").value;
  //   hcssm.setVariable(graph, "evaluateExpression", "a", expression[i2]);
  //   hcssm.setVariable(graph, "evaluateExpression", "i2", i2 + 1);

  return true;
};

// //import * as cf from './common_functions.js'
// const isNumber = (currentState, graph, parentState) => {
//   // if the token from parent_state is a number
//   // convert to number
//   // save to expression
// };
// // current_state, graph, parent_state
// const parseChar = (currentState, graph, parentState) => {
//   //console.log('in parseChar', node)
//   let stateName = currentState;
//   let i = graph["i"];
//   let input = graph["input"];

//   if (i >= input.length) {
//     return false;
//   }
//   if (graph["parsingShecks"][stateName](currentState, graph)) {
//     graph["i"] += 1;
//     return true;
//   }
//   return false;
// };

// var getA = (currentState, graph, parentState) => {
//   // all chains start with this function
//   graph["operationVars"]["chainLength"] = 0;

//   let i = graph["i"];
//   let input = graph["input"];
//   graph["operationVars"]["a"] = input[i];
//   graph["operationVars"]["chainLength"] += 1;
//   graph["i"] += 1;

//   return true;
// };

// const getB2 = (graph, parentState, currentState) => {
//   let i2 = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
//   let expression = hcssm.getVariable(graph, "root", "expression").value;
//   hcssm.setVariable(graph, "evaluateExpression", "b", expression[i2]);
//   hcssm.setVariable(graph, "evaluateExpression", "i2", i2 + 1);

//   return true;
// };

// const getB = (currentState, graph, parentState) => {
//   let i = graph["i"];
//   let input = graph["input"];
//   graph["operationVars"]["b"] = input[i];
//   graph["operationVars"]["chainLength"] += 1;
//   graph["i"] += 1;

//   return true;
// };

// const isOp2 = (graph, parentState, currentState) => {
//   // check current operand with jth operand
//   // let i = graph['i']
//   // let input = graph['input']
//   let i2 = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
//   let expression = hcssm.getVariable(graph, "root", "expression").value;
//   let j = hcssm.getVariable(graph, "evaluateExpression", "j").value;
//   let operators = hcssm.getVariable(
//     graph,
//     "evaluateExpression",
//     "operators"
//   ).value;

//   // let j = graph['lexVars']['j']
//   // let operators = graph['lexVars']['operators']
//   if (expression[i2] === operators[j]) {
//     hcssm.setVariable(graph, "evaluateExpression", "i2", i2 + 1);
//     return true;
//   }
//   return false;
//   // increment
// };

// const isOp = (currentState, graph, parentState) => {
//   // check current operand with jth operand
//   let i = graph["i"];
//   let input = graph["input"];

//   let j = graph["lexVars"]["j"];
//   let operators = graph["lexVars"]["operators"];
//   return input[i] === operators[j];
// };

// const evaluate2 = (graph, parentState, currentState) => {
//   let i2 = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
//   let expression = hcssm.getVariable(graph, "root", "expression").value;

//   // let input = graph['input']
//   hcssm.setVariable(graph, "evaluateExpression", "b", expression[i2]);

//   // graph['operationVars']['b'] = input[i]

//   let a = hcssm.getVariable(graph, "evaluateExpression", "a").value;
//   let b = hcssm.getVariable(graph, "evaluateExpression", "b").value;

//   // let j = graph['lexVars']['j']
//   // let operators = graph['lexVars']['operators']
//   let j = hcssm.getVariable(graph, "evaluateExpression", "j").value;
//   let operators = hcssm.getVariable(
//     graph,
//     "evaluateExpression",
//     "operators"
//   ).value;
//   let operations = hcssm.getVariable(
//     graph,
//     "evaluateExpression",
//     "operatorFunctions"
//   ).value;
//   // let operations = graph['lexVars']['operations']

//   hcssm.setVariable(
//     graph,
//     "evaluateExpression",
//     "a",
//     operations[operators[j]](a, b)
//   );
//   hcssm.setVariable(graph, "evaluateExpression", "b", 0);

//   // update array to account for the changes
//   // console.log(i2)
//   // graph['operationVars']['a'] = operations[operators[j]] (a, b)
//   // graph['operationVars']['b'] = 0
//   // hcssm.setVariable(graph, 'root', 'iExpression', i + 1)
//   // i2 += 1
//   // graph['i'] += 1

//   let strA = hcssm.getVariable(graph, "evaluateExpression", "a").value;
//   // String(graph['operationVars']['a'])

//   // let chainLength = graph['operationVars']['chainLength']

//   let beforeTheChain = expression.slice(0, i2 - 2);
//   // console.log(beforeTheChain)
//   // graph['input'].slice(0, i - 2)

//   let beforeTheChainLen = beforeTheChain.length;
//   let theChain = strA;

//   let afterTheChain = expression.slice(i2 + 1, expression.length);

//   expression = beforeTheChain;
//   // graph['input'] = beforeTheChain
//   expression.push(theChain);
//   // graph['input'].push(theChain)
//   for (var k in afterTheChain) {
//     expression.push(afterTheChain[k]);
//     // graph['input'].push(afterTheChain[k])
//   }
//   hcssm.setVariable(graph, "evaluateExpression", "i2", beforeTheChainLen);
//   hcssm.setVariable(graph, "root", "expression", expression);
//   // graph['i'] = beforeTheChainLen
//   // console.log(hcssm.getVariable(graph, 'root', 'expression').value)
//   return true;
// };

// const evaluate = (currentState, graph, parentState) => {
//   let i = graph["i"];
//   let input = graph["input"];
//   graph["operationVars"]["b"] = input[i];

//   let a = Number(graph["operationVars"]["a"]);
//   let b = Number(graph["operationVars"]["b"]);

//   let j = graph["lexVars"]["j"];
//   let operators = graph["lexVars"]["operators"];
//   let operations = graph["lexVars"]["operations"];

//   graph["operationVars"]["a"] = operations[operators[j]](a, b);
//   graph["operationVars"]["b"] = 0;
//   graph["i"] += 1;
//   let strA = String(graph["operationVars"]["a"]);

//   let chainLength = graph["operationVars"]["chainLength"];

//   let beforeTheChain = graph["input"].slice(0, i - 2);

//   let beforeTheChainLen = beforeTheChain.length;
//   let theChain = strA;

//   let afterTheChain = graph["input"].slice(i + 1, graph["input"].length);

//   graph["input"] = beforeTheChain;

//   graph["input"].push(theChain);
//   for (var k in afterTheChain) {
//     graph["input"].push(afterTheChain[k]);
//   }

//   graph["i"] = beforeTheChainLen;

//   return true;
// };

// const ignoreOp2 = (graph, parentState, currentState) => {
//   let i2 = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
//   let expression = hcssm.getVariable(graph, "root", "expression").value;

//   let j = hcssm.getVariable(graph, "evaluateExpression", "j").value;
//   let operators = hcssm.getVariable(
//     graph,
//     "evaluateExpression",
//     "operators"
//   ).value;

//   // let i = graph['i']
//   // let input = graph['input']

//   // let j = graph['lexVars']['j']
//   // let operators = graph['lexVars']['operators']

//   // need to prove input[i] is an operator, but not operators[j]

//   if (endOfInput2(graph, parentState, currentState)) {
//     return false;
//   }
//   if (operators.includes(expression[i2]) && expression[i2] !== operators[j]) {
//     // if(operators.includes(input[i]) && (input[i] !== operators[j]))
//     // {
//     hcssm.setVariable(graph, "evaluateExpression", "a", 0);
//     hcssm.setVariable(graph, "evaluateExpression", "i2", i2 + 1);
//     // graph['operationVars']['a'] = 0
//     return true;
//   }
//   return false;
// };

// const ignoreOp = (currentState, graph, parentState) => {
//   let i = graph["i"];
//   let input = graph["input"];

//   let j = graph["lexVars"]["j"];
//   let operators = graph["lexVars"]["operators"];

//   // need to prove input[i] is an operator, but not operators[j]

//   if (endOfInput(currentState, graph, parentState)) {
//     return false;
//   }
//   if (operators.includes(input[i]) && input[i] !== operators[j]) {
//     graph["operationVars"]["a"] = 0;
//     return true;
//   }
//   return false;
// };

// const endOfInput2 = (graph, parentState, currentState) => {
//   let i2 = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
//   let expression = hcssm.getVariable(graph, "root", "expression").value;

//   // let i = graph['i']
//   // let input = graph['input']

//   return i2 >= expression.length;
// };

// const endOfInput = (currentState, graph, parentState) => {
//   let i = graph["i"];
//   let input = graph["input"];

//   return i >= input.length;
// };

// const inputIsInvalid2 = (graph, parentState, currentState) => {
//   console.log("your input is invalid");
//   return true;
// };

// const inputIsInvalid = (currentState, graph, parentState) => {
//   console.log("your input is invalid");
//   return true;
// };

// const noMoreInput2 = (graph, parentState, currentState) => {
//   return endOfInput2(graph, parentState, currentState);
// };

// const noMoreInput = (currentState, graph, parentState) => {
//   return endOfInput(currentState, graph, parentState);
// };

// const saveDigit = (currentState, graph, parentState) => {
//   let char = cf.getChar(currentState, graph);

//   return char >= "0" && char <= "9";
// };

// const isWhiteSpace = (currentState, graph) => {
//   return cf.getChar(currentState, graph) === " ";
// };

// const mult = (a, b) => {
//   return a * b;
// };
// const divide = (a, b) => {
//   return a / b;
// };
// const plus = (a, b) => {
//   return a + b;
// };
// const minus = (a, b) => {
//   return a - b;
// };

// const returnTrue2 = (graph, parentStateName, currentStateName) => {
//   return true;
// };

const returnTrue = (graph: any) => {
  return true;
};
// const returnFalse2 = (graph, parentStateName, currentStateName) => {
//   return false;
// };

const returnFalse = (graph: any) => {
  return false;
};

// const resetForNextRound2 = (graph, parentState, currentState) => {
//   let i = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
//   let expression = hcssm.getVariable(graph, "root", "expression").value;

//   // let i = graph['i']
//   // let input = graph['input']
//   if (i < expression.length) {
//     return false;
//   }
//   let j = hcssm.getVariable(graph, "evaluateExpression", "j").value;
//   hcssm.setVariable(graph, "evaluateExpression", "j", j + 1);
//   // graph['lexVars']['j'] += 1
//   hcssm.setVariable(graph, "evaluateExpression", "i2", 0);

//   // graph['i'] = 0
//   return true;
// };

// const resetForNextRound = (currentState, graph, parentState) => {
//   let i = graph["i"];
//   let input = graph["input"];
//   if (i < input.length) {
//     return false;
//   }
//   graph["lexVars"]["j"] += 1;
//   graph["i"] = 0;
//   return true;
// };

// const showAndExit2 = (graph, parentState, currentState) => {
//   let expression = hcssm.getVariable(graph, "root", "expression").value;

//   // let input = graph['input']
//   if (expression.length > 1) {
//     return false;
//   }
//   console.log(expression[0]);
//   return true;
// };

// const showAndExit = (currentState, graph, parentState) => {
//   let input = graph["input"];
//   if (input.length > 1) {
//     return false;
//   }
//   console.log(input[0]);
//   return true;
// };

// const validOp2 = (graph, parentState, currentState) => {
//   let i = hcssm.getVariable(graph, "evaluateExpression", "i2").value;
//   let expression = hcssm.getVariable(graph, "root", "expression").value;

//   // let i = graph['i']
//   // let input = graph['input']
//   if (!isOp2(currentState, graph, parentState)) {
//     return false;
//   }
//   hcssm.setVariable(graph, "evaluateExpression", "a", expression[i - 1]);
//   // graph['operationVars']['a'] = input[i - 1]
//   return true;
// };

// const validOp = (currentState, graph, parentState) => {
//   let i = graph["i"];
//   let input = graph["input"];
//   if (!isOp(currentState, graph, parentState)) {
//     return false;
//   }
//   graph["operationVars"]["a"] = input[i - 1];
//   return true;
// };

export {
  numberGetDigit,
  saveNumber,
  isInputValid,
  operatorGetOperator,
  saveOperator,
  //   parseChar,
  //   getA2,
  //   getA,
  //   getB2,
  //   getB,
  //   isOp2,
  //   isOp,
  //   evaluate2,
  //   evaluate,
  //   ignoreOp2,
  //   ignoreOp,
  //   endOfInput2,
  //   endOfInput,
  //   inputIsInvalid2,
  //   inputIsInvalid,
  //   noMoreInput2,
  //   noMoreInput,
  //   saveDigit,
  //   isWhiteSpace,
  //   mult,
  //   divide,
  //   plus,
  //   minus,
  //   returnTrue2,
  returnTrue,
  //   returnFalse2,
  returnFalse,
  //   resetForNextRound2,
  //   resetForNextRound,
  //   showAndExit2,
  //   showAndExit,
  //   validOp2,
  //   validOp,
};
