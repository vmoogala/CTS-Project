var constants = {
  service_url: "http://0.0.0.0:3000/",
  localStorage: window.localStorage
};

var modApp = {};

modApp.logout = function() {
  console.log("modApp.logout");

  $.ajax({
    type: "GET",
    dataType: 'json',
    url: constants.service_url + "users/logout/",
    success: function(response) {
      if (response.status == 200 && response.error == null && response.response == "success") {
        alert("You have been successfully logged out");
        constants.localStorage.setItem("isLoggedIn", "false");
        window.location.href = "index.html";
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });

};


modApp.showLoader = function() {
  $("#loader").show();
};


modApp.hideLoader = function() {
  $("#loader").hide();
};


modApp.formatUTCTime = function(serverDate) {
  // dateTimeSplitted = serverDate.split(" ");
  // var utcTime = dateTimeSplitted[0] + "T" + dateTimeSplitted[1] + ".000Z";
  var localDate = new Date(serverDate);
  return localDate.toLocaleString();
}