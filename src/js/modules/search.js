//  Sigma.search module

//  Search for channel
module.exports = function () {
  var searchButton = document.querySelector('#searchButton'),
      searchRegex = new RegExp('^\\w+$'),
      search = function () {
        var searchInput = document.querySelector('#searchInput').value;
        // Hard redirect if ok
        if (searchRegex.test(searchInput)) {
          window.location = Sigma.host + ':' + Sigma.port + '/' + searchInput;
        } else {
          // Send message
          Sigma.manageMessage(true, 'A channel should not contain white spaces and special characters!', false);
        }
      };
  //  Add listener on search button
  Sigma.clickAndTouchListener.add(searchButton, 'search', search);
};