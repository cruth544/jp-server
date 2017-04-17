#!/bin/bash
if pgrep -x "node" > /dev/null
then
	echo "killing `cat running_pid.txt`"
	sudo kill `cat running_pid.txt`
else
	echo "Node is not running"
fi

