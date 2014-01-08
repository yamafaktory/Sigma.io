//  Sigma.getTempId module

//  Assign a temporary id to manage new content
module.exports = function () {
  var crypto = window.crypto.getRandomValues(new Uint32Array(8)),
      id = '';
  for (var i = 0; i < crypto.length; ++i) {
    id += crypto[i].toString(16);
    if (i < crypto.length - 1) {
      id += '-';
    }
  }
  return id;
};