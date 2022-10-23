require("dotenv").config();
const TelegramAPI = require("node-telegram-bot-api");
const bot = new TelegramAPI(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});
const { CMD_TEXT } = require("./consts");

const { KeyboardOption, VariantSearhTaxi, CallOperaot } = require("./options");

bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" }
]);

const searchAddress = (chatID, info, userName, type) => {
  const number = info.toString().match(/\d{10,12}/g);
  const address = info.toString().match(/\W+\d{1,2}/);
  const time = info.toString().match(/\d{0,2}:\d{0,2}/);
  const order = `❗️ Нове замовлення ❗️\nТип: ${
    time === null && address === null
      ? "Запит на дзвінок від оператора"
      : time === null && address !== null
      ? "За адресою"
      : time !== null && "За адресою та часом"
  }\nНомер телефону замовника: ${number}\nИмя замовника: ${userName}\n${
    address && "Aдреса:" + address?.toString().trimStart()
  }\nЧас:${time !== null ? time.toString().trim() : ""}`;

  // return bot.sendMessage(process.env.ID_OPERATOR, order);
};

const start = async () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;
    const userName = msg.chat.first_name;
    console.log(userName, chatID);
    try {
      if (text === "/start") {
        return bot.sendMessage(chatID, CMD_TEXT.description, KeyboardOption);
      }
      if (/\d[10-12]\w+\d{2}/g.test(text) !== false) {
        searchAddress(chatID, text, userName, "Авто за адресою");
        return bot.sendMessage(chatID, CMD_TEXT.waitCallOperator);
      }
      if (/\d{10,12}/g.test(text) !== false) {
        searchAddress(chatID, "", userName, "Запит на дзвінок від оператора");
        return bot.sendMessage(chatID, CMD_TEXT.waitCallOperator);
      }
      if (/\d[0-10]\w+\d{2}\d{2}:\d{2}/g.test(text) !== false) {
        searchAddress(chatID, text, userName, "Авто за адресою і часом ");
        return bot.sendMessage(chatID, CMD_TEXT.waitCallOperator);
      }
    } catch (e) {
      console.log(`ОШИБКА-${e}`);
    }
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatID = msg.message.chat.id;

  if (data === "searchTaxi")
    return bot.sendMessage(chatID, CMD_TEXT.selectVariant, VariantSearhTaxi);
  if (data === "searchTaxiWithAddress")
    return bot.sendMessage(chatID, CMD_TEXT.writeAddress);
  if (data === "searchTaxiReplyCall")
    return bot.sendMessage(chatID, CMD_TEXT.writeNumber);
  if (data === "searchTaxiAnTime")
    return bot.sendMessage(chatID, CMD_TEXT.writeAddressAndTime);
  else if (data.message) return bot.sendMessage(chatID, "ook");
});

start();
