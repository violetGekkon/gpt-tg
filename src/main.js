import {Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';

import config from 'config';
import process from "nodemon";
import * as Signals from "nodemon/lib/monitor/signals.js";

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.on(message('voice'), async ctx => {
    try {
// link - это объект URL, в котором много разных полезных полей, но интересует поле href, так как в нем содержится ссылка на голосовое сообщение
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        await ctx.reply(JSON.stringify(link, null, 2))

    } catch (error) {
        console.log(`Error while voice message`, error.message)
    }
})

bot.command('start', async (ctx) => {
    await ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch();

process.once(Signals.SIGINT, () => bot.stop('SIGINT'));
process.once(Signals.SIGTERM, () => bot.stop('SIGTERM'));
