require('dotenv').config();

const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

const logFilePath = '/home/fildata/sh/telegram-monitor/miner-log.txt';
let lastReadSize = 0; // 마지막으로 읽은 로그 파일의 크기를 저장하는 변수

function monitorLogFile() {
    fs.watchFile(logFilePath, (curr, prev) => {
        fs.stat(logFilePath, (err, stats) => {
            if (err) {
                console.error('Error getting file stats:', err);
                return;
            }

            const fileSize = stats.size;
            if (fileSize < lastReadSize) {
                lastReadSize = 0; // 파일이 잘려서 다시 시작될 경우 lastReadSize 초기화
            }

            const readStream = fs.createReadStream(logFilePath, { start: lastReadSize, end: fileSize });
            let newLines = '';

            readStream.on('data', (chunk) => {
                newLines += chunk;
            });

            readStream.on('end', () => {
                const lines = newLines.split('\n');

                lines.forEach((line, index) => {
                    if (index === lines.length - 1 && line === '') {
                        // 마지막 라인이 빈 문자열인 경우 (파일이 잘려서 마지막에 빈 라인이 생길 수 있음)
                        return;
                    }

                    if (line.includes('window post scheduler notifs channel closed')) {
                        bot.sendMessage(chatId, `<<MINER01>> ${line}`);
                    }

		    if (line.includes('Aborted window post Submitting')) {
                        bot.sendMessage(chatId, `<<MINER01>> ${line}`);
                    }

		    if (line.includes('submit window post failed')) {
                        bot.sendMessage(chatId, `<<MINER01>> ${line}`);
                    }

		    if (line.includes('could not read file p_aux=')) {
                        bot.sendMessage(chatId, `<<MINER01>> ${line}`);
                    }

                    if (line.includes('Submitted window post')) {
			const startIndex = line.indexOf('(deadline');
                        const endIndex = line.indexOf(')', startIndex) + 1;

                        if (startIndex !== -1 && endIndex !== -1) {
                            const extractedLine = line.substring(startIndex, endIndex);
                            bot.sendMessage(chatId, `[miner01] ${extractedLine}`);
                        }    
                    }
                });

                lastReadSize = fileSize;
            });
        });
    });
}

// 로그 파일 모니터링 시작
monitorLogFile();
