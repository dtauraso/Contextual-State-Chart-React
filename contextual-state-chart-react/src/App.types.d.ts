type Wrapper = State & {
  name: string;
  graph: Graph;
  typeName: string;
  setId: (this: any, id: number) => this;
  setName: (this: any, name: string) => this;
  setValue: (this: any, value: any) => this;
  setReferenceToStatesObject: (this: any, statesObject: any) => this;
  setGraphs: (this: any, states: States) => this;
};
type BooleanState = Wrapper & {
  value: boolean;
  edgeGroups2: number[];
  edgeGroups: Edges[];
};
type NumberState = Wrapper & {
  value: number;
  edgeGroups2: number[];
  edgeGroups: Edges[];
};
type StringState = Wrapper & {
  value: string;
  edgeGroups2: number[];
  edgeGroups: Edges[];
};
type ArrayState = Wrapper & {
  value: number[];
  edgeGroups2: number[];
  edgeGroups: Edges[];

  mapWrapper: (this: ArrayState, callback: any) => ArrayState;
  collect: (this: ArrayState) => [];
  updateAt: (this: ArrayState, i: number, newValue: number) => ArrayState;
  at: (this: any, i: NumberState) => any;
};

type ObjectState = Wrapper & {
  value: Variable;
  edgeGroups2: number[];
  edgeGroups: Edges[];
};
type Variable = {
  [key: string]: number;
};
type ActiveChildStates = {
  [branchID: number]: number;
};
type Edge = {
  variablesToTransferToDifferentTimeline: string[];
  nextStateName: string[];
  nextStateID: number;
};
type Edges = {
  edges: Edge[];
  areParallel: boolean;
};

type ControlFlowState = State & {
  parents: string[][];
  name: string[];
  functionCode: (graph: Graph) => boolean;
  functionName: string;
  children: string[][];
  edgeGroups: Edges[];
  haveStartChildren: boolean;
  variables?: Variable;
  stateRunCount: number;
  branchIDParentIDParentBranchID: {
    [branchID: number]: {
      activeChildStatesCount: number;
      parentBranch: { parentID: number; parentBranchID: number };
    };
  };
  destinationTimeline: string;
  timelineIDs: { [timelineID: number]: number };
  areChildrenParallel: boolean;
  areNextParallel: boolean;
  // using "any" to avoid having to use ".typeName()" when getting the value of a variable
  getVariable: (this: ControlFlowState, variableName: string) => any;
  getParent: (this: ControlFlowState) => any;
  getEdges: (this: ControlFlowState, edgesGroupIndex: number) => Edges;
  areEdgesStart: (this: ControlFlowState, edgesGroupIndex: number) => boolean;
  isStartEmpty: () => boolean;
};
type State = {
  id: number;
};
type States = {
  [key: number]: ControlFlowState | BooleanState | NumberState | ArrayState;
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
  getVariableById: (this: Graph, variableId: number) => any;
};

export {
  Wrapper,
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
  ActiveChildStates,
  Edge,
  Edges,
  PendingStates,
  ControlFlowState,
};
