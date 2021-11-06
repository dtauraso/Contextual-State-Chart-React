// type Variables = {
//   [key: string]: number;
// };
type Wrapper = {
  value: any;
  id: number;
  name: string;
  setId: (this: any, id: number) => this;
  setName: (this: any, name: string) => this;
  setValue: (this: any, value: any) => this;
  setReferenceToStatesObject: (this: any, statesObject: any) => this;
};
type NullState = Wrapper & {};
type BooleanState = Wrapper & {};
type NumberState = Wrapper & {};
type StringState = Wrapper & {};

type State = {
  parents?: string[][];
  name?: string[];
  functionCode?: (graph: any, currentState: any) => boolean;
  functionName?: string;
  start?: string[][];
  children?: string[][];
  next?: string[][];
  prev?: string[];
  variables?: any;
  value?: any;
  stateRunCount?: number;
  id?: number;
  mapWrapperState?: (this: any, callback: any, _this: any) => this;
  get?: (this: any, i: any) => this;
  setValue?: (this: any, value: any) => void;
};
type States = {
  [key: number]: State;
};
type StatesObject = {
  maxStateId: number;
  states: States;
};
type NamesTrie = {
  [key: string]: NamesTrie;
  id: number;
};
type Graph = {
  namesTrie: NamesTrie;
  statesObject: StatesObject;
  [key: string]: any;
};

export {
  Wrapper,
  StringState,
  Graph,
  NamesTrie,
  State,
  StatesObject,
  States,
  Variables,
};
