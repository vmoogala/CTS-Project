var modWallet = {};

modWallet.AddMoneyToWallet = function() {
  console.log("modWallet.AddMoneyToWallet");

  var amount = $('#amount').val();
  modApp.showLoader();
  $.ajax({
    type: "POST",
    dataType: 'json',
    url: constants.service_url + "wallet/addMoneyToWallet",
    data: {
      "amount": $('#amount').val()
    },
    success: function(response) {
      modApp.hideLoader();
      if (response.status == 200 && response.error == null && response.response == "success") {
        alert("amount has been successfully added");
        modWallet.getCurrentWalletBalance();
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      modApp.hideLoader();
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });

};

modWallet.getCurrentWalletBalance = function() {
  console.log("modWallet.getCurrentWalletBalance");
  modApp.showLoader();
  $.ajax({
    type: "GET",
    dataType: 'json',
    url: constants.service_url + "wallet/getCurrentBalance",
    success: function(response) {
      modApp.hideLoader();
      console.log(response);
      // response = JSON.parse(response);
      if (response.status == 200 && response.error == null) {
        // TODO: format data
        $('#currentBalance').text("Current Balance : " + JSON.stringify(response.response[0].wallet_balance) + "$");
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

modWallet.getPaymentAmount = function() {
  var amount = parseFloat($("#amount").val());

  if (amount >= 0.01) {
    return amount;
  } else {
    return 10;
  }

  return "hello";
};

modWallet.getCurrentWalletBalance();