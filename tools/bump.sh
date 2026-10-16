#!/bin/sh
# Give css/js a new ?v= stamp so phones load the new files at once instead of a cached copy.
v=$(date +%Y%m%d%H%M)
sed -i -E "s#(href=\"css/style\.css)(\?v=[0-9]+)?\"#\1?v=$v\"#; s#(src=\"js/[a-z0-9]+\.js)(\?v=[0-9]+)?\"#\1?v=$v\"#" "$(dirname "$0")/../index.html"
echo "stamped $v"
