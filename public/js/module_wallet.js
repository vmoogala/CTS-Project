var modWallet = {};

modWallet.AddMoneyToWallet = function() {
  console.log("modWallet.AddMoneyToWallet");

  var amount = $('#amount').val();

  $.ajax({
    type: "POST",
    dataType: 'json',
    url: constants.service_url + "wallet/addMoneyToWallet",
    data: {
      "amount": $('#amount').val()
    },
    success: function(response) {
      if (response.status == 200 && response.error == null && response.response == "success") {
        alert("amount has been successfully added");
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });
};