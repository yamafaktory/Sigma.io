//  Sigma.date module

//  Date generator
module.exports = {
  forDOM : function () {
    return new Date().toISOString();
  },
  forHuman : function (datetime) {
    var dateAndTime = datetime === undefined ? new Date() : new Date(datetime),
        dateAndTimeForHuman = dateAndTime.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"
        });
    return dateAndTimeForHuman;
  }
};