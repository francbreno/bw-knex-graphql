const groupBy = require('lodash').groupBy;
const humps = require("humps");

module.exports = (collec, keyList, keyName, single = true) => {
  const data = humps.camelizeKeys(collec);
  const inGroupsOfField = groupBy(data, keyName);

  return keyList
    .map(key => inGroupsOfField[key])
    .map(element => element ? 
      (single ? element[0] : element) : (single ? {} : []));
};
