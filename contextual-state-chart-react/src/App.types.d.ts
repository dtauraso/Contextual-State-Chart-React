type Variables = {
  [key: string]: number;
};
type State = {
  A_name?: string;
  functionCode?: (graph: any, currentState: any) => boolean;
  functionName?: string;
  start?: string[][];
  children?: string[][];
  next?: string[][];
  variables?: Variables;
  value?: any;
  set2SFromStateFunctionCallCount?: Number;
  stateRunCount?: Number;
};
type States = {
  [key: Number]: State;
};
type StatesObject = {
  maxStateId: Number;
  states: States;
};
type NamesTrie = {
  [key: string]: NamesTrie;
};
type Graph = {
  namesTrie: NamesTrie;
  statesObject: StatesObject;
};

export { Graph, NamesTrie, State, StatesObject, States, Variables };
