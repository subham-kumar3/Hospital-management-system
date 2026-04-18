#!/bin/bash

echo "🐳 Starting Hospital Management System with Docker..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo ""
    echo "Install Docker Desktop:"
    echo "  macOS: brew install --cask docker"
    echo "  Windows: https://desktop.docker.com/win/main/Docker Desktop Installer.exe"
    echo "  Linux: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

echo "✅ Docker found!"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop application"
    exit 1
fi

echo "✅ Docker is running!"
echo ""

# Start all services
echo "🚀 Starting MongoDB, Backend, and Frontend containers..."
echo "   (This may take a few minutes on first run)"
echo ""

docker-compose up

echo ""
echo "✅ Hospital Management System is running!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   MongoDB:  localhost:27017"
echo ""
echo "🔐 Login Credentials:"
echo "   Email: admin@hospital.com"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"
