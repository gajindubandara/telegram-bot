import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';

// Set up Telegram bot
const token = '7270596191:AAHuoAOUC6HVFkMyicUgSzMeGiqOGLEXzdE';
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

  // Loop through each site to check its status
  for (let site of websites) {
    try {
      // Fetch the website
      const response = await fetch(site.url);

      // Categorize by base or www
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

  // Format message by grouping
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

// Listen for the "/webcheck" command
bot.onText(/\/webcheck/, async (msg) => {
  const chatId = msg.chat.id;

  // Call the function to check website statuses
  const statusMessage = await checkWebsiteStatus();

  // Send the status message to the group in plain text (no markdown)
  bot.sendMessage(chatId, statusMessage);
});

// Handle errors in the bot itself
bot.on('polling_error', (error) => {
  console.log(error.code);  // Logs the error code
  bot.sendMessage(123456789, `⚠️ Error: ${error.message}`);
});

console.log('Bot is running...');
