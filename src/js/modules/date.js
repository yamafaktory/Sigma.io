//  Sigma.date module

//  Date generator
module.exports = {
  //  Formated date
  now : function () {
    var currentDate = new Date(),
        hours = currentDate.getHours(),
        minutes = currentDate.getMinutes(),
        meridiem;
    //  Set meridiem and hours format
    if (hours < 12) {
      meridiem = 'am';
    } else {
      meridiem = 'pm';
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