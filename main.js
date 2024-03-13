import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обробки JSON та URL-кодованих даних
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// URL-адреса сервера Telegram Bot API
const botToken = '7185321685:AAFe_vIWeRI5mJsJeaLg4nAsISnGD1R-fR8';
const chatId = '319872388';
const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

// Обробник POST-запитів на відправку даних з форми
// Обробник POST-запитів на відправку даних з форми
app.post('/submit-form', async (req, res) => {
    try {
        // Отримати дані з форми
        const { email, message, phone } = req.body;

        // Створити повідомлення для відправлення в Telegram
        const telegramMessage = `Email: ${email}\nPhone number: ${phone}\nMessage: ${message}`;

        // Відправити повідомлення в бота Telegram (без ID чату)
        await sendTelegramMessage(telegramMessage);

        // Відповісти успішним статусом
        res.status(200).send('Дані успішно відправлено у бота Telegram!');
    } catch (error) {
        console.error('Помилка при обробці запиту:', error);
        // Відповісти статусом помилки
        res.status(500).send('Сталася помилка при обробці запиту.');
    }
});

// Функція для відправки повідомлення у чат Telegram
async function sendTelegramMessage(message) {
    try {
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message }),
        });
        const data = await response.json();
        console.log('Message sent to Telegram:', data);
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}

// Запустити сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});