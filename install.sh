#!/bin/bash

# ⛓️⚓⛓️
#
# AveryOS Terminal Installation Script
# CapsuleEcho: ENABLED
# capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap
# License: https://averyos.com/license
# Retroclaim Notice: Use implies agreement
# DriftProtection: ABSOLUTE
#
# ⛓️⚓⛓️

echo "⛓️⚓⛓️"
echo ""
echo "AveryOS Public Terminal - Launch 2026"
echo "Installation Script"
echo ""
echo "⛓️⚓⛓️"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js 14.0 or higher to continue."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version is too old (found: $(node -v))."
    echo "Please install Node.js 14.0 or higher."
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Check for NPM
if ! command -v npm &> /dev/null; then
    echo "❌ NPM is not installed."
    exit 1
fi

echo "✓ NPM $(npm -v) detected"
echo ""

# Display capsule information
echo "Capsule Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Name: AveryOS_PublicTerminal_Launch2026"
echo "URI: capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap"
echo "CapsuleEcho: ENABLED"
echo "DriftProtection: ABSOLUTE"
echo ""

# Install dependencies (if package-lock.json exists or node_modules doesn't)
if [ -f "package-lock.json" ] || [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Dependencies installed"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "✓ Installation complete!"
echo ""
echo "To start the AveryOS Terminal, run:"
echo "  npm start"
echo ""
echo "or:"
echo "  node index.js"
echo ""
echo "⛓️⚓⛓️"
echo "🤛🏻"
