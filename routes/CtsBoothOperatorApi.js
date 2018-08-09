var express = require('express');
var router = express.Router();
const utilities = require('../utilities');
var db = require('../db_connection');
var request = require('request');


function getAmountToBeDeducted(vehicle_class_type) {
  switch (vehicle_class_type) {
    case 1:
      return 1;
      break;
    case 2:
      return 2;
      break;
    case 3:
      return 3;
      break;
    case 4:
      return 4;
      break;
    case 5:
      return 5;
      break;
    default:
      return 1;
  }
}


router.post('/getVehicleBalance/', function(req, res, next) {
  if (req.body && req.body.numberPlate) {
    console.log(req.body);
    var data = req.body;
    // utilities.sendResponse(null, "success", 200, res);

    db.query('SELECT * FROM vehicle_info as a join user_wallet as b on a.user_id = b.user_id where a.number_plate = ?;', data.numberPlate, function(error, results, fields) {
      if (error) {
        console.log(error);
        utilities.sendResponse(error, null, 500, res);
      } else {
        if (results.length == 0) {
          utilities.sendResponse(error, null, 500, res);
        } else {
          var amountToBeDeducted = getAmountToBeDeducted(results[0].vehicle_class_type);
          if (parseFloat(results[0].wallet_balance) >= amountToBeDeducted) {
            var new_wallet_balance_for_deductee = parseFloat(results[0].wallet_balance) - amountToBeDeducted;
            var params = [new_wallet_balance_for_deductee, results[0].user_id];
            db.query('update user_wallet set wallet_balance = ? where user_id = ?', params, function(error, results, fields) {
              if (error) {
                console.log(error);
                utilities.sendResponse(error, null, 500, res);
              } else {
                var params1 = [data.walletIdReciever];
                db.query('select * from user_wallet where wallet_id = ?', params1, function(error, results, fields) {
                  if (error) {
                    console.log(error);
                    utilities.sendResponse(error, null, 500, res);
                  } else {
                    var new_wallet_balance_for_operator = parseFloat(results[0].wallet_balance) + amountToBeDeducted;
                    var params2 = [new_wallet_balance_for_operator, data.walletIdReciever];
                    db.query('update user_wallet set wallet_balance = ? where wallet_id = ?', params2, function(error, results, fields) {
                      if (error) {
                        console.log(error);
                        utilities.sendResponse(error, null, 500, res);
                      } else {
                        utilities.sendResponse(null, {
                          "status": "success",
                          "amount": amountToBeDeducted
                        }, 200, res);
                      }
                    });
                  }
                });
              }
            });
          } else {
            utilities.sendResponse("no money", null, 500, res);
          }
        }

      }
    });

  } else {
    utilities.sendResponse(null, null, 500, res);
  }
});


router.get('/getCurrentBalance/', function(req, res, next) {
  console.log('/getCurrentBalance');
  db.query('select wallet_balance, wallet_id from user_wallet where user_id = (select user_id from user_info where user_name = ?);', "macdonald", function(error, results, fields) {
    if (error) {
      console.log(error);
      utilities.sendResponse(error, null, 500, res);
    } else {
      utilities.sendResponse(null, results, 200, res);
    }
  });
});



module.exports = router;