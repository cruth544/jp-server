#!/bin/bash
rsync -rave "ssh -i jp_wedding.pem" * ec2-54-202-204-95.us-west-2.compute.amazonaws.com:/home/ubuntu/wedding-server/ --exclude node_modules

