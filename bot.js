
// import fetch from 'node-fetch';
//
// // Define the websites to monitor
// const websites = [
//   { url: 'https://kenexclusive.com', name: 'Kensxclusive (without www)', group: 'kenexclusive' },
//   { url: 'https://www.kenexclusive.com', name: 'Kensxclusive (with www)', group: 'kenexclusive' },
//   { url: 'https://gangawata.lk', name: 'Gangawata (without www)', group: 'gangawata' },
//   { url: 'https://www.gangawata.lk', name: 'Gangawata (with www)', group: 'gangawata' },
// ];
//
// // Function to check website status
// const checkWebsiteStatus = async () => {
//   let message = '🌐 Website Status Report:\n\n';
//   let groupedStatuses = {
//     kenexclusive: { base: '', www: '' },
//     gangawata: { base: '', www: '' },
//   };
//
//   // Loop through each site to check its status
//   for (let site of websites) {
//     try {
//       // Fetch the website
//       const response = await fetch(site.url);
//
//       // Categorize by base or www
//       const siteCategory = site.url.includes('www') ? 'www' : 'base';
//
//       if (!response.ok) {
//         groupedStatuses[site.group][siteCategory] += `❌ Error: Unable to access ${site.name}\nReason: ${response.statusText || 'Unknown error'}\n`;
//       } else {
//         groupedStatuses[site.group][siteCategory] += `✅ Success: Status: ${response.status}\n`;
//       }
//     } catch (error) {
//       const siteCategory = site.url.includes('www') ? 'www' : 'base';
//       groupedStatuses[site.group][siteCategory] += `❌ Error: Unable to access ${site.name}\nReason: ${error.message}\n`;
//     }
//   }
//
//   // Format message by grouping
//   if (groupedStatuses.kenexclusive.base || groupedStatuses.kenexclusive.www) {
//     message += `🔹 *Kenexclusive*\n`;
//     if (groupedStatuses.kenexclusive.base) {
//       message += `Base:${groupedStatuses.kenexclusive.base}`;
//     }
//     if (groupedStatuses.kenexclusive.www) {
//       message += `www:${groupedStatuses.kenexclusive.www}\n`;
//     }
//   }
//
//   if (groupedStatuses.gangawata.base || groupedStatuses.gangawata.www) {
//     message += `🔸 *Gangawata*\n`;
//     if (groupedStatuses.gangawata.base) {
//       message += `Base:${groupedStatuses.gangawata.base}`;
//     }
//     if (groupedStatuses.gangawata.www) {
//       message += `www:${groupedStatuses.gangawata.www}`;
//     }
//   }
//
//   return message;
// };
//
// // Function to send status update to Telegram
// const sendStatusToTelegram = async (statusMessage) => {
//   const botToken = process.env.TELEGRAM_BOT_TOKEN;
//   const chatId = process.env.TELEGRAM_CHAT_ID; // The chat ID where you want to send the updates
//
//   if (!botToken || !chatId) {
//     console.error('Bot token or chat ID is missing!');
//     return;
//   }
//
//   // Send the status message to Telegram
//   const response = await fetch(
//       `https://api.telegram.org/bot${botToken}/sendMessage`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: chatId,
//           text: statusMessage,
//         }),
//       }
//   );
//
//   if (!response.ok) {
//     console.error('Failed to send status update');
//   }
// };
//
// // Set up an interval to send website status every 2 minutes
// setInterval(async () => {
//   const statusMessage = await checkWebsiteStatus();
//   await sendStatusToTelegram(statusMessage);
// }, 2 * 60 * 1000); // 2 minutes in milliseconds
//
