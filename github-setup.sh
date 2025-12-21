#!/bin/bash
# GitHub Setup Script for The Last Road of Iron

echo "🎮 The Last Road of Iron - GitHub Setup"
echo "========================================"
echo ""

# Check if git is configured
if ! git config user.name > /dev/null 2>&1; then
    echo "⚠️  Git user not configured. Let's set it up!"
    echo ""
    read -p "Enter your name: " username
    read -p "Enter your email: " useremail
    git config --global user.name "$username"
    git config --global user.email "$useremail"
    echo "✅ Git configured!"
    echo ""
fi

echo "📝 Current git status:"
git status
echo ""

echo "📋 Next Steps:"
echo "1. Go to: https://github.com/new"
echo "2. Create a repository (e.g., 'last-road-of-iron')"
echo "3. Make it PUBLIC"
echo "4. DO NOT initialize with README"
echo "5. Copy the repository URL"
echo ""
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🚀 Committing and pushing to GitHub..."
echo ""

# Commit
git commit -m "Initial commit - The Last Road of Iron RPG"

# Add remote
git remote add origin "$repo_url"

# Rename branch to main
git branch -M main

# Push
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your code is on GitHub!"
echo ""
echo "🌐 Enable GitHub Pages:"
echo "1. Go to your repo → Settings → Pages"
echo "2. Source: 'main' branch, '/ (root)' folder"
echo "3. Click Save"
echo "4. Wait 1-2 minutes"
echo ""
echo "Your game will be live at:"
echo "https://YOUR_USERNAME.github.io/REPO_NAME/"
echo ""
