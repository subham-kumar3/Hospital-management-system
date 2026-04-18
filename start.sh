#!/bin/bash

echo "🏥 Starting Hospital Management System..."
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    echo "   macOS: brew tap mongodb/brew && brew install mongodb-community"
    echo "   Visit: https://www.mongodb.com/try/download/community"
    exit 1
fi

# Start MongoDB if not running
echo "📊 Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "🔄 Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null || sudo systemctl start mongod 2>/dev/null || echo "⚠️  Please start MongoDB manually"
else
    echo "✅ MongoDB is running"
fi

echo ""
echo "🚀 Starting Backend Server..."
cd backend
npm run seed
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo ""
echo "🎨 Starting Frontend Server..."
cd ../hospital-management
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Hospital Management System is running!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "🔐 Login Credentials:"
echo "   Email: admin@hospital.com"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
