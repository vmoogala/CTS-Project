var modAddVehicle = {};

modAddVehicle.addAVehicle = function() {
  console.log("modAddVehicle.addAVehicle");
  modApp.showLoader();
  $.ajax({
    type: "POST",
    dataType: 'json',
    url: constants.service_url + "vehicleRequests/addAVehicle",
    data: {
      "vin": $("#vin").val(),
      "vehicleClass": $("#vehicleClass").val(),
      "numberPlate": $("#numberPlate").val()
    },
    success: function(response) {
      modApp.hideLoader();
      console.log(response);
      // response = JSON.parse(response);
      if (response.status == 200 && response.error == null && response.response == "success") {
        alert("vehicle added successfully");
        window.location.href = "index.html";
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      modApp.hideLoader();
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });


  modAddVehicle.clearAddVehicleForm();
};

modAddVehicle.clearAddVehicleForm = function() {
  // TODO: clear fields
};

modAddVehicle.getAllVehicles = function() {
  console.log("modAddVehicle.getAllVehicles");
  modApp.showLoader();
  $.ajax({
    type: "GET",
    dataType: 'json',
    url: constants.service_url + "vehicleRequests/getAllVehicles",
    success: function(response) {
      console.log(response);
      modApp.hideLoader();
      // response = JSON.parse(response);
      if (response.status == 200 && response.error == null) {
        // TODO: format data
        modAddVehicle.formUIForAllVehicles(response.response);
        // $('#listAllVehicles').append("<pre>" + JSON.stringify(response.response) + "</pre>")
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      modApp.hideLoader();
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });

}

modAddVehicle.formUIForAllVehicles = function(response) {

  var htmlstring = "";

  for (var x = 0; x < response.length; x++) {
    htmlstring += '<tr> <th scope="row">' + (x + 1) + ' </th> \
      <td>' + response[x].vehicle_VIN + '</td><td>' + response[x].number_plate + '</td><td>' + response[x].vehicle_class_type + '</td></tr>'
  }

  $("#listAllVehicles").append(htmlstring);

}

modAddVehicle.getAllVehicles();