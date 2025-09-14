# GitHub Actions Setup Guide

## Why GitHub Actions Might Not Be Running

### 1. Repository Not Set Up
- Make sure you've pushed this code to a GitHub repository
- The repository must be on GitHub (not just local)

### 2. GitHub Actions Not Enabled
- Go to your repository on GitHub
- Click on **Settings** tab
- Click on **Actions** in the left sidebar
- Make sure **Actions** is enabled

### 3. Workflow Files Location
The workflow files are in the correct location:
```
.github/
└── workflows/
    ├── test.yml              # Simple test workflow
    ├── android-build.yml     # Basic Android build
    └── build-android.yml     # Full Android build with release
```

## How to Trigger Workflows

### Option 1: Push to Main Branch
```bash
git add .
git commit -m "Add GitHub Actions workflows"
git push origin main
```

### Option 2: Manual Trigger
1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Click on **Android Build** or **Test Workflow**
4. Click **Run workflow** button

### Option 3: Create a Pull Request
1. Create a new branch
2. Push changes
3. Create a pull request to main branch

## Workflow Files Explained

### test.yml
- **Purpose**: Simple test to verify GitHub Actions is working
- **Triggers**: Push to main, manual trigger
- **What it does**: Prints hello message and lists files

### android-build.yml
- **Purpose**: Basic Android APK build
- **Triggers**: Push to main, manual trigger
- **What it does**: Builds APK and uploads as artifact

### build-android.yml
- **Purpose**: Full Android build with release
- **Triggers**: Push to main/develop, PR to main, manual trigger
- **What it does**: Builds APK, creates GitHub release, uploads artifact

## Troubleshooting

### Check Workflow Status
1. Go to **Actions** tab in your repository
2. Look for workflow runs
3. Click on a run to see details

### Common Issues
1. **No workflows showing**: Make sure you're in the right repository
2. **Workflow not triggering**: Check if you pushed to the right branch
3. **Build failing**: Check the logs in the Actions tab

### Enable GitHub Actions
If you don't see the Actions tab:
1. Go to repository **Settings**
2. Scroll down to **Actions**
3. Make sure it's enabled
4. Select **Allow all actions and reusable workflows**

## Quick Test

To test if GitHub Actions is working:

1. **Push this code to GitHub**:
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

2. **Check Actions tab** in your GitHub repository

3. **Look for workflow runs** - you should see:
   - Test Workflow
   - Android Build

4. **Download APK** from the Actions artifacts

## Need Help?

If workflows still don't appear:
1. Check repository settings
2. Verify you're looking at the right repository
3. Make sure Actions is enabled
4. Try the manual trigger option