var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
var db = require('../db_connection');
var request = require('request');

router.post('/ApplicationStatusMonitor/', function(req, res, next) {
  if (req.body) { //&& req.session.userName
    console.log(req.body);
    var data = req.body;

    if (data.application_id && data.VIN) {

      db.query('select * from applications where application_id = ?;', data.application_id, function(error, results, fields) {
        if (error) {
          console.log(error);
          utilities.sendResponse(error, null, 500, res);
        } else {
          // utilities.sendResponse(null, "success", 200, res);
          if (results.length == 0) {
            utilities.sendResponse(error, null, 500, res);
          } else {
            if (data.status == "accept") {
              var params = [results[0].user_id, results[0].VIN, results[0].vehicle_class_type];
              db.query('insert into vehicle_info (user_id, vehicle_VIN, vehicle_class_type) values (?, ?, ?)', params, function(error, results, fields) {
                if (error) {
                  console.log(error);
                  utilities.sendResponse(error, null, 500, res);
                } else {
                  // utilities.sendResponse(null, "success", 200, res);
                  var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
                  var params = [timestamp, data.application_id];
                  db.query('update applications set status = "approved", status_date = ? where application_id = ?', params, function(error, results, fields) {
                    if (error) {
                      console.log(error);
                      utilities.sendResponse(error, null, 500, res);
                    } else {
                      utilities.sendResponse(null, "success", 200, res);
                    }
                  });
                }
              });
            } else {
              var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
              var params = [timestamp, data.application_id];
              db.query('update applications set status = "rejected", status_date = ? where application_id = ?', params, function(error, results, fields) {
                if (error) {
                  console.log(error);
                  utilities.sendResponse(error, null, 500, res);
                } else {
                  utilities.sendResponse(null, "success", 200, res);
                }
              });
            }

          }

        }
      });
    }
  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


module.exports = router;