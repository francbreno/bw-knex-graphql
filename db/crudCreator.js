module.exports = connection => crudOperations => Object.keys(crudOperations).reduce((accObject, currentKey) => ({
  [currentKey]: crudOperations[currentKey](connection),
  ...accObject
}), {});
