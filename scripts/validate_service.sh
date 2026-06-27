#!/bin/bash
###############################################
# Validate the deployment succeeded
###############################################
echo "===== Validating SmartPassport AI Deployment ====="

# Wait a few seconds for the server to fully boot
sleep 5

# Health check — hit the server on port 5000
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/ 2>/dev/null)

if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "304" ]; then
    echo "✅ Health check PASSED! Server returned HTTP $RESPONSE"
    exit 0
else
    echo "❌ Health check FAILED! Server returned HTTP $RESPONSE"
    exit 1
fi
