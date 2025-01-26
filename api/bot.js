import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;

// Log environment variables to check if they are loaded correctly
console.log('Environment Variables:', { token, chatId });

if (!token || !chatId) {
  console.error('Error: Missing environment variables. Ensure TELEGRAM_BOT_TOKEN and TELEGRAM_GROUP_CHAT_ID are set.');
  process.exit(1);
}

// Initialize the bot
const bot = new TelegramBot(token, { polling: true });

// Function to send the timestamp message
const sendTimestampMessage = () => {
  const timestamp = new Date().toLocaleString(); // Get the current timestamp
  const message = `Current Timestamp: ${timestamp}`;
  console.log('Sending message:', message); // Log the message being sent

  bot.sendMessage(chatId, message)
      .then(() => console.log('Message sent successfully!'))
      .catch((error) => console.error('Error sending message:', error));
};

// Set up an interval to send a timestamp message every minute
setInterval(sendTimestampMessage, 60000);

console.log('Bot is running and will send a timestamp every minute...');


// import { checkWebsiteStatus } from '../bot';  // Import the status check function
//
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const update = req.body;  // The update sent by Telegram
//     const chatId = update.message.chat.id;
//
//     // Retrieve the bot token from environment variables
//     const botToken = process.env.TELEGRAM_BOT_TOKEN;
//
//     if (!botToken) {
//       return res.status(500).send('Telegram bot token is missing!');
//     }
//
//     // Check if the message is a command (/webcheck)
//     if (update.message.text === '/webcheck') {
//       const statusMessage = await checkWebsiteStatus();
//
//       // Send the website status message to the user
//       const response = await fetch(
//           `https://api.telegram.org/bot${botToken}/sendMessage`,
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               chat_id: chatId,
//               text: statusMessage,
//             }),
//           }
//       );
//
//       if (response.ok) {
//         res.status(200).send('Message sent to user');
//       } else {
//         res.status(500).send('Failed to send message');
//       }
//     } else {
//       res.status(200).send('OK'); // Handle other types of messages
//     }
//   } else {
//     res.status(405).send('Method Not Allowed');
//   }
// }
