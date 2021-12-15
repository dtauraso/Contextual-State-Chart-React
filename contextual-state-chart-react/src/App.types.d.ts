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
  setStates: (this: any, states: States) => this;
};
type NullState = Wrapper & {};
type BooleanState = Wrapper & {};
type NumberState = Wrapper & {};
type StringState = Wrapper & {};
type ArrayState = Wrapper & {
  mapWrapper: (this: any, callback: any) => this;
};

type Variable = {
  [key: string]: number;
};
type State = {
  parents?: string[][];
  name?: string[];
  functionCode?: (graph: any, currentState: any) => boolean;
  functionName?: string;
  start?: string[][];
  children?: string[][];
  next?: string[][];
  prev?: string[];
  variables?: Variable;
  stateRunCount?: number;
  id?: number;
  getVariable?: (
    graph: Graph,
    parentDataStateName: string[],
    variableName: string
  ) => State;
};
type States = {
  [key: number]:
    | State
    | NullState
    | BooleanState
    | NumberState
    | StringState
    | ArrayState;
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
  [key: string]: any;

  getState?: (this: Graph, stateName: string[]) => State | Wrapper | null;
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
