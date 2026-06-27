#!/bin/bash
###############################################
# Post-install: Install deps & configure env
###############################################
echo "===== Running After Install ====="

APP_DIR="/home/ec2-user/smartpassport-ai"
cd "$APP_DIR/backend"

# Install production dependencies (devDependencies skipped)
echo "Installing backend production dependencies..."
npm ci --production

# Create .env from environment or use defaults
# NOTE: For production, set these as EC2 environment variables
# or use AWS Systems Manager Parameter Store / Secrets Manager
if [ ! -f .env ]; then
    echo "Creating default .env file..."
    cat > .env <<EOF
PORT=5000
GMAIL_USER=\${GMAIL_USER:-}
GMAIL_PASS=\${GMAIL_PASS:-}
NODE_ENV=production
EOF
    echo ".env created. Update with real credentials."
fi

echo "===== After Install complete ====="
