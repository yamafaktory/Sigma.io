//  Sigma.signUp module

//  Sign Up process
module.exports = {
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