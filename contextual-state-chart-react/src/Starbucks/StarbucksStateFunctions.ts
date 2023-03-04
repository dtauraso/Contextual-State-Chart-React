const barista = (graph: any) => {
  return true;
};

const cashier = (graph: any) => {
  return true;
};

const customer = (graph: any) => {
  // cannot use runTree to path traverse to final parent state
  // const drink = graph.getState(["Customer"]).getVariable("drink");
  // const drink = graph.getParent([["parent name 1"], ["parent name 2"]]).getVariable("drink")
  // parent starts at current state and travels up the parent path
  // console.log(`|${drink}|`);
  return true;
};

export { barista, cashier, customer };
