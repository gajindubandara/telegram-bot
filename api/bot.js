import { checkWebsiteStatus } from '../../bot';  // Import the status check function

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const update = req.body;  // The update sent by Telegram
    const chatId = update.message.chat.id;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    // Check if the message is a command (/webcheck)
    if (update.message.text === '/webcheck') {
      const statusMessage = await checkWebsiteStatus();
      
      // Send the website status message to the user
      const response = await fetch(
       `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: statusMessage,
          }),
        }
      );

      if (response.ok) {
        res.status(200).send('Message sent to user');
      } else {
        res.status(500).send('Failed to send message');
      }
    } else {
      res.status(200).send('OK'); // Handle other types of messages
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
