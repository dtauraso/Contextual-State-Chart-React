// type Variables = {
//   [key: string]: number;
// };
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

export { Graph, NamesTrie, State, StatesObject, States, Variables };
