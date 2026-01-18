#!/bin/bash

# Health & Fitness Tracker - Environment Setup Script
# This script helps you set up the environment variables

echo "🏋️ Health & Fitness Tracker - Environment Setup"
echo "================================================"
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Create backend .env file
echo "📝 Creating backend/.env file..."

cat > backend/.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/health_fitness_tracker

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health_fitness_tracker

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
EOF

echo "✅ backend/.env created successfully!"
echo ""

# Create frontend .env file if it doesn't exist
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend/.env file..."
    
    cat > frontend/.env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
EOF
    
    echo "✅ frontend/.env created successfully!"
else
    echo "ℹ️  frontend/.env already exists, skipping..."
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "⚠️  IMPORTANT: Please update the following in backend/.env:"
echo "   1. Change JWT_SECRET to a strong random string for production"
echo "   2. Update MONGODB_URI if using MongoDB Atlas"
echo ""
echo "📋 Next steps:"
echo "   1. Ensure MongoDB is running"
echo "   2. Run: npm run install-all"
echo "   3. Run: npm run dev"
echo ""
echo "Happy coding! 💪"
