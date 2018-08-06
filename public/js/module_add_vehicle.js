var modAddVehicle = {};

modAddVehicle.addAVehicle = function() {
  console.log("modAddVehicle.addAVehicle");

  $.ajax({
    type: "POST",
    dataType: 'json',
    url: constants.service_url + "vehicleRequests/addAVehicle",
    data: {
      "vin": $("#vin").val(),
      "vehicleClass": $("#vehicleClass").val()
    },
    success: function(response) {
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

  $.ajax({
    type: "GET",
    dataType: 'json',
    url: constants.service_url + "vehicleRequests/getAllVehicles",
    success: function(response) {
      console.log(response);
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
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });
}

modAddVehicle.formUIForAllVehicles = function(response) {

  var htmlstring = "";

  for (var x = 0; x < response.length; x++) {
    htmlstring += '<tr> <th scope="row">' + (x + 1) + ' </th> \
      <td>' + response[x].vehicle_VIN + '</td><td>' + response[x].vehicle_class_type + '</td></tr>'
  }

  $("#listAllVehicles").append(htmlstring);

}

modAddVehicle.getAllVehicles();