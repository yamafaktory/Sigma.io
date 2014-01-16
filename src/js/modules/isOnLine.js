//  Sigma.isOnLine module

//  Get navigator online status
module.exports = function () {
  if ('onLine' in navigator) {
    return navigator.onLine;
  } else {
    return undefined;
  }
};