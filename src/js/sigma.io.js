//  Sigma.io

//  (c) 2013 Davy Duperron
//  Client side

(function () {

  'use strict';

  //  Reference to global object and main app
  var root = window,
      Sigma = root.Sigma = {};

  //  App host:port
  Sigma.host = 'http://192.168.0.1';
  Sigma.port = 1337;

  //  Socket.io connection on node server
  Sigma.socket = io.connect(Sigma.host);

  //  Load modules
  Sigma.clickAndTouchListener = require('./modules/clickAndTouchListener.js');
  Sigma.mouseWheelAndTouchMove = require('./modules/mouseWheelAndTouchMove.js');
  Sigma.connectOrCreateButton = require('./modules/connectOrCreateButton.js');
  Sigma.date = require('./modules/date.js');
  Sigma.addContent = require('./modules/addContent.js');
  Sigma.updateContent = require('./modules/updateContent.js');
  Sigma.deleteContent = require('./modules/deleteContent.js');
  Sigma.preventPasting = require('./modules/preventPasting.js');
  Sigma.dragAndDrop = require('./modules/dragAndDrop.js');
  Sigma.storeImage = require('./modules/storeImage.js');
  Sigma.loadResponsiveImages = require('./modules/loadResponsiveImages.js');
  Sigma.asyncUserAndHistoryState = require('./modules/asyncUserAndHistoryState.js');
  Sigma.makeOwnerArticlesEditable = require('./modules/makeOwnerArticlesEditable.js');
  Sigma.observeWidth = require('./modules/observeWidth.js');
  Sigma.tools = require('./modules/tools.js');
  Sigma.setObservers = require('./modules/setObservers.js');
  Sigma.droppedImages = require('./modules/droppedImages.js');
  Sigma.simpleCounter = require('./modules/simpleCounter.js');
  Sigma.synchronize = require('./modules/synchronize.js');
  Sigma.contentEditing = require('./modules/contentEditing.js');
  Sigma.getChannelId = require('./modules/getChannelId.js');
  Sigma.getMongoId = require('./modules/getMongoId.js');
  Sigma.changeId = require('./modules/changeId.js');
  Sigma.getTempId = require('./modules/getTempId.js');
  Sigma.listen = require('./modules/listen.js');
  Sigma.disconnectObservers = require('./modules/disconnectObservers.js');
  Sigma.getHistory = require('./modules/getHistory.js');
  Sigma.tryLocalStorage = require('./modules/tryLocalStorage.js');
  Sigma.heroHeader = require('./modules/heroHeader.js');
  Sigma.navigation = require('./modules/navigation.js');
  Sigma.animationListener = require('./modules/animationListener.js');
  Sigma.signIn = require('./modules/signIn.js');
  Sigma.signUp = require('./modules/signUp.js');
  Sigma.userIsConnected = require('./modules/userIsConnected.js');
  Sigma.resetAndHighlightUserArticles = require('./modules/resetAndHighlightUserArticles.js');
  Sigma.manageMessage = require('./modules/manageMessage.js');
  Sigma.getSocketMessage = require('./modules/getSocketMessage.js');
  Sigma.saveManager = require('./modules/saveManager.js');
  Sigma.isOnLine = require('./modules/isOnLine.js');

  //  Load components of the app when the DOM is ready
  Sigma.ready = (function () {
    var componentsToLoad = function () {
      Sigma.observeWidth();
      Sigma.getChannelId();
      Sigma.getMongoId();
      Sigma.getHistory();
      Sigma.tryLocalStorage.init();
      Sigma.getSocketMessage();
      Sigma.saveManager.init();
      Sigma.preventPasting();
      Sigma.dragAndDrop();
    };
    document.addEventListener('DOMContentLoaded', componentsToLoad, false );
  }());

}).call(window);