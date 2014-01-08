//  Sigma.preventPasting module

//  Paste processing
module.exports = function () {
  window.addEventListener('paste', function (event) {
    Sigma.manageMessage(true, 'Pasting is currently not supported due to cross-browser limitations. Use drag and drop instead.', false);
    event.preventDefault();
  }, false);
};