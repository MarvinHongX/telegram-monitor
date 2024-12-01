process_count=$(ps aux | grep "telegram-monitor/app.js" | grep -v "grep" | wc -l)

if [ $process_count -gt 0 ]; then
    echo "telegram-monitor/app.js is already running."
    exit
fi

#tail -f /home/fildata/log/miner.log | grep -a --line-buffered 'window post scheduler notifs channel closed' > /home/fildata/sh/telegram-monitor/miner-log.txt &
tail -f /home/fildata/log/miner.log | grep -a --line-buffered -E 'window post scheduler notifs channel closed|Submitted window post|submit window post failed|Aborted window post Submitting|could not read file p_aux=' > /home/fildata/sh/telegram-monitor/miner-log.txt &

sleep 1

nohup node /home/fildata/sh/telegram-monitor/app.js &
