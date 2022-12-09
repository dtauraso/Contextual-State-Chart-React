import { ChangedStatus } from "../src/ContextualStateChart/StateTree";

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

type Variable = {
  booleanValue?: boolean;
  numberValue?: number;
  stringValue?: string;

  // number is stateID
  numberArrayValue?: number[];
  stringMapNumberValue?: { [id: string]: number };

  variableTypeName?: string;
  prevValue?: any;
  valueIDsChangedStatus: { [id: string]: {changedStatus: ChangedStatus, previousValue: any} };
  changeStatus: ChangeStatus;

  // traverse nested structures
  graph?: Graph;


  setId?: (this: any, id: number) => this;
  setName?: (this: any, name: string) => this;
  setValue?: (this: any, value: any) => this;
  setReferenceToStatesObject?: (this: any, statesObject: any) => this;
  setGraphs?: (this: any, states: States) => this;
  mapWrapper?: (this: ArrayState, callback: any) => ArrayState;
  collect?: (this: ArrayState) => [];
  updateAt?: (this: ArrayState, i: number, newValue: number) => ArrayState;
  at?: (this: any, i: NumberState) => any;
};

type State = {
  id: number;
  parents: string[][];
  name: string[];
  functionCode: (graph: Graph) => boolean;
  functionName: string;
  children: string[][];
  edgeGroups: Edges[];
  haveStartChildren: boolean;
  currentValue?: Variable;
  isVariable: boolean;
  stateRunCount: number;
  branchIDVariableID: {[branchID: number]: number},
  branchIDParentIDParentBranchID: {
    [branchID: number]: {
      activeChildStatesCount: number;
      parentBranch: { parentID: number; parentBranchID: number };
    };
  };
  pairID: number,
  destinationTimeline: string;
  timelineIDs: { [currentBranchID: number]: number };
  areChildrenParallel: boolean;
  areNextParallel: boolean;

  // access the current branch ID and the parent state ID
  runTree: Tree;

  // access the parent state and the current branch IDth variable ID
  graph: Graph;

  getInitVariables: (this: State) => State;
  getVariableBranches: (this: State) => string[];
  getValueFromBranch: (this: State, variableName: string) => number;
  getValue: (this: State) => any;
  variableTreeToInitJson: (this: State) => any;
  getVariables: (this: ControlFlowState) => Variable;
  getVariable: (this: ControlFlowState, variableName: string) => any;
  getValue: function (this: State): any;
  getParent: (this: ControlFlowState) => any;
  getEdges: (this: ControlFlowState, edgesGroupIndex: number) => Edges;
  areEdgesStart: (this: ControlFlowState, edgesGroupIndex: number) => boolean;
  isStartEmpty: () => boolean;
};

type StateRunStatus = {
  id: number,
  health: string,
}

// 1 state with all variables and functions needed
// 1 variable holding 1 type storing all types as separate variables
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

  getState: (this: Graph, stateName: string[]) => State;
  getStateById: (this: Graph, stateId: number) => State;
  getVariableById: (this: Graph, variableId: number) => any;
};

type Tree = {
  [branchID: number]: {
    [stateID: number]: {
      activeChildStates: ActiveChildStates;
      parentID: number;
      parentBranchID: number;
      edgesGroupIndex: number;
      currentStateHealth: string
      dependencyStateCount?: number;
      variableNames?: any;

    };
  };
  currentBranchID: number;

}
type TreeBottom = {
  branches: {
    [branchID: number]: {
      currentStateID: number,
    },
  },
  maxBranchID: number,
}

export {
  Variable,
  State,
  StateRunStatus,
  States,
  StatesObject,
  NamesTrie,
  Graph,
  ActiveChildStates,
  Edge,
  Edges,
  Tree,
  TreeBottom
};
