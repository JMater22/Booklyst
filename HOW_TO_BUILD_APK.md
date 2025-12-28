# How to Build APK Using GitHub Actions

## Setup (One-Time)

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Create a new repository named "Booklyst"
   - Don't initialize with README (you already have code)

2. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Booklyst app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Booklyst.git
   git push -u origin main
   ```

3. **GitHub Actions will automatically start building!**

---

## Download Your APK

### Method 1: From Actions Tab
1. Go to your repository on GitHub
2. Click "Actions" tab at the top
3. Click the latest workflow run
4. Scroll down to "Artifacts"
5. Download "booklyst-debug.apk"

### Method 2: From Releases (Automatic)
1. Go to your repository on GitHub
2. Click "Releases" on the right side
3. Download the latest `app-debug.apk`

---

## Rebuild APK (After Making Changes)

Just push your changes to GitHub:
```bash
git add .
git commit -m "Updated features"
git push
```

GitHub Actions will automatically build a new APK!

---

## Build Locally (If You Have Android Studio)

If you install Android Studio later:

1. **Open Android project:**
   ```bash
   npx cap open android
   ```

2. **Build APK in Android Studio:**
   - Menu: Build → Build APK
   - Wait 5-10 minutes
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## What Happens When You Push to GitHub?

1. ✅ GitHub Actions checks out your code
2. ✅ Installs Node.js and dependencies
3. ✅ Builds the web app (`npm run build`)
4. ✅ Sets up Android SDK and Java
5. ✅ Syncs Capacitor (`npx cap sync android`)
6. ✅ Builds the APK using Gradle
7. ✅ Uploads APK as an artifact
8. ✅ Creates a release with the APK attached

**Total time: ~5-10 minutes**

---

## For Your Professor

**Submission Options:**

### Option A: Submit the APK file
- Download from GitHub Actions/Releases
- Submit `app-debug.apk` (~50-100 MB)

### Option B: Submit GitHub link
- Share your repository URL
- Your professor can download the APK from Releases

### Option C: Submit source code
- Provide the entire project folder
- Include this README so they can build it themselves

---

## APK Info

- **File Name:** app-debug.apk
- **Size:** ~50-100 MB
- **Package:** com.booklyst.app
- **Version:** 1.0.0
- **Min Android:** 5.0 (API 21)
- **Type:** Debug build (unsigned)

---

## Testing the APK

1. Transfer APK to Android phone
2. Enable "Install from Unknown Sources"
3. Install the APK
4. Open "Booklyst" from app drawer

---

## Troubleshooting

**GitHub Actions failed?**
- Check the "Actions" tab for error logs
- Usually fixes itself on retry (click "Re-run jobs")

**APK not appearing in Releases?**
- Check "Actions" → "Artifacts" instead
- Download from there

**Want to create a signed APK for Play Store?**
- Need to configure signing keys (separate process)
- Debug APK is fine for submission/testing

---

## Need Help?

1. Make sure `.github/workflows/build-apk.yml` exists in your repo
2. Check that `android/` folder is pushed to GitHub
3. Wait 5-10 minutes after push for build to complete
4. Check "Actions" tab for build status
