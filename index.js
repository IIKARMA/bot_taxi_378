require("dotenv").config();
const TelegramAPI = require("node-telegram-bot-api");
const { isNull } = require("util");
const bot = new TelegramAPI(process.env.TELEGRAM_BOT_TOKEN, {
	polling: true,
});
const { match } = require("assert");
const { KeyboardOption, GetContact } = require("./options");

const { CMD_TEXT } = require("./consts");

bot.setMyCommands([
	{ command: "/start", description: "Начальное приветствие" },
]);

function start() {
	bot.onText(new RegExp(/\s||\S\w+\d+/g), async (msg, _match) => {
		const message = msg.text;
		if (_match.input === "/start")
			return bot.sendMessage(msg.chat.id, CMD_TEXT.description, GetContact);
		else if (_match.input.match(/\w+\d{1,3}/)) {
			if (this.contact !== undefined) {
				await bot.sendMessage(
					process.env.ID_OPERATOR,
					`Нове замовлення \n Ім"я: ${this.contact.first_name}\nНомер телефону: ${this.contact.phone_number}\nAдреса: ${_match.input}`
				);
				await bot.sendMessage(msg.chat.id, CMD_TEXT.waitCallOperator);
			}
		} else return bot.sendMessage(msg.chat.id, CMD_TEXT.undefinedContact);
	});
	bot.on("contact", (msg) => {
		try {
			this.contact = msg.contact;
			return bot.sendMessage(
				msg.from.id,
				`✅ Прийнято\n  ${CMD_TEXT.selectVariant}`,
				KeyboardOption
			);
		} catch (e) {
			console.log(`ОШИБКА-${e}`);
		}
	});
	bot.on("callback_query", async (msg) => {
		try {
			if (msg.data === "searchTaxi")
				return bot.sendMessage(msg.from.id, CMD_TEXT.writeAddress, {
					parse_mode: "HTML",
				});
			else if (msg.data === "searchTaxiReplyCall") {
				this.contact.phone_number
					? await bot.sendMessage(
							process.env.ID_OPERATOR,
							`Нове замовлення \n Ім"я: ${this.contact.first_name}\nНомер телефону: ${this.contact.phone_number}`
					  )
					: await bot.sendMessage(msg.chat.id, CMD_TEXT.waitCallOperator);

				return bot.sendMessage(msg.from.id, CMD_TEXT.waitCallOperator);
				//   bot.sendMessage(msg.from.id, CMD_TEXT.undefinedContact, GetContact);
			}
		} catch (error) {
			console.log(`ОШИБКА-${error}`);
		}
	});
}

start();
