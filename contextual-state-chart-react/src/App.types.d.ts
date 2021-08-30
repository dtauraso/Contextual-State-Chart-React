export type States = {
  [key: Number]: any;
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
