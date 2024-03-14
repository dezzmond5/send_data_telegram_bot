import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'

import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обробки JSON та URL-кодованих даних
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// URL-адреса сервера Telegram Bot API
const botToken = process.env.TELEGRAM_TOKEN;
// const botToken = '7185321685:AAFe_vIWeRI5mJsJeaLg4nAsISnGD1R-fR8';

// const chatId = '319872388';
// 694984992

const ids = ['319872388']

const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

app.post('/submit-form', async (req, res) => {
    try {
        // Получить данные из формы
        const { name, message, phone } = req.body;

        // Создать сообщение для отправки в Telegram
        const telegramMessage = `Name: ${name}\nPhone number: ${phone}\nMessage: ${message}`;

        // Отправить сообщение каждому пользователю из массива ids
        for (const id of ids) {
            await sendTelegramMessage(telegramMessage, id);
        }

        // Ответить успешным статусом
        res.status(200).send('Данные успешно отправлены в бота Telegram!');
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        // Ответить статусом ошибки
        res.status(500).send('Произошла ошибка при обработке запроса.');
    }
});

async function sendTelegramMessage(message, chatId) {
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