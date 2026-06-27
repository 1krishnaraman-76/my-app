#!/bin/bash
###############################################
# Start the SmartPassport AI server via PM2
###############################################
echo "===== Starting SmartPassport AI Server ====="

APP_DIR="/home/ec2-user/smartpassport-ai"
cd "$APP_DIR/backend"

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi

# Start the server with PM2 (auto-restart on crash)
pm2 start index.js \
    --name "smartpassport-ai" \
    --env production \
    --max-memory-restart 512M \
    --log /home/ec2-user/smartpassport-ai/logs/app.log

# Save PM2 process list so it survives reboots
pm2 save

# Setup PM2 startup script (run on system boot)
pm2 startup systemd -u ec2-user --hp /home/ec2-user 2>/dev/null || true

echo "===== Server started on port 5000 ====="
echo "===== Frontend served from backend/public/ ====="
