const barista = (graph: any) => {
  return true;
};

const cashier = (graph: any) => {
  return true;
};

const customer = (graph: any) => {
  // const drink = graph.getState(["Customer"]).getVariable("drink");
  // console.log(`|${drink}|`);
  return true;
};

export { barista, cashier, customer };
