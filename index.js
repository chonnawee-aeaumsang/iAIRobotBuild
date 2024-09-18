const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "7498251188:AAECbgh7W7hw4ZPzXtFROS-2xOTuMgolxEk"; // Replace with your bot token
const webhookUrl = "https://i-ai-robot-build.vercel.app/api/webhook"; // This should match your deployed function URL

const bot = new TelegramBot(TOKEN, { polling: false });

bot.setWebHook(webhookUrl).then(() => {
    console.log("Webhook set successfully.");
}).catch(err => {
    console.error("Error setting webhook:", err);
});

