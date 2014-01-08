//  Sigma.updateContent module

//  Update content
module.exports = function (html, id) {
  var selector = '[data-mongo-id="' + id + '"]',
      node = document.querySelector(selector);
  //  If id exists on the client
  if (node !== null) {
    node.innerHTML = html;
  }
};