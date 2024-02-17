#!/bin/bash

if [[ $1 =~ ^[0-9]+$ ]]; then
  export PORT="$1"
else
  export PORT="63001"
fi

yarn start
