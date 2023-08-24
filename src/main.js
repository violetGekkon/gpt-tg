import {Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import { ogg } from './ogg.js'

import config from 'config';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.on(message('voice'), async ctx => {
    try {
// link - это объект URL, в котором много разных полезных полей, но интересует поле href, так как в нем содержится ссылка на голосовое сообщение
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId = String(ctx.message.from.id);
        const oggPath = await ogg.create(link.href, userId);
        const mp3Path = await ogg.toMp3(oggPath, userId);
        await ctx.reply(mp3Path);

    } catch (error) {
        console.log(`Error while voice message`, error.message)
    }
})

bot.command('start', async (ctx) => {
    await ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
