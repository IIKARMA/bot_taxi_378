require("dotenv").config();
const { CMD_TEXT } = require("./consts");

module.exports = {
  KeyboardOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: CMD_TEXT.searchTaxi, callback_data: "searchTaxi" }],
        [
          {
            text: CMD_TEXT.searchTaxiReplyCall,
            callback_data: "searchTaxiReplyCall"
          }
        ]
      ]
    })
  },
  VariantSearhTaxi: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: CMD_TEXT.searchTaxiWithAddress,
            callback_data: "searchTaxiWithAddress"
          }
        ],
        [{ text: CMD_TEXT.searchTaxiAnTime, callback_data: "searchTaxiAnTime" }]
      ]
    })
  },
  CallOperaot: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: CMD_TEXT.searchTaxiReplyCall,
            callback_data: "reaplyCall"
          }
        ]
      ]
    })
  }
};
