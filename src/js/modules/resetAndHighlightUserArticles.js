//  Sigma.resetAndHighlightUserArticles module

//  Reset and highlight user's articles
module.exports = function () {
  var selector = '[data-owner="' + Sigma.username + '"]',
      articles = document.querySelectorAll(selector),
      articlesToReset = document.querySelectorAll('.isYours'),
      reset = function (i) {
        articlesToReset[i].classList.remove('isYours');
      },
      highlight = function (j) {
        articles[j].parentNode.classList.add('isYours');
      };
  //  Reset articles with .isYours class from former connection
  for (var i = 0; i < articlesToReset.length; ++i) {
    reset(i);
  }
  //  Then highlight user's articles
  for (var j = 0; j < articles.length; ++j) {
    highlight(j);
  }
};