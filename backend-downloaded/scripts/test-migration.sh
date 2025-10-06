#!/bin/bash

echo "🧪 Testing Duetto Analytics Migration"
echo "====================================="

# Check if running from backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Step 1: Check pre-migration status
echo -e "\n📊 Step 1: Checking pre-migration status..."
node scripts/check-migration-status.js

# Step 2: Run migrations
echo -e "\n🚀 Step 2: Running migrations..."
node scripts/run-migrations.js

if [ $? -eq 0 ]; then
    echo -e "\n✅ Migrations completed successfully!"
    
    # Step 3: Verify post-migration status
    echo -e "\n🔍 Step 3: Verifying post-migration status..."
    node scripts/check-migration-status.js
    
    # Step 4: Test idempotency
    echo -e "\n🔄 Step 4: Testing idempotency (running migrations again)..."
    node scripts/run-migrations.js
    
    if [ $? -eq 0 ]; then
        echo -e "\n✅ Idempotency test passed!"
    else
        echo -e "\n❌ Idempotency test failed!"
    fi
else
    echo -e "\n❌ Migration failed! Check the logs above."
fi

echo -e "\n✨ Migration test complete!"