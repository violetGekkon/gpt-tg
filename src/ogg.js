import axios from "axios";
import {createWriteStream} from 'fs';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg'

const _dirname = dirname(fileURLToPath(import.meta.url));

class OggConverter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`);
            return new Promise((resolve, reject) => {
                ffmpeg(input)
                    .inputOption('-t 30')
                    .output(outputPath)
                    .on('end', () => resolve(outputPath))
                    .on('error', err => reject(err.message))
                    .run()

            })
        } catch (error) {
            console.log(`Error while creating mp3`, error.message);
        }

    }

    async create(url, filename) {
        try {
            const oggPath = resolve(_dirname, '../voice_msgs', `${filename}.ogg`)
            const response = await axios({
                method: 'get',
                url,
                responseType: 'stream'
            })
            return new Promise(resolve => {
                const stream = createWriteStream(oggPath);
                response.data.pipe(stream);
                stream.on('finish', () => resolve(oggPath));
            })

        } catch (error) {
            console.log(`Error while creating ogg`, error.message);
        }

    }

}

export const ogg = new OggConverter();
