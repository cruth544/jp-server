#!/bin/bash
echo "setting iptables"
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000
echo "starting mongo"
sudo service mongod start
echo "starting node"
npm start

