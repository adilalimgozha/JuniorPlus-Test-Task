#!/bin/bash
set -e

echo "🔄 Waiting for database..."
node wait-for-db.js

echo "🚀 Running migrations..."
node-pg-migrate up

echo "🌟 Starting application..."
tsx src/index.ts