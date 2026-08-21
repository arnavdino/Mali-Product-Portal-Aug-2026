#!/bin/bash
filename=(./build/static/js/main*.js)

search="http://localhost:8080"
value=https://api.pollsonly.com
sed -i "s#$search#$value#g" $filename