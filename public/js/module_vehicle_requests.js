var modVehicleRequests = {};

modVehicleRequests.getAllRequests = function() {
  console.log("modVehicleRequests.getAllRequests");

  $.ajax({
    type: "GET",
    url: constants.service_url + "vehicleRequests/getAllRequests",
    success: function(response) {
      console.log(response);
      response = JSON.parse(response);
      if (response.status == 200 && response.error == null) {
        // TODO: format data
        console.log(response);
        modVehicleRequests.formUIForRequests(response.response);
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });
};


modVehicleRequests.formUIForRequests = function(data1) {
  var htmlstring = "";

  for (var x = 0; x < data1.length; x++) {
    htmlstring += '<tr> <th scope="row">' + (x + 1) + ' </th> \
      <td>' + data1[x].VIN + '</td><td>' + data1[x].number_plate + '</td><td>' + data1[x].applied_date + '</td>';

    if (data1[x].status == "submitted") {
      htmlstring += '<td> submitted </td> </tr>';
    } else {
      htmlstring += '<td>' + data1[x].status + ' on ' + data1[x].status_date + '</td> </tr>';
    }
  }

  $("#table_all_requests").append(htmlstring);

}

modVehicleRequests.getAllRequests();