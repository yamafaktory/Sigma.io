//  Sigma.manageMessage module

//  Hide or show a message
module.exports = function (action, message, type) {
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
                removeMessage = function () {
                  _this.parentNode.removeChild(_this);
                };
            this.classList.add('removeMessage');
            // Cross-browser event listeners
            Sigma.animationListener(true, _this, removeMessage, true);
          }, false);
        }
      };
  if (action) {
    updateOrCreateMessage();
  } else {
    deleteMessage();
  }
};