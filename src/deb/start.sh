#!/bin/bash
set -e

# SNOMED Diagram API Startup Script
# This script can be used to manually start the service

APP_DIR="/opt/snomed-diagram-api"
LOG_DIR="/var/log/snomed-diagram-api"
USER="snomed-diagram"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"
chown "$USER:$USER" "$LOG_DIR"

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "Error: Application directory $APP_DIR does not exist"
    exit 1
fi

# Install dependencies if needed
if [ -f "$APP_DIR/package.json" ] && [ ! -d "$APP_DIR/node_modules" ]; then
    echo "Installing npm dependencies..."
    cd "$APP_DIR"
    npm install --production
fi

# Start the application
echo "Starting SNOMED Diagram API..."
cd "$APP_DIR"
exec node app/server.js
