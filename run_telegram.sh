#tail -f /home/fildata/log/miner.log | grep -a --line-buffered 'window post scheduler notifs channel closed' > /home/fildata/sh/telegram-monitor/miner-log.txt &
tail -f /home/fildata/log/miner.log | grep -a --line-buffered -E 'window post scheduler notifs channel closed|Submitted window post' > /home/fildata/sh/telegram-monitor/miner-log.txt &

sleep 1

nohup node /home/fildata/sh/telegram-monitor/app.js &
