export type Variables = {
  [key: string]: number;
};
export type State = {
  name?: string;
  functionCode?: (graph: any, currentState: any) => boolean;
  start?: string[][];
  children?: string[][];
  next?: string[][];
  variables?: Variables;
  value?: any;
};
export type States = {
  [key: Number]: State;
};
export type StatesObject = {
  maxStateId: Number;
  states: States;
};
export type NamesTrie = {
  [key: string]: NamesTrie;
};
export type Graph = {
  namesTrie: NamesTrie;
  statesObject: StatesObject;
};
