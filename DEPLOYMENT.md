# Deployment Instructions for GitHub Pages

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it (e.g., `last-road-of-iron`)
4. Make it **Public**
5. **Do NOT** initialize with README (we already have one)
6. Click **Create repository**

## Step 2: Push Your Code

Open terminal in the project directory (`/home/vharun/Desktop/Dnd`) and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - The Last Road of Iron RPG"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

## Step 4: Access Your Game

Your game will be live at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

## Step 5: Update README

Edit `README.md` and replace:
- `YOUR_USERNAME` with your GitHub username
- `REPO_NAME` with your repository name
- `[Your Name]` with your actual name

Then commit and push:
```bash
git add README.md
git commit -m "Update README with correct links"
git push
```

## Troubleshooting

### Game doesn't load
- Check browser console (F12) for errors
- Ensure all paths in `index.html` are relative (they already are)
- Wait a few minutes after enabling Pages

### 404 Error
- Make sure GitHub Pages is enabled in Settings
- Verify the repository is Public
- Check the URL format

### Changes not showing
- Clear browser cache (Ctrl+Shift+R)
- Wait a few minutes for GitHub to rebuild
- Check the Actions tab for deployment status

## Future Updates

To update your game:
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically redeploy in 1-2 minutes.

---

**Your game is now live and accessible to anyone!** 🎮
