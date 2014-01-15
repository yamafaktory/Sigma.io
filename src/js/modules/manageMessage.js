//  Sigma.manageMessage module

//  Hide or show a message
module.exports = function (action, message, type) {
  var currentMessage = document.querySelector('[data-message]'),
      messageType = type ? 'confirmation' : 'alert',
      deleteMessage = function () {
        if (currentMessage) {
          currentMessage.parentNode.removeChild(currentMessage);
        }
      },
      updateOrCreateMessage = function () {
        if (currentMessage) {
          //  Update message
          currentMessage.dataset.message = messageType;
          currentMessage.innerHTML = message;
        } else {
          //  Create new message
          var newMessage = document.createElement('span'),
              eraseMessage = function (event) {
                var target = event.target,
                    removeMessage = function () {
                      target.parentNode.removeChild(target);
                    };
                target.classList.add('removeMessage');
                // Cross-browser event listeners
                Sigma.animationListener(true, target, removeMessage, true);
              };
          newMessage.dataset.message = messageType;
          newMessage.innerHTML = message;
          //  If message is added when there's no navigation
          if (!Sigma.navigation.visibility) {
            newMessage.classList.add('withNoNavigation');
          }
          //  Push changes to the DOM
          var body = document.querySelector('body');
          body.appendChild(newMessage);
          //  Add click event
          Sigma.clickAndTouchListener.add(newMessage, 'eraseMessage', eraseMessage);
        }
      };
  if (action) {
    updateOrCreateMessage();
  } else {
    deleteMessage();
  }
};