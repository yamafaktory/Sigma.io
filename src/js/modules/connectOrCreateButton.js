//  Sigma.connectOrCreateButton module

//  Add connect or create button in nav
module.exports = function (type) {
  //  Connect is true | Create is false
  var addButton = function (type) {
        var nav = document.querySelector('nav'),
            button = document.createElement('a'),
            buttonSpan = document.createElement('span'),
            addFormOrCreate = function () {
              if (type === 'connect') {
                //  Check if form is not visible by now
                if (!Sigma.signIn.isVisible) {
                  //  Add aside element with form into the DOM
                  Sigma.signIn.init();
                  Sigma.signUp.init();
                  //  Hide nav
                  Sigma.navigation.hide();
                }
              } else {
                var title = 'An editable title!',
                    content = 'Here goes the content of your lovely article. You can directly drag & drop images here!';
                Sigma.disconnectObservers();
                Sigma.addContent(false, false, undefined, title, content, Sigma.username, true);
                Sigma.tools.attach();
                Sigma.resetAndHighlightUserArticles();
                Sigma.setObservers();
              }
            };
        button.setAttribute('href', '#');
        button.setAttribute('class', type);
        nav.lastChild.appendChild(button);
        button.appendChild(buttonSpan);
        buttonSpan.appendChild(document.createTextNode(type));
        Sigma.clickAndTouchListener.add(button, 'addFormOrCreate', addFormOrCreate);
      },
      removeButton = function (type) {
        var selector = '.'+type,
            button = document.querySelector(selector);
        if (button !== null) {
          Sigma.clickAndTouchListener.remove(button, 'addFormOrCreate');
          button.parentNode.removeChild(button);
        }
      };
      if (type) {
        //  Connect
        if (Sigma.connectOrCreateStatus === undefined || Sigma.connectOrCreateStatus !== true) {
          Sigma.connectOrCreateStatus = true;
          removeButton('create');
          addButton('connect');
        }
      } else {
        //  Create
        if (Sigma.connectOrCreateStatus === undefined || Sigma.connectOrCreateStatus !== false) {
          Sigma.connectOrCreateStatus = false;
          removeButton('connect');
          addButton('create');
        }
      }
};