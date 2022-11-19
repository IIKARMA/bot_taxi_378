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
						callback_data: "searchTaxiReplyCall",
					},
				],
			],
		}),
	},

	GetContact: {
		parse_mode: "Markdown",
		reply_markup: JSON.stringify({
			keyboard: [
				[
					{
						text: "Надати номер телефону",
						request_contact: true,
					},
				],
			],
			resize_keyboard: true,
		}),
	},
};
