const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "7498251188:AAFioqjyn9PD_5d6Zl6wawtuQCK_AgDLn34";
const gameName = "iAIRobotGame"; // Replace with your game's short name
const gameUrl = "https://i-ai-game-robot.vercel.app/"; // Your game URL

const bot = new TelegramBot(TOKEN, { polling: false });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const update = req.body;

        try {
            // Handle /start or /game command
            if (update.message && (update.message.text === '/start' || update.message.text === '/game')) {
                await bot.sendGame(update.message.from.id, gameName);
            }

            // Handle callback query for the Play button
            if (update.callback_query) {
                if (update.callback_query.game_short_name.toLowerCase() !== gameName.toLowerCase()) {
                    await bot.answerCallbackQuery(update.callback_query.id, `Sorry, '${update.callback_query.game_short_name}' is not available.`);
                } else {
                    await bot.answerCallbackQuery({
                        callback_query_id: update.callback_query.id,
                        url: gameUrl,
                    });
                }
            }

            // Ensure response is sent only once
            res.status(200).send('OK');
        } catch (error) {
            console.error('Error in processing update:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};

