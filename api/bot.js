import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';

// Set up Telegram bot
const token = process.env.TELEGRAM_BOT_TOKEN;
// Make sure to keep your token secure
const bot = new TelegramBot(token, { polling: true });

// Define the websites to monitor
const websites = [
  { url: 'https://kenexclusive.com', name: 'Kensxclusive (without www)', group: 'kenexclusive' },
  { url: 'https://www.kenexclusive.com', name: 'Kensxclusive (with www)', group: 'kenexclusive' },
  { url: 'https://gangawata.lk', name: 'Gangawata (without www)', group: 'gangawata' },
  { url: 'https://www.gangawata.lk', name: 'Gangawata (with www)', group: 'gangawata' },
];

// Function to check website status
const checkWebsiteStatus = async () => {
  let message = '🌐 Website Status Report:\n\n';
  let groupedStatuses = {
    kenexclusive: { base: '', www: '' },
    gangawata: { base: '', www: '' },
  };

  for (let site of websites) {
    try {
      const response = await fetch(site.url);

      const siteCategory = site.url.includes('www') ? 'www' : 'base';

      if (!response.ok) {
        groupedStatuses[site.group][siteCategory] += `❌ Error: Unable to access ${site.name}\nReason: ${response.statusText || 'Unknown error'}\n`;
      } else {
        groupedStatuses[site.group][siteCategory] += `✅ Success: Status: ${response.status}\n`;
      }
    } catch (error) {
      const siteCategory = site.url.includes('www') ? 'www' : 'base';
      groupedStatuses[site.group][siteCategory] += `❌ Error: Unable to access ${site.name}\nReason: ${error.message}\n`;
    }
  }

  if (groupedStatuses.kenexclusive.base || groupedStatuses.kenexclusive.www) {
    message += `🔹 *Kenexclusive*\n`;
    if (groupedStatuses.kenexclusive.base) {
      message += `Base:${groupedStatuses.kenexclusive.base}`;
    }
    if (groupedStatuses.kenexclusive.www) {
      message += `www:${groupedStatuses.kenexclusive.www}\n`;
    }
  }

  if (groupedStatuses.gangawata.base || groupedStatuses.gangawata.www) {
    message += `🔸 *Gangawata*\n`;
    if (groupedStatuses.gangawata.base) {
      message += `Base:${groupedStatuses.gangawata.base}`;
    }
    if (groupedStatuses.gangawata.www) {
      message += `www:${groupedStatuses.gangawata.www}`;
    }
  }

  return message;
};

// Vercel requires an export of the handler function
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const statusMessage = await checkWebsiteStatus();
    res.status(200).send(statusMessage); // Send the status message to Vercel
  } else {
    res.status(405).send({ message: 'Method Not Allowed' });
  }
}
