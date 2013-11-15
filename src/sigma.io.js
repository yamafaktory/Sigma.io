//  Sigma.io

//  (c) 2013 Davy Duperron
//  Client side

//  Main app
(function () {

  'use strict';

  //  Reference to global object
  var root = this;

  //  Main app
  var Sigma;
  Sigma = root.Sigma = {};

  //  App host:port
  Sigma.host = 'http://192.168.0.1';
  Sigma.port = 1337;

  //  Socket.io connection on node server
  Sigma.socket = io.connect(Sigma.host);

  //  Create new content
  Sigma.addCreateButton = function () {
    var header = document.querySelector('header'),
        create = document.createElement('a'),
        createSpan = document.createElement('span');
    create.setAttribute('class', 'create');
    create.setAttribute('href', '#');
    header.firstChild.lastChild.appendChild(create);
    create.appendChild(createSpan);
    createSpan.appendChild(document.createTextNode('create'));
    create.addEventListener('click', function (event) {
      var title = 'An editable title!',
          content = 'Here goes the content of your lovely article. You can directly drag & drop images here!';
      Sigma.disconnectObservers();
      Sigma.addContent(false, undefined, title, content, Sigma.username);
      Sigma.setObservers();
    }, false);
  };

  //  Date generator
  Sigma.date = {
    //  Formated date
    now : function () {
      var currentDate = new Date(),
          hours = currentDate.getHours(),
          minutes = currentDate.getMinutes(),
          meridiem;
      //  Set meridiem and hours format
      if (hours < 12) {
        meridiem = 'AM';
      } else {
        meridiem = 'PM';
        hours -= 12;
      }
      //  Fix minutes format
      if (minutes < 10) {
          minutes = '0' + minutes;
      }
      var displayDate = 'today ' + hours + ':' + minutes + ' ' + meridiem;
      return displayDate;
    },
    html : function () {
      return new Date().toISOString();
    }
  };

  //  New content generator
  Sigma.addContent = function (html, id, title, content, owner) {
    var main = document.querySelector('main'),
        firstRow = main.querySelector('.row:first-child'),
        cellsInFirstRow = firstRow !== null ? firstRow.children.length : 0,
        newArticle = document.createElement('article');
    newArticle.setAttribute('data-structure', 'article');
    newArticle.setAttribute('class', 'cell');
    //  Create article from scratch or inject content from database
    if (!html) {
      //  Create new h1 for title
      var newTitle = document.createElement('h1');
      newTitle.setAttribute('data-sigma', 'title');
      newTitle.setAttribute('contenteditable', 'true');
      newTitle.appendChild(document.createTextNode(title));
      //  Create new h2 for user
      var newOwner = document.createElement('h2');
      newOwner.setAttribute('data-owner', owner);
      newOwner.appendChild(document.createTextNode(owner));
      //  Create new date
      var newDate = document.createElement('time');
      newDate.appendChild(document.createTextNode(Sigma.date.now()));
      newDate.setAttribute('datetime', Sigma.date.html());
      //  Create new p for content
      var newContent = document.createElement('article');
      newContent.setAttribute('data-sigma', 'content');
      newContent.setAttribute('contenteditable', 'true');
      newContent.appendChild(document.createTextNode(content));
      //  Append childs in article
      newArticle.appendChild(newTitle);
      newArticle.appendChild(newOwner);
      newArticle.appendChild(newDate);
      newArticle.appendChild(newContent);
    } else {
      //  Assign id
      newArticle.dataset.idType = 'const';
      newArticle.dataset.mongoId = id;
      //  Inject content
      newArticle.innerHTML = html;
    }
    //  Add article to a new row or to the first one
    if (cellsInFirstRow === 0 || cellsInFirstRow === 3) {
      //  Add new row
      var newRow = document.createElement('div');
      newRow.setAttribute('class', 'row');
      main.insertBefore(newRow, main.firstChild);
      //  Then add new article
      newRow.appendChild(newArticle);
    } else {
      firstRow.insertBefore(newArticle, firstRow.firstChild);
    }
  };

  //  Update content
  Sigma.updateContent = function (html, id) {
    var selector = '[data-mongo-id="' + id + '"]',
        node = document.querySelector(selector);
    //  If id exists on the client
    if (node !== null) {
      node.innerHTML = html;
    }
  };

  //  Delete content
  Sigma.deleteContent = function (id) {
    var selector = '[data-mongo-id="' + id + '"]';
    var node = document.querySelector(selector);
    //  If id exists on the client
    if (node !== null) {
      node.parentNode.removeChild(node);
    }
  };

  //  Paste processing
  Sigma.preventPasting = function () {
    window.addEventListener('paste', function (event) {
      Sigma.manageMessage(true, 'Pasting is currently not supported due to cross-browser limitations. Use drag and drop instead.', false);
      event.preventDefault();
    }, false);
  };

  //  Drag & drop events
  Sigma.dragAndDrop = function () {
    //  Image resizing
    var resize = function (image) {
      var circleDiameter = 120,
          renderedCanvas = document.createElement('canvas'),
          templateCanvas = document.createElement('canvas'),
          renderedContext = renderedCanvas.getContext('2d'),
          templateContext = templateCanvas.getContext('2d'),
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight;
      if (image.width > image.height) {
        sourceX = (image.width - image.height) / 2;
        sourceY = 0;
        sourceWidth = image.height;
        sourceHeight = sourceWidth;
      } else {
        if (image.height > image.width) {
          sourceX = 0;
          sourceY = (image.height - image.width) / 2;
          sourceWidth = image.width;
          sourceHeight = sourceWidth;
        } else {
          sourceX = sourceY = 0;
          sourceWidth = sourceHeight = image.width;
        }
      }
      renderedCanvas.width = renderedCanvas.height = circleDiameter;
      templateCanvas.width = templateCanvas.height = circleDiameter;
      templateContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, circleDiameter, circleDiameter);
      renderedContext.clearRect(0, 0, circleDiameter, circleDiameter);
      renderedContext.beginPath();
      renderedContext.arc(circleDiameter/2, circleDiameter/2, (circleDiameter/2)-2, 0, Math.PI*2, true);
      renderedContext.fillStyle = renderedContext.createPattern(templateCanvas,'no-repeat');
      renderedContext.fill();
      //  Create gradient
      var gradient = renderedContext.createLinearGradient(0, 0, 0, 150);
      gradient.addColorStop(0, 'rgba(229, 86, 109, .7)');
      gradient.addColorStop(0.25, 'rgba(225, 98, 158, .7)');
      gradient.addColorStop(0.5, 'rgba(195, 104, 213, .7)');
      gradient.addColorStop(0.75, 'rgba(146, 94, 202, .7)');
      gradient.addColorStop(1, 'rgba(108, 83, 181, .7)');
      renderedContext.lineWidth = 2;
      renderedContext.strokeStyle = gradient;
      renderedContext.stroke();
      return renderedCanvas.toDataURL('image/png');
    };
    //  Handle image on drop event
    var appendImage = function (file, event) {
      if (file.type.match(/image.*/)) {
        var newImage = document.createElement('img'),
            reader = new FileReader();
        event.target.parentNode.querySelector('[data-sigma="content"]').appendChild(newImage);
        reader.readAsArrayBuffer(file);
        reader.onload = function (event) {
          window.URL = window.URL || window.webkitURL;
          var blob = new Blob([new Uint8Array(event.target.result)]),
              blobURL = window.URL.createObjectURL(blob),
              image = new Image();
          image.src = blobURL;
          image.onload = function () {
            //  Create new image in DOM
            var source = resize(image),
                mongoId = Sigma.getTempId();
            newImage.dataset.image = 'dropped';
            newImage.dataset.idType = 'tmp';
            newImage.dataset.mongoId = mongoId;
            //  Save new image source
            Sigma.storeImage(mongoId, source);
          };
        };
      }
    };
    //  Handle text on drop event
    var appendText = function () {
      var data = event.dataTransfer.getData('text/plain');
      event.target.textContent += ' '+data;
    };
    //  Dragenter event
    window.addEventListener('dragenter', function (event) {
      event.preventDefault();
      var isTargetable = event.target.hasAttribute('data-sigma') ? true : false;
      if (isTargetable) {
        event.target.focus();
      }
    }, false);
    //  Dragleave event
    window.addEventListener('dragleave', function (event) {
      event.preventDefault();
      var isTargetable = event.target.hasAttribute('data-sigma') ? true : false;
      if (isTargetable) {
        event.target.blur();
      }
    }, false);
    //  Dragover event
    window.addEventListener('dragover', function (event) {
      event.preventDefault();
    }, false);
    //  Drop event
    window.addEventListener('drop', function (event) {
      event.preventDefault();
      var fileData = event.dataTransfer.files,
          isTargetable = event.target.hasAttribute('data-sigma') ? true : false;
      if (isTargetable) {
        if (fileData.length !== 0) {
          //  Add files
          for (var i = 0; i < fileData.length; ++i) {
            appendImage(fileData[i], event);
          }
        } else {
          //  Add text only
          appendText();
        }
      }
      //  little hack: set the focus on the target for the sync process
      event.target.focus();
    }, false);
  };

  //  Store image in mongoDB
  Sigma.storeImage = function (tempId, data) {
    Sigma.socket.emit('storeImage', { tempId: tempId, src: data });
  };

  //  Manage contenteditable state
  Sigma.makeReadonly = function () {
    //  Make all Sigma attributes with contenteditable set to false if the user is not the owner of theses ones
    var data = document.querySelectorAll('[data-sigma]'),
        makeReadonly = function (i) {
          var owner = data[i].parentNode.querySelector('[data-owner]').dataset.owner;
          if (owner !== Sigma.username) {
            data[i].contentEditable = 'false';
          }
        };
    for (var i = 0; i < data.length; ++i) {
      makeReadonly(i);
    }
  };
    
  //  Set observers
  Sigma.setObservers = function () {
    var MutationObserver = window.MutationObserver ||
                           window.WebKitMutationObserver ||
                           window.MozMutationObserver,
        observers = [],
        data = document.querySelectorAll('[data-sigma]'),
        //  Attach observers on selected nodes
        attachObserver = function (i) {
          observers[i] = new MutationObserver(function (mutations) {
            //  For each mutation on DOM, sync content server-side
            mutations.forEach(function (mutation) {
              Sigma.synchronize();
              Sigma.droppedImages.lookAtMutations(mutation);
            });
          });
          observers[i].observe(data[i], {
            attributes: true, 
            childList: true, 
            characterData: true,
            attributeOldValue: true,
            subtree: true,
            characterDataOldValue: true
          });
        },
        //  Attach edit icon if user logged in
        attachTools = function (i) {
          var owner = data[i].parentNode.querySelector('[data-owner]').dataset.owner;
          if (Sigma.username === owner) {
            Sigma.contentEditing.status(data[i]);
          }
        };
    for (var i = 0; i < data.length; ++i) {
      attachObserver(i);
      attachTools(i);
    }
    //  Save a list of observers
    Sigma.observers = observers;
  };

  Sigma.droppedImages = {
    //  Store images removed by the user in an array
    removedImageIds : [],
    //  Analyse mutations
    lookAtMutations : function (mutation) {
      var addedNodes = mutation.addedNodes,
          removedNodes = mutation.removedNodes,
          type = mutation.type,
          _this = this,
          checkIfModified = function (add, nodes) {
            var updateImageIds = function () {
              if (add) {
                _this.removedImageIds.splice(_this.removedImageIds.indexOf(nodes[i].dataset.mongoId), 1);
              } else {
                _this.removedImageIds.push(nodes[i].dataset.mongoId);
              }
            },
                countImages = function (i) {
                  //  Check if the node is not pure text
                  if (nodes[i].nodeName !== '#text') {
                    //  Update if the image is the node itself
                    if (nodes[i].hasAttribute('data-image')) {
                      updateImageIds();
                    }
                  } else {
                    if (nodes[i].hasChildNodes()) {
                      //  If there are images as children
                      var images = nodes[i].querySelectorAll('[data-image]');
                      for (var j = 0; j < images.length; ++j) {
                        updateImageIds();
                      }
                    }
                  }
                };
            //  Core process
            if (nodes.length > 0 && type === 'childList') {
              for (var i = 0; i < nodes.length; ++i) {
                countImages(i);
              }
            }
          };
      //  Check for both added and removed nodes
      checkIfModified(false, removedNodes);
      checkIfModified(true, addedNodes);
    },
    //  Delete images in mongoDB
    delete : function () {
      //  If there is one or more images to remove
      if (this.removedImageIds.length > 0) {
        Sigma.socket.emit('deleteImage', { ids: this.removedImageIds });
        //  For further updates
        this.updateImageArray();
      }
    },
    updateImageArray : function () {
      var _this = this;
      Sigma.socket.on('updateImageArray', function (data) {
        _this.removedImageIds = data.array;
      });
    }
  };

  Sigma.simpleCounter = {
    i: 0,
    get value() {
      ++this.i;
      return this.i;
    }
  };

  //  Sync process
  Sigma.synchronize = function () {
    var article = document.activeElement.parentNode,
        articleClone = article.cloneNode(true),
        articleFragment = document.createDocumentFragment(),
        preventWholeHtmlInjection = article.nodeName !== 'HTML',
        mongoId;
    //  Inject article into empty clone
    articleFragment.appendChild(articleClone);
    //  Select tools into the clone
    var tools = articleFragment.querySelector('.tools');
    //  Then remove it
    tools.parentNode.removeChild(tools);
    //  Convert it
    var articleHTML = articleFragment.querySelector('[data-structure="article"]').innerHTML;
    if (document.hasFocus() && preventWholeHtmlInjection) {
      //  Check if div has a mongo id attribute => update content
      if (article.hasAttribute('data-mongo-id')) {
        if (article.dataset.idType === 'const') {
          //  Id is from mongo
          mongoId = article.dataset.mongoId;
          Sigma.socket.emit(Sigma.getChannelId, { action: 'update', mongoId: mongoId, html: articleHTML, owner: Sigma.username });
        } else {
          //  Id is a temporary one

          //  !!!!!!!!!!!!!!!!!!!!

          console.log('berp');
        }
      } else {
        //  Create new content
        article.dataset.idType = 'tmp';
        mongoId = Sigma.getTempId();
        article.dataset.mongoId = mongoId;
        Sigma.socket.emit(Sigma.getChannelId, { action: 'create', mongoId: mongoId, html: articleHTML, owner: Sigma.username });
      }
      //  Add save state for the article
      Sigma.saveManager.add(mongoId, false);
    }
  };

  //  Add features for content editing
  Sigma.contentEditing = {
    eraseIt : function (event) {
      var target = Sigma.contentEditing.target.current,
          mongoId = target.dataset.mongoId;
      target.parentNode.removeChild(target);
      //  Delete in mongoDB
      Sigma.socket.emit(Sigma.getChannelId, { action: 'delete', mongoId: mongoId });
    },
    addTools : function (event) {
      //  Create tools panel
      var toolsPanel = document.createElement('div'),
          close = document.createElement('a'),
          erase = document.createElement('a'),
          article = Sigma.contentEditing.setArticle(event.target);
      toolsPanel.setAttribute('class', 'tools');
      close.setAttribute('class', 'close');
      close.setAttribute('href', '#');
      close.setAttribute('data-tooltip', 'close');
      erase.setAttribute('class', 'erase');
      erase.setAttribute('href', '#');
      erase.setAttribute('data-tooltip', 'erase');
      article.appendChild(toolsPanel);
      toolsPanel.appendChild(close);
      toolsPanel.appendChild(erase);
      //  Attach eventListeners
      close.addEventListener('click', function (event) {
        Sigma.contentEditing.removeTools();
      }, false);
      erase.addEventListener('click', Sigma.contentEditing.eraseIt, false);
      //  Store target as former target for further use
      Sigma.contentEditing.formerTarget = event.target.parentNode;
    },
    manageTools : function (event) {
      //  Find tools
      var tools = document.querySelector('.tools');
      if (tools === null) {
        Sigma.contentEditing.addTools(event);
      } else {
        //  Locate the article in which tools are visible
        var article = Sigma.contentEditing.setArticle(tools);
        //  Then check if it's the same target
        if (Sigma.contentEditing.target.current !== article) {
          tools.parentNode.removeChild(tools);
          Sigma.contentEditing.addTools(event);
        }
        //  Remove then add eventListener to the new target
        var erase = document.querySelector('.erase');
        erase.removeEventListener('click', Sigma.contentEditing.eraseIt, false);
        erase.addEventListener('click', Sigma.contentEditing.eraseIt, false);
      }
    },
    removeTools : function () {
      var tools = document.querySelector('.tools');
      tools.parentNode.removeChild(tools);
    },
    setArticle : function (element) {
      //  Set article considering the fact that the browser can add divs in contenteditable elements
      var article;
      if (element.parentNode.dataset.structure !== 'article') {
        article = element.parentNode.parentNode;
      } else {
        article = element.parentNode;
      }
      return article;
    },
    editMode : function (event) {
      var target = event.target.parentNode;
      target.classList.toggle('editMode');
      //  Store target
      Sigma.contentEditing.target.add = target;
    },
    viewMode : function (event) {
      var target = event.target.parentNode;
      target.classList.remove('editMode');
      //  Update time
      target.querySelector('time').setAttribute('datetime', Sigma.date.html());
      target.querySelector('time').innerText = Sigma.date.now();
      //  Finally delete removed images by user
      Sigma.droppedImages.delete();
    },
    status : function (target) {
      //  Highlight articles with an edit icon - with firefox hack -
      target.addEventListener('focus', this.editMode, true);
      target.addEventListener('blur', this.viewMode, true);
      //  Add click event
      target.addEventListener('click', this.manageTools, false);
    },
    target : {
      //  Targets are managed as an array, with current and former values
      history : [],
      set add (target) {
        this.history.push(target);
        //  Limit array size to 2 elements
        if (this.history.length > 2){
          this.history.shift();
        }
      },
      get add () {},
      get current () {
        return this.history[this.history.length - 1];
      },
      get former () {
        if (this.history.length === 2) {
          return this.history[0];
        } else {
          return null;
        }
      }
    }
  };

  //  Collect channel id's
  Sigma.getChannelId = function () {
    Sigma.socket.on('id', function (data) {
      Sigma.getChannelId = data.id;
      //  Then create a listener
      Sigma.listen();
    });
  };

  //  Get mongoDB's id of new content
  Sigma.getMongoId = function () {
    Sigma.socket.on('mongoId', function (data) {
      Sigma.changeId(data.tempId, data.id, data.type);
    });
  };

  Sigma.changeId = function (tempId, id, type) {
    var selector = '[data-mongo-id="'+tempId+'"]',
        node = document.querySelector(selector),
        html = node.innerHTML;
    node.dataset.idType = 'const';
    node.dataset.mongoId = id;
    //  Then update other clients as changes may have occured meanwhile
    switch (type) {
      //  Articles
      case 'article':
        Sigma.socket.emit(Sigma.getChannelId, { action: 'update', mongoId: id, html: html, owner: Sigma.username });
        break;
      //  Images
      case 'image':
        node.src = Sigma.host+':'+Sigma.port+'/data/'+id;
        break;
    }
  };

  //  Assign a temporary id to manage new content
  Sigma.getTempId = function () {
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

  //  Listen changes sent by the server
  Sigma.listen = function () {
    Sigma.socket.on('broadcast', function (data) {
      Sigma.disconnectObservers();
      switch (data.action) {
        //  Add new content
        case 'create':
          Sigma.addContent(data.html, data.id);
          break;
        //  Update content
        case 'update':
          Sigma.updateContent(data.html, data.id);
          break;
        //  Delete content
        case 'delete':
          Sigma.deleteContent(data.id);
          break;
      }
      Sigma.makeReadonly();
      Sigma.setObservers();
    });
  };

  //  Disconnecting observers on demand
  Sigma.disconnectObservers = function () {
    Sigma.observers.forEach(function (observer) {
      observer.disconnect();
    });
    //  Remove eventListeners too for memory leaks!
    var data = document.querySelectorAll('[data-sigma]');
    for (var i = 0; i < data.length; ++i) {
      data[i].removeEventListener('focus', Sigma.contentEditing.editMode, true);
      data[i].removeEventListener('blur', Sigma.contentEditing.viewMode, true);
    }
  };

  //  History sent by the server
  Sigma.getHistory = function () {
    Sigma.socket.on('history', function (data) {
      if (data.empty) {
        var title = 'Welcome here pioneer!',
            content = 'It seems that you are the very first person on that channel.';
        if (Sigma.username !== undefined) {
          content += ' Please edit that content to make it yours!';
        } else {
          content += ' Please identify yourself!';
        }
        Sigma.addContent(false, undefined, title, content, Sigma.username || 'Sigma');
      } else {
        //  Populate main div with DOM content sent by the server
        data.documents.forEach(function (document) {
          Sigma.addContent(document.html, document._id);
        });
      }
      Sigma.makeReadonly();
      Sigma.highlightUserArticles();
      Sigma.setObservers();
    });
  };

  //  Try if localStorage is supported by the browser
  Sigma.tryLocalStorage = function () {
    if ('localStorage' in window) {
      var username = localStorage.getItem('username');
      if (username !== null) {
        //  Save username into the app
        Sigma.username = username;
        //  Add create button
        Sigma.addCreateButton();
        //  Welcome user
        Sigma.manageMessage(true, 'Hi '+Sigma.username+'! Nice to see you there!', true);
      } else {
        //  Provide a form to sign in and to sign up
        Sigma.signIn.init();
        Sigma.signUp.init();
        //  And enable user connection
        Sigma.userIsConnected();
      }
    } else {
      // !!!!!!!!!!!!!
    }
  };

  //  Manage a form to handle user sign-in process
  Sigma.signIn = {
    addForm : function () {
      //  Create the form
      var header = document.querySelector('header'),
          form = document.createElement('form'),
          usernameInput = document.createElement('input'),
          passwordInput = document.createElement('input');
      form.setAttribute('class', 'signIn');
      usernameInput.setAttribute('class', 'username');
      usernameInput.setAttribute('type', 'text');
      usernameInput.setAttribute('placeholder', 'username');
      passwordInput.setAttribute('class', 'password');
      passwordInput.setAttribute('type', 'password');
      passwordInput.setAttribute('placeholder', 'password');
      header.firstChild.lastChild.appendChild(form);
      form.appendChild(usernameInput);
      form.appendChild(passwordInput);
      //  Append it to the main objet
      Sigma.signIn.form = form;
    },
    keyUp : function (event) {
      var username = document.querySelector('.username').value,
          usernameLength = username.length,
          password = document.querySelector('.password').value,
          passwordLength = password.length,
          credentialsAreOk = (usernameLength >= 5 && passwordLength >= 5),
          toggleSubmitButtonVisibilityTo = function (state) {
            var buttonToRemove = document.querySelector('button[type=submit]');
            if (state) {
              if (!buttonToRemove) {
                var newButton = document.createElement('button');
                newButton.setAttribute('type', 'submit');
                newButton.appendChild(document.createTextNode('sign in | up'));
                Sigma.signIn.form.appendChild(newButton);
              }
            } else {
              if (!!buttonToRemove) {
                buttonToRemove.parentNode.removeChild(buttonToRemove);
              }
            }
          };
      if(credentialsAreOk) {
        //  Append username & password to the main objet
        Sigma.signIn.username = username;
        Sigma.signIn.password = password;
        //  Add submit button
        toggleSubmitButtonVisibilityTo(true);
        //  Remove message
        Sigma.manageMessage(false);
      } else {
        toggleSubmitButtonVisibilityTo(false);
        Sigma.manageMessage(true, 'Username & password must be 5 characters long!', false);
      }
    },
    submit : function (event) {
      event.preventDefault();
      Sigma.socket.emit('signIn', { username: Sigma.signIn.username, password: Sigma.signIn.password });
    },
    init : function () {
      this.addForm();
      this.form.addEventListener('keyup', this.keyUp, false);
      this.form.addEventListener('submit', this.submit, false);
    }
  };

  Sigma.signUp = {
    submit : function (event) {
      event.preventDefault();
      Sigma.socket.emit('signUp', { username: Sigma.signIn.username, password: Sigma.signIn.password });
    },
    init : function () {
      Sigma.socket.on('signUp', function (data) {
        Sigma.manageMessage(true, 'Unknown username! Want to sign up as '+data.username+'?', true);
        //  Update submit button
        var button = document.querySelector('button');
        button.innerText = 'sign up';
        button.classList.add('signUp');
        Sigma.signIn.form.removeEventListener('submit', Sigma.signIn.submit, false);
        Sigma.signIn.form.addEventListener('submit', Sigma.signUp.submit, false);
      });
    }
  };

  //  Manage user connection
  Sigma.userIsConnected = function () {
    Sigma.socket.on('isConnected', function (data) {
      //  Remove form
      var form = document.querySelector('.signIn');
      //  Change nav layout
      form.parentNode.removeChild(form);
      //  Save username into the app
      Sigma.username = data.username;
      //  Try to use localStorage
      if (window.localStorage) {
        localStorage.setItem('username', Sigma.username);
      }
      //  Add create button
      Sigma.addCreateButton();
      //  Highlight user's articles
      Sigma.highlightUserArticles();
      //  Then welcome user
      Sigma.manageMessage(true, 'Hi '+Sigma.username+'! Nice to see you there!', true);
    });
  };

  Sigma.highlightUserArticles = function () {
    var selector = '[data-owner="' + Sigma.username + '"]',
        articles = document.querySelectorAll(selector),
        highlight = function (i) {
          articles[i].parentNode.classList.add('isYours');
        };
    for (var i = 0; i < articles.length; ++i) {
      highlight(i);
    }
  };

  //  Hide or show a message on top header
  Sigma.manageMessage = function (action, message, type) {
    var currentMessage = document.querySelector('span[class$=Message]'),
        messageClass = type ? 'confirmationMessage' : 'alertMessage',
        deleteMessage = function () {
          if (currentMessage) {
            currentMessage.parentNode.removeChild(currentMessage);
          }
        },
        updateOrCreateMessage = function () {
          if (currentMessage) {
            //  Update message
            currentMessage.setAttribute('class', messageClass);
            currentMessage.innerHTML = message;
          } else {
            //  Create new message
            var newMessage = document.createElement('span');
            newMessage.setAttribute('class', messageClass);
            newMessage.appendChild(document.createTextNode(message));
            //  Push changes to DOM
            var header = document.querySelector('header');
            header.appendChild(newMessage);
            //  Add click event to remove it
            newMessage.addEventListener('click', function(event) {
              var _this = this,
                  animationsEnd = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'],
                  removeMessage = function () {
                    _this.parentNode.removeChild(_this);
                    animationsEnd.forEach(function (animationEnd) {
                      _this.removeEventListener(animationEnd, removeMessage, false);
                    });
                  };
              this.classList.add('removeMessage');
              // Cross-browser event listeners
              animationsEnd.forEach(function (animationEnd) {
                _this.addEventListener(animationEnd, removeMessage, false);
              });
            }, false);
          }
        };
    if (action) {
      updateOrCreateMessage();
    } else {
      deleteMessage();
    }
  };

  //  Receive message through websockets
  Sigma.getSocketMessage = function () {
    Sigma.socket.on('socketMessage', function (data) {
      Sigma.manageMessage(true, data.message, data.type);
    });
  };

  //  Manage save state of articles
  Sigma.saveManager = {
    pool : [],
    init : function () {
      //  Receive save state
      Sigma.socket.on('saveState', function (data) {
        if (data.tempId !== undefined) {
          Sigma.saveManager.toggleState(data.tempId, data.state);
        } else {
          if (data.id !== undefined) {
            Sigma.saveManager.toggleState(data.id, data.state);
          }
        }
      });
    },
    add : function (id, state) {
      var index = this.find(id);
      if (index === null) {
        this.pool.push([id, state]);
      } else {
        this.pool[index][1] = state;
      }
    },
    find : function (id) {
      var selectIds = function (row) {
        return row[0];
      },
          index = this.pool.map(selectIds).indexOf(id);
      return index !== -1 ? index : null;
    },
    showSaveState : function () {
      console.log('S A V E D !!!');
    },
    toggleId : function (tempId, id) {
      //  Replace temporary id with new mongoDB id in pool
      var index = this.find(tempId);
      if (index !== null) {
        this.pool[index][0] = id;
      }
    },
    toggleState : function (id, state) {
      //  Change state
      var index = this.find(id);
      if (index !== null) {
        this.pool[index][1] = state;
        this.showSaveState();
      }
    }
  };

  //  Load components of the app when DOM is ready
  Sigma.ready = (function () {
    var componentsToLoad = function () {
      Sigma.getChannelId();
      Sigma.getMongoId();
      Sigma.getHistory();
      Sigma.setObservers();
      Sigma.getSocketMessage();
      Sigma.saveManager.init();
      Sigma.tryLocalStorage();
      Sigma.preventPasting();
      Sigma.dragAndDrop();
    };
    document.addEventListener('DOMContentLoaded', componentsToLoad, false );
  }());

}).call(this);