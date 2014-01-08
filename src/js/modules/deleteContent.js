//  Sigma.deleteContent module

//  Delete content
module.exports = function (id) {
  var selector = '[data-mongo-id="' + id + '"]';
  var node = document.querySelector(selector);
  //  If id exists on the client
  if (node !== null) {
    node.parentNode.removeChild(node);
  }
};