type NullState = {};
type NumberState = {
  add: (this: NumberState, secondValue: number) => NumberState;
};
type ArrayState = {
  collect: (this: VariableState) => [];
};
type VariableState = State & {
  value:
    | NullState
    | boolean
    | NumberState
    | string
    | ArrayState
    | { [key: string]: number };
  id: number;
  name: string;
  record: any;
  graph: Graph;
  setId: (this: VariableState, id: number) => VariableState;
  setName: (this: VariableState, name: string) => VariableState;
  setValue: (this: VariableState, value: any) => VariableState;
  setGraphs: (this: VariableState, states: States) => VariableState;
};

type Variables = {
  [key: string]: number;
};

type ControlFlowState = State & {
  parents: string[][];
  name: string[];
  functionCode: (graph: Graph, currentState: State) => boolean;
  functionName: string;
  start: string[][];
  children: string[][];
  next: string[][];
  variables?: Variables;
  stateRunCount: number;
  getVariable: (this: State, variableName: string) => VariableState;
};
type State = {
  id: number;
};
type States = {
  [key: number]: State;
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

  getState: (this: Graph, stateName: string[]) => State | number;
  getStateById: (this: Graph, stateId: number) => State | number;
  getVariableById: (this: Graph, variableId: number) => VariableState | number;
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
};
