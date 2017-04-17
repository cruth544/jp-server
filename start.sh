#!/bin/bash
echo "setting iptables"
PORT=8000
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports $PORT
echo "starting mongo"
sudo service mongod start
echo "starting node"
nohup node server.js &
echo "running node on port $PORT with pid $!"
echo $! > running_pid.txt

