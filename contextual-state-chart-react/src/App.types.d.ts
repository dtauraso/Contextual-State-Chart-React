type Variables = {
  [key: string]: number;
};
type State = {
  name?: string;
  functionCode?: (graph: any, currentState: any) => boolean;
  start?: string[][];
  children?: string[][];
  next?: string[][];
  variables?: Variables;
  value?: any;
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

export { Graph, NamesTrie, StatesObject, States, Variables };
