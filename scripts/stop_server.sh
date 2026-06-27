#!/bin/bash
###############################################
# Stop the running SmartPassport server
###############################################
echo "===== Stopping SmartPassport AI Server ====="

# Stop PM2 managed process if it exists
if command -v pm2 &> /dev/null; then
    pm2 stop smartpassport-ai 2>/dev/null || true
    pm2 delete smartpassport-ai 2>/dev/null || true
    echo "PM2 process stopped."
else
    # Fallback: kill any node process on port 5000
    PID=$(lsof -t -i:5000 2>/dev/null) || true
    if [ -n "$PID" ]; then
        kill -9 $PID 2>/dev/null || true
        echo "Killed process on port 5000 (PID: $PID)"
    else
        echo "No running server found. Skipping."
    fi
fi

echo "===== Stop complete ====="
