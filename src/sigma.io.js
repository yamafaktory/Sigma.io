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
  Sigma.ConnectOrCreateButton = function (type) {
    //  Connect is true | Create is false
    var addButton = function (type) {
      var header = document.querySelector('header'),
          button = document.createElement('a'),
          buttonSpan = document.createElement('span');
      button.setAttribute('href', '#');
      button.setAttribute('class', type);
      header.firstChild.lastChild.appendChild(button);
      button.appendChild(buttonSpan);
      buttonSpan.appendChild(document.createTextNode(type));
      button.addEventListener('click', function (event) {
        if (type === 'connect') {
          //  Add aside element with form into the DOM
          Sigma.signIn.init();
          Sigma.signUp.init();
        } else {
          var title = 'An editable title!',
              content = 'Here goes the content of your lovely article. You can directly drag & drop images here!';
          Sigma.disconnectObservers();
          Sigma.addContent(false, undefined, title, content, Sigma.username);
          Sigma.setObservers();
        }
      }, false);
    },
      removeButton = function (type) {
        var selector = '.'+type,
            button = document.querySelector(selector);
        if (button !== null) {
          button.parentNode.removeChild(button);
        }
      };
    if (type) {
      removeButton('create');
      addButton('connect');
    } else {
      removeButton('connect');
      addButton('create');
    }
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
    var resize = function (image, small) {
      var renderedCanvas = document.createElement('canvas'),
          renderedContext = renderedCanvas.getContext('2d'),
          data;
      if (small) {
        var circleDiameter = 120,
            templateCanvas = document.createElement('canvas'),
            templateContext = templateCanvas.getContext('2d'),
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight;
        //  Manage it as a square
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
        //  Data to return in png format
        data = renderedCanvas.toDataURL('image/png');
      } else {
        //  Large image
        var maxHeight = 400,
            maxWidth = 800;
        if (image.width > maxWidth) {
          image.height *= (maxWidth / image.width);
          image.width = maxWidth;
        }
        if (image.height > maxHeight) {
          image.width *= (maxHeight / image.height);
          image.height = maxHeight;
        }
        renderedCanvas.width = image.width;
        renderedCanvas.height = image.height;
        renderedContext.clearRect(0, 0, renderedCanvas.width, renderedCanvas.height);
        renderedContext.drawImage(image, 0, 0, image.width, image.height);
        //  Data to return in jpg format
        data = renderedCanvas.toDataURL('image/jpeg', 0.7);
      }
      //  Then return generated data
      return data;
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
            //  Create new image into the DOM
            var mongoId = Sigma.getTempId(),
                appWidth = document.querySelector('[data-app-width]').dataset.appWidth,
                source,
                smallImage = resize(image, true),
                largeImage = resize(image, false);
            newImage.dataset.image = 'dropped';
            newImage.dataset.idType = 'tmp';
            newImage.dataset.mongoId = mongoId;
            if (appWidth === 'small') {
              //source = smallImage;
              newImage.dataset.imageWidth = 'small';
            } else {
              //source = largeImage;
              newImage.dataset.imageWidth = 'large';
            }
            //  Save new image source
            Sigma.storeImage(mongoId, smallImage, largeImage);
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
  Sigma.storeImage = function (tempId, smallImage, largeImage) {
    Sigma.socket.emit('storeImage', { tempId: tempId, smallImage: smallImage, largeImage: largeImage });
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

  //  Simulate width observer with animationStart event for responsive image
  Sigma.observeWidth = function () {
    var appWidth = document.querySelector('[data-app-width]'),
        animationsStart = ['animationstart', 'webkitAnimationStart', 'MSAnimationStart', 'oAnimationStart'],
        responsiveImages,
        changeWidth = function (i) {
          //  Change data attribute
          responsiveImages[i].dataset.imageWidth = appWidth.dataset.appWidth;
          //  And inject source
          var source = Sigma.host+':'+Sigma.port+'/data/'+responsiveImages[i].dataset.mongoId+'/'+appWidth.dataset.appWidth;
          responsiveImages[i].setAttribute('src', source);
        },
        getWidth = function () {
          //  Retrieve content from var::after and set it as [data-app-width]
          var content = window.getComputedStyle(appWidth, ':after').getPropertyValue('content');
          //  Little hack for Firefox which adds double quotes
          appWidth.dataset.appWidth = content.replace(/\"/g, "");
          //  Adapt responsive images to screen
          responsiveImages = document.querySelectorAll('[data-image-width]');
          for (var i = 0; i < responsiveImages.length; ++i) {
            changeWidth(i);
          }
        };
    //  Cross-browser event listeners
    animationsStart.forEach(function (animationStart) {
      appWidth.addEventListener(animationStart, getWidth, false);
    });
    //  First init
    getWidth();
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
            //  For each mutation into the DOM, sync content server-side
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
        mongoId,
        tools,
        articleHTML,
        images,
        makeNeutral = function (i) {
          //  Reset image's source
          images[i].removeAttribute('src');
          //  Remove responsive data
          images[i].removeAttribute('[data-image-width]');
        };
    //  Inject article into empty clone
    articleFragment.appendChild(articleClone);
    //  Select tools into the clone
    tools = articleFragment.querySelector('.tools');
    //  Then remove it if present
    if ( tools !== null) {
      tools.parentNode.removeChild(tools);
    }
    //  Convert it
    articleHTML = articleFragment.querySelector('[data-structure="article"]').innerHTML;
    //  Make responsives images neutral
    images = articleFragment.querySelectorAll('[data-image-width]');
    for (var i = 0; i < images.length; ++i) {
      makeNeutral(i);
    }
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
        //  Populate main div with the DOM content sent by the server
        data.documents.forEach(function (document) {
          Sigma.addContent(document.html, document._id);
        });
      }
      Sigma.makeReadonly();
      Sigma.highlightUserArticles();
      Sigma.setObservers();
      Sigma.observeWidth();
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
        Sigma.ConnectOrCreateButton(false);
        //  Welcome user
        Sigma.manageMessage(true, 'Hi '+Sigma.username+'! Nice to see you there!', true);
      } else {
        //  Provide a form to sign in and to sign up
        Sigma.ConnectOrCreateButton(true);
        //  Add Hero SVG section
        Sigma.addHeroSVG();
        //  Enable user connection
        Sigma.userIsConnected();
      }
    } else {
      // !!!!!!!!!!!!!
    }
  };

  Sigma.addHeroSVG = function () {
    var body = document.querySelector('body'),
        main = document.querySelector('main'),
        hero = document.createElement('section'),
        title = document.createElement('h1');
    body.insertBefore(hero, main);
    hero.setAttribute('class', 'hero');
    hero.appendChild(title);
    title.appendChild(document.createTextNode('Create and share data in true real-time.'));
  };

  //  Manage a form to handle user sign-in process
  Sigma.signIn = {
    addForm : function () {
      //  Create the form
      var header = document.querySelector('header'),
          body = document.querySelector('body'),
          aside = document.createElement('aside'),
          form = document.createElement('form'),
          usernameDiv = document.createElement('div'),
          passwordDiv = document.createElement('div'),
          usernameLabel = document.createElement('label'),
          passwordLabel = document.createElement('label'),
          usernameInput = document.createElement('input'),
          passwordInput = document.createElement('input'),
          usernameSpan = document.createElement('span'),
          passwordSpan = document.createElement('span'),
          cancelButton = document.createElement('button'),
          disableMouseWheelOrTouchMove = function (event) {
            event.preventDefault();
          },
          returnHome = function (event) {
            //  Remove aside
            aside.parentNode.removeChild(aside);
            //  Make body scrollable
            body.classList.remove('noScroll');
            //  Remove listeners
            body.removeEventListener('mousewheel', disableMouseWheelOrTouchMove, false);
            body.removeEventListener('touchmove', disableMouseWheelOrTouchMove, false);
          };
      form.setAttribute('class', 'signIn');
      form.setAttribute('data-validation', 'Username and password must be 6 characters long with no white space! Password must contain at least 1 digit!');
      usernameDiv.setAttribute('class', 'usernameUberInput');
      passwordDiv.setAttribute('class', 'passwordUberInput');
      usernameInput.setAttribute('class', 'username');
      usernameInput.setAttribute('type', 'text');
      usernameInput.setAttribute('placeholder', 'Username');
      usernameInput.setAttribute('autofocus', '');
      passwordInput.setAttribute('class', 'password');
      passwordInput.setAttribute('type', 'password');
      passwordInput.setAttribute('placeholder', 'Password');
      usernameSpan.setAttribute('id', 'usernameInputState');
      passwordSpan.setAttribute('id', 'passwordInputState');
      cancelButton.setAttribute('type', 'button');
      cancelButton.setAttribute('class', 'cancel');
      cancelButton.appendChild(document.createTextNode('cancel'));
      //  Remove scrolling
      body.classList.toggle('noScroll');
      //  Append it to the DOM
      body.insertBefore(aside, body.firstChild);
      aside.appendChild(form);
      form.appendChild(usernameDiv);
      form.appendChild(passwordDiv);
      usernameDiv.appendChild(usernameLabel);
      usernameDiv.appendChild(usernameInput);
      usernameDiv.appendChild(usernameSpan);
      passwordDiv.appendChild(passwordLabel);
      passwordDiv.appendChild(passwordInput);
      passwordDiv.appendChild(passwordSpan);
      form.appendChild(cancelButton);
      //  Append it to the main objet
      Sigma.signIn.form = form;
      //  Temporary disable wheel and touch
      body.addEventListener('mousewheel', disableMouseWheelOrTouchMove, false);
      body.addEventListener('touchmove', disableMouseWheelOrTouchMove, false);
      cancelButton.addEventListener('click', returnHome, false);
    },
    checkForm : function (event) {
      var form = document.querySelector('form'),
          username = document.querySelector('.username').value,
          password = document.querySelector('.password').value,
          usernameSpan = document.querySelector('#usernameInputState'),
          passwordSpan = document.querySelector('#passwordInputState'),
          //  Username regex with length > 6 and no white space
          usernameRegex = new RegExp('^\\S{6,}$'),
          usernameIsOk = usernameRegex.test(username),
          //  Password regex with length > 6, no white space and at least one digit
          passwordRegex = new RegExp('^(?=.*\\d)\\S{6,}$'),
          passwordIsOk = passwordRegex.test(password),
          credentialsAreOk = usernameIsOk && passwordIsOk,
          validationMessage = '',
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
        //  Show that inputs are valid
        usernameSpan.className = passwordSpan.className = 'isOk';
        //  Remove previous validation message
        Sigma.manageMessage(false);
        //  Add submit button
        toggleSubmitButtonVisibilityTo(true);
      } else {
        //  Show inputs validity
        if (usernameIsOk) {
          if (username !== '') {
            usernameSpan.className = 'isOk';
          } else {

          }
        } else {
          if (username !== '') {
            validationMessage += 'Username must be at least 6 characters long!';
            usernameSpan.className = 'isErroneous';
          } else {
            usernameSpan.className = '';
          }
        }
        if (passwordIsOk) {
          if (password !== '') {
            passwordSpan.className = 'isOk';
          }
        } else {
          if (password !== '') {
            if (validationMessage !== '') {
              validationMessage += ' ';
            }
            validationMessage += 'Password must be at least 6 characters long with one digit!';
            passwordSpan.className = 'isErroneous';
          } else {
            passwordSpan.className = '';
          }
        }
        //  Show message
        if (validationMessage !== '') {
          Sigma.manageMessage(true, validationMessage, false);
        } else {
          Sigma.manageMessage(false);
        }
        //  Remove submit button
        toggleSubmitButtonVisibilityTo(false);
      }
    },
    submit : function (event) {
      event.preventDefault();
      Sigma.socket.emit('signIn', { username: Sigma.signIn.username, password: Sigma.signIn.password });
    },
    init : function () {
      this.addForm();
      this.form.addEventListener('input', this.checkForm, false);
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
        var button = document.querySelector('button[type=submit]');
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
      //  Remove aside
      var aside = document.querySelector('aside');
      aside.parentNode.removeChild(aside);
      //  Save username into the app
      Sigma.username = data.username;
      //  Try to use localStorage
      if (window.localStorage) {
        localStorage.setItem('username', Sigma.username);
      }
      //  Change nav layout
      Sigma.ConnectOrCreateButton(false);
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
            newMessage.innerHTML = message;
            //  Push changes to the DOM
            var body = document.querySelector('body');
            body.appendChild(newMessage);
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

  //  Load components of the app when the DOM is ready
  Sigma.ready = (function () {
    var componentsToLoad = function () {
      Sigma.getChannelId();
      Sigma.getMongoId();
      Sigma.getHistory();
      Sigma.getSocketMessage();
      Sigma.saveManager.init();
      Sigma.tryLocalStorage();
      Sigma.preventPasting();
      Sigma.dragAndDrop();
    };
    document.addEventListener('DOMContentLoaded', componentsToLoad, false );
  }());

}).call(this);