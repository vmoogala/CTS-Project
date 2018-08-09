var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
var db = require('../db_connection');
const uuidv4 = require('uuid/v4');
var request = require('request');


router.get('/getAllVehicles', function(req, res, next) {
  console.log("/getAllVehicles");
  if (req.session.userName) {
    db.query('select * from vehicle_info where user_id = (select user_id from user_info where user_name = ?);', [req.session.userName], function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        if (results.length > 0) {
          console.log("success");
          utilities.sendResponse(null, results, 200, res);
        } else {
          utilities.sendResponse(null, "no vehicles found", 200, res);
        }
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


router.post('/addAVehicle/', function(req, res, next) {
  console.log('/addAVehicle/');
  if (req.body && req.session.userName) {
    console.log(req.body);
    var data = {
      "applicationId": uuidv4(),
      "vin": req.body.vin,
      "vehicleClass": req.body.vehicleClass,
      "applicantName": req.session.userName,
      "userId": req.session.userId,
    };
    console.log(data);
    request({
        url: "http://0.0.0.0:3001/users/userAuthenticate/",
        method: "POST",
        json: true,
        body: {
          "userName": "PortalAPI",
          "userPassword": "PortalAPI"
        }
      },
      function(error, response, body) {
        if (error == null) {
          console.log(body);
          if (body.error == null && body.status == 200 && body.response == "success") {
            console.log("login in verification portal success");
            request({
                url: "http://0.0.0.0:3001/CtsPortalApi/addNewVehicleRequest/",
                method: "POST",
                json: true,
                body: data
              },
              function(error, response, body) {
                if (error == null) {
                  console.log(body);
                  if (body.error == null && body.status == 200 && body.response == "success") {
                    console.log("call verification url success");
                    // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
                    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    var params = [data.applicationId, data.vin, data.vehicleClass, data.applicantName, timestamp, data.userId];
                    db.query('insert into applications (application_id, VIN, vehicle_class_type, applicant_name, applied_date, user_id) values (?, ?, ?, ?, ?, ?)', params, function(error, results, fields) {
                      if (error) {
                        console.log(error);
                        utilities.sendResponse(error, null, 500, res);
                      } else {
                        utilities.sendResponse(null, "success", 200, res);
                      }
                    });
                  } else {
                    console.log("error-->" + error);
                    utilities.sendResponse(error, null, 500, res);
                  }
                }
              }
            );
          } else {
            console.log("error-->" + error);
            utilities.sendResponse(error, null, 500, res);
          }
        }
      }
    );
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


router.get('/getAllRequests', function(req, res, next) {
  console.log('/getAllRequests');
  if (req.session.userName) {
    db.query('select * from applications where user_id = ?;', [req.session.userId], function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        // console.log(results);
        if (results.length > 0) {
          utilities.sendResponse(null, results, 200, res);
        } else {
          utilities.sendResponse(null, "no vehicles found", 200, res);
        }
      }
    });
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


module.exports = router;