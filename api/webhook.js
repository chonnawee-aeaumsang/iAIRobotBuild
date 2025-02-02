const TelegramBot = require("node-telegram-bot-api");

const fs = require('fs');
const path = require('path');

// Paths
const announcementSentFile = path.join(__dirname, 'announcement_sent.json');

// Check if the announcement has been sent
let announcementSent = false;
if (fs.existsSync(announcementSentFile)) {
    const data = fs.readFileSync(announcementSentFile);
    const parsedData = JSON.parse(data);
    announcementSent = parsedData.sent;
}

const TOKEN = "7498251188:AAGYxE1L2aGuTXx-VdjQHZn9UQRSK6svJmw";
const gameName = "iAIGame"; // Replace with your game's short name
const gameUrl = "https://iai-robot.vercel.app/"; // Your game URL
const imageUrl = "https://imgur.com/a/tLemH6f"
const announceimageUrl = "https://imgur.com/a/xBPobO0";

const bot = new TelegramBot(TOKEN, { polling: false });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const update = req.body;

        try {
            //Handle /help command to provide a tutorial
            //if (update.message && update.message.text === '/help') {
            //const chatId = update.message.from.id;

            // Use the URL to the image hosted on Vercel
            //const helpImageUrl = "https://i-ai-robot-build.vercel.app/images/Tutorial1_converted.jpg";  // Replace with your actual Vercel URL

            // Send the image with a caption
            //await bot.sendPhoto(chatId, helpImageUrl, {
            //caption: `*Here’s how to play ${gameName}:*\n\n*You can start the game by typing \\/game or \\/start\\.*`,
            //parse_mode: 'MarkdownV2'  // Using MarkdownV2 with correct escaping
            //});
            //}


             // Handle /game command
             if (update.message && (update.message.text === '/game01')) {
                 const chatId = update.message.from.id;
                 const firstName = update.message.from.first_name;

                 //await bot.sendMessage(chatId, `Welcome, ${firstName}! Let's play ${gameName}.`);
                 await bot.sendGame(update.message.from.id, gameName);
             }

            // Handle /start
            if (update.message && (update.message.text === '/start')) {
                const chatId = update.message.from.id;
                const firstName = update.message.from.first_name;

                const option = {
                    reply_markup: {
                        keyboard: [
                            [{ text: '/announcement' }],
                        ],
                        resize_keyboard: true, 
                        one_time_keyboard: true 
                    }
                };

                // Escape necessary characters for MarkdownV2
                const welcomeMessage = `Ready for the Swiping Challenge?

🔥 <b>The iAI Robot Game is LIVE!</b> 🔥  
Swipe, collect iAI tokens, and compete for big rewards!

🕹 <b>How to Play:</b>  
• <b>Swipe & Collect</b> – Start with 1,000 energy units and earn iAI coins!  
• <b>Upgrade Your Core</b> – Boost energy for higher rewards!  
• <b>Climb the Leaderboard</b> – Compete for top prizes!  
• <b>Daily Missions</b> – Complete tasks for bonus coins & perks!  

🎁 <b>Rewards:</b>  
• Earn iAI tokens every play!  
• Complete quests for extra bonuses!  
• <b>ALL players share $iAI Tokens</b> (Details in the Snapshot Event!)

🔥 Hit <b>"Play Game 🎮"</b> NOW and start swiping!   
———————————— 
<a href="https://t.me/iai_announcement">Telegram</a> | <a href="https://x.com/iai_center?s=21">X</a> | <a href="https://www.facebook.com/profile.php?id=61566167991648">Facebook</a> | <a href="https://zealy.io/cw/iai/questboard">QuestsFullname</a>`;
                try {
                    // Send the welcome image with a caption
                    await bot.sendPhoto(chatId, imageUrl);
                    await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML', reply_markup: option });
                } catch (error) {
                    console.error("Error sending welcome message:", error);
                }

                //await bot.sendGame(update.message.from.id, gameName);
            }
            // Handle callback query for the Play button
            if (update.callback_query) {
                if (update.callback_query.game_short_name.toLowerCase() !== gameName.toLowerCase()) {
                    await bot.answerCallbackQuery(update.callback_query.id, `Sorry, '${update.callback_query.game_short_name}' is not available.`);
                } else {
                    const query_id = update.callback_query.id;
                    const firstName = update.callback_query.from.first_name;
                    const userID = update.callback_query.from.id;
                    await bot.answerCallbackQuery({ callback_query_id: query_id, url: gameUrl + `?query_id=${query_id}&id=${userID}&first_name=${firstName}` });
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
}

