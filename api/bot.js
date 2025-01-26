// import TelegramBot from 'node-telegram-bot-api';
//
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;
//
// if (!token || !chatId) {
//   console.error('Error: Missing environment variables. Ensure TELEGRAM_BOT_TOKEN and TELEGRAM_GROUP_CHAT_ID are set.');
//   process.exit(1);
// }
//
// const bot = new TelegramBot(token);
//
// // Function to send the daily message
// const sendDailyMessage = async () => {
//   const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' }); // Get current time in Sri Lanka
//   const message = `🌅 Good evening! Current time in Sri Lanka: ${timestamp}`;
//   console.log('Sending message:', message);
//
//   try {
//     await bot.sendMessage(chatId, message);
//     console.log('Message sent successfully!');
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// };
//
// // The function triggered by the cron job
// export default async function handler(req, res) {
//   await sendDailyMessage();
//   res.status(200).json({ status: 'Daily message sent successfully' });
// }

import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;

if (!token || !chatId) {
  console.error('Error: Missing environment variables. Ensure TELEGRAM_BOT_TOKEN and TELEGRAM_GROUP_CHAT_ID are set.');
  process.exit(1);
}

const bot = new TelegramBot(token);

// Websites to check
const websites = [
  { url: 'https://kenexclusive.com', name: 'Kensxclusive (without www)', group: 'kenexclusive' },
  { url: 'https://www.kenexclusive.com', name: 'Kensxclusive (with www)', group: 'kenexclusive' },
  { url: 'https://gangawata.lk', name: 'Gangawata (without www)', group: 'gangawata' },
  { url: 'https://www.gangawata.lk', name: 'Gangawata (with www)', group: 'gangawata' },
];

// Function to check website status
const checkWebsitesStatus = async () => {
  const results = [];
  for (const site of websites) {
    try {
      const response = await axios.get(site.url, { timeout: 5000 });
      results.push({
        name: site.name,
        url: site.url,
        group: site.group,
        status: response.status === 200 ? '🟢 Online' : '🔴 Offline',
        https: site.url.startsWith('https://') ? '✅ Secure (HTTPS)' : '❌ Not Secure',
      });
    } catch (error) {
      results.push({
        name: site.name,
        url: site.url,
        group: site.group,
        status: '🔴 Offline',
        https: site.url.startsWith('https://') ? '✅ Secure (HTTPS)' : '❌ Not Secure',
      });
    }
  }
  return results;
};

// Function to generate the daily report message
const generateReportMessage = async () => {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
  const results = await checkWebsitesStatus();

  let message = `🌅 Good evening! Current time in Sri Lanka: ${timestamp}\n\n📊 **Website Status Report:**\n`;
  for (const result of results) {
    message += `\n📍 **${result.name}** (${result.group})\n🔗 URL: ${result.url}\n📡 Status: ${result.status}\n🔒 HTTPS: ${result.https}\n`;
  }
  return message;
};

// Function to send the daily message
const sendDailyMessage = async () => {
  try {
    const reportMessage = await generateReportMessage();
    console.log('Sending message:\n', reportMessage);

    await bot.sendMessage(chatId, reportMessage, { parse_mode: 'Markdown' });
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// The function triggered by the cron job
export default async function handler(req, res) {
  await sendDailyMessage();
  res.status(200).json({ status: 'Daily message sent successfully' });
}



