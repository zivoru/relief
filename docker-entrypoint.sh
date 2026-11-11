#!/bin/sh
set -e
node node_modules/prisma/build/index.js db push --schema=prisma/schema.prisma
exec node server.js
