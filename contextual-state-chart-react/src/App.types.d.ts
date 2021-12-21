// type Variables = {
//   [key: string]: number;
// };
type Wrapper = {
  value: any;
  id: number;
  name: string;
  states: States;
  setId: (this: any, id: number) => this;
  setName: (this: any, name: string) => this;
  setValue: (this: any, value: any) => this;
  setReferenceToStatesObject: (this: any, statesObject: any) => this;
  setGraphs: (this: any, states: States) => this;
  getVariable: (
    graph: Graph,
    // parentDataStateName: string[],
    variableName: string
  ) => State | Wrapper;
};
type NullState = Wrapper & {};
type BooleanState = Wrapper & {};
type NumberState = Wrapper & {};
type StringState = Wrapper & {};
type ArrayState = Wrapper & {
  mapWrapper: (this: any, callback: any) => this;
  collect: (this: any) => [];
  updateAt: (this: any, i: number, newValue: number) => this;
};
type NullState = {};
type VariableState = State & {
  value: NullState | boolean | number[];
};

type Variable = {
  [key: string]: number;
};
type ControlFlowState = State & {
  parents: string[][];
  name: string[];
  functionCode: (graph: any, currentState: any) => boolean;
  functionName: string;
  start: string[][];
  children: string[][];
  next: string[][];
  variables?: Variable;
  stateRunCount: number;
  // getVariable: (graph: Graph, variableName: string) => State;
  getVariable: (
    this: ControlFlowState,
    variableName: string
  ) => VariableState | -1;
};
type State = {
  id: number;
};
type States = {
  [key: number]: ControlFlowState | VariableState;
};
type StatesObject = {
  nextStateId: number;
  states: States;
};
type NamesTrie =
  | {
      [key: string]: NamesTrie;
      id: number;
    }
  | {
      [key: string]: NamesTrie;
    };
type Graph = {
  namesTrie: NamesTrie;
  statesObject: StatesObject;

  getState: (this: Graph, stateName: string[]) => ControlFlowState;
  getStateById: (this: Graph, stateId: number) => ControlFlowState;
  getVariable: (this: ControlFlowState, variableName: string) => VariableState;
  getVariableById: (
    this: ControlFlowState,
    variableId: number
  ) => VariableState;
};

export {
  Wrapper,
  NullState,
  BooleanState,
  NumberState,
  StringState,
  ArrayState,
  Variable,
  State,
  States,
  StatesObject,
  NamesTrie,
  Graph,
  ControlFlowState,
  VariableState,
};
