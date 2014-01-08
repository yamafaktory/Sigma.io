//  Sigma.highlightUserArticles module

//  Highlight user's articles
module.exports = function () {
  var selector = '[data-owner="' + Sigma.username + '"]',
      articles = document.querySelectorAll(selector),
      highlight = function (i) {
        articles[i].parentNode.classList.add('isYours');
      };
  for (var i = 0; i < articles.length; ++i) {
    highlight(i);
  }
};