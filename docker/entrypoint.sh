#!/bin/bash
if [ ! -f /keyfile ]; then
	echo "Keyfile not found"
	exit 1
fi
if [ ! -f /keypass ]; then
	echo "Keypass not found"
	exit 1
fi

node node_modules/ewf-validator-tool "$@" -k /keyfile -s /keypass
