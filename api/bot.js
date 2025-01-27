// import TelegramBot from 'node-telegram-bot-api';
// import axios from 'axios';
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
// // Websites to check
// const websites = [
//   { url: 'https://kenexclusive.com', name: 'Kensxclusive', group: 'kenexclusive' },
//   { url: 'https://www.kenexclusive.com', name: 'Kensxclusive', group: 'kenexclusive' },
//   { url: 'https://www.projects.kenexclusive.com', name: 'Kensxclusive', group: 'kenexclusive' },
//   { url: 'https://projects.kenexclusive.com', name: 'Kensxclusive', group: 'kenexclusive' },
//   { url: 'https://www.admin.kenexclusive.com', name: 'Kensxclusive', group: 'kenexclusive' },
//   { url: 'https://admin.kenexclusive.com', name: 'Kensxclusive', group: 'kenexclusive' },
//   { url: 'https://gangawata.lk', name: 'Gangawata', group: 'gangawata' },
//   { url: 'https://www.gangawata.lk', name: 'Gangawata', group: 'gangawata' },
// ];
//
// // Function to check website status
// const checkWebsiteStatus = async (url) => {
//   try {
//     const response = await axios.get(url);
//     return {
//       status: response.status === 200 ? '🟢 Online' : '🔴 Offline',
//       https: url.startsWith('https'),
//     };
//   } catch (error) {
//     return {
//       status: '🔴 Offline',
//       https: url.startsWith('https'),
//     };
//   }
// };
//
// // Function to generate the website status report
// const generateStatusReport = async () => {
//   let message = '📊 **Website Status Report:**\n\n';
//   const groupedReports = {};
//
//   for (const site of websites) {
//     const result = await checkWebsiteStatus(site.url);
//     if (!groupedReports[site.group]) {
//       groupedReports[site.group] = [];
//     }
//     groupedReports[site.group].push(
//         `🔗 URL: ${site.url}\n📡 Status: ${result.status}\n🔒 HTTPS: ${result.https ? '✅ Secure (HTTPS)' : '❌ Not Secure'}`
//     );
//   }
//
//   for (const group in groupedReports) {
//     message += `📍 **${group.charAt(0).toUpperCase() + group.slice(1)}**\n${groupedReports[group].join('\n')}\n\n`;
//   }
//
//   return message.trim();
// };
//
// // Function to send the daily report
// const sendDailyReport = async () => {
//   const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
//   const statusReport = await generateStatusReport();
//   const message = `${statusReport}`;
//
//   try {
//     await bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
//     console.log('Message sent successfully!');
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// };
//
// // The function triggered by the cron job
// export default async function handler(req, res) {
//   await sendDailyReport();
//   res.status(200).json({ status: 'Daily message sent successfully' });
// }
//
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
  { url: 'https://kenexclusive.com', name: 'Kenexclusive', group: 'kenexclusive' },
  { url: 'https://www.kenexclusive.com', name: 'Kenexclusive', group: 'kenexclusive' },
  { url: 'https://projects.kenexclusive.com', name: 'Kenexclusive', group: 'kenexclusive' },
  { url: 'https://www.projects.kenexclusive.com', name: 'Kenexclusive', group: 'kenexclusive' },
  { url: 'http://admin.kenexclusive.com', name: 'Kenexclusive', group: 'kenexclusive' },
  { url: 'http://www.admin.kenexclusive.com', name: 'Kenexclusive', group: 'kenexclusive' },
  { url: 'https://gangawata.lk', name: 'Gangawata', group: 'gangawata' },
  { url: 'https://www.gangawata.lk', name: 'Gangawata', group: 'gangawata' },
];

// Function to check website status
const checkWebsiteStatus = async (url) => {
  try {
    const response = await axios.get(url);
    return {
      status: response.status === 200 ? '🟢' : '🔴',
      https: url.startsWith('https'),
    };
  } catch (error) {
    return {
      status: '🔴',
      https: url.startsWith('https'),
    };
  }
};

// Function to generate the website status report
const generateStatusReport = async () => {
  let message = '🌐 **Website Status Report**\n';
  const groupedReports = {};

  // Check the status of each website
  for (const site of websites) {
    const result = await checkWebsiteStatus(site.url);
    const httpsIcon = result.https ? '🔒' : '';
    if (!groupedReports[site.group]) {
      groupedReports[site.group] = [];
    }
    groupedReports[site.group].push(`${httpsIcon}${result.status} ${site.url}`);
  }

  // Format the report
  for (const group in groupedReports) {
    message += `\n🔹 **${group.charAt(0).toUpperCase() + group.slice(1)}**\n${groupedReports[group].join('\n')}`;
  }

  return message.trim();
};

// Function to send the daily report
const sendDailyReport = async () => {
  const statusReport = await generateStatusReport();
  try {
    await bot.sendMessage(chatId, statusReport, { parse_mode: 'Markdown', disable_web_page_preview: true });
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// The function triggered by the cron job or API call
export default async function handler(req, res) {
  await sendDailyReport();
  res.status(200).json({ status: 'Daily message sent successfully' });
}
