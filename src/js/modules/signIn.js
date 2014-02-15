//  Sigma.signIn module

//  Manage a form to handle user sign-in process
module.exports = {
  addForm : function () {
    //  Create the form
    var _this = this,
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
        returnHome = function (event) {
          var removeAside = function () {
            //  Remove from DOM at animation's end
            aside.parentNode.removeChild(aside);
          };
          // Cross-browser event listeners
          Sigma.animationListener(true, aside, removeAside, true);
          //  Launch aside slide animation
          aside.classList.add('removeAside');
          //  Make body scrollable again
          body.classList.remove('noScroll');
          //  Show nav again
          Sigma.navigation.show();
          //  Remove mousewheel and touchmove listeners
          Sigma.mouseWheelAndTouchMove.enable(body);
          //  Set visibility
          _this.isVisible = false;
          //  Remove unclosed message if present
          Sigma.manageMessage(false);
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
    Sigma.mouseWheelAndTouchMove.disable(body);
    Sigma.clickAndTouchListener.add(cancelButton, 'returnHome', returnHome);
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
    this.isVisible = true;
    this.addForm();
    this.form.addEventListener('input', this.checkForm, false);
    this.form.addEventListener('submit', this.submit, false);
  }
};