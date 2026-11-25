# 🚀 Quick Firebase Setup Commands

## Run these commands in order:

### 1. Install Firebase SDK
```bash
npm install firebase
```

**What this does:** Installs the Firebase JavaScript SDK to your project

**Time:** 1-2 minutes

**Expected output:**
```
added 1 package, and audited X packages in Ys
```

---

### 2. Install Firebase CLI Tools (Optional but Recommended)
```bash
npm install -g firebase-tools
```

**What this does:** Installs Firebase command-line tools globally

**Time:** 30 seconds - 1 minute

**Use cases:**
- Deploy your app to Firebase Hosting
- Manage Firestore from terminal
- Run local emulators for testing
- Configure Firebase Functions

**Verify installation:**
```bash
firebase --version
```

Should show: `13.x.x` or similar

---

### 3. Login to Firebase (Optional)
```bash
firebase login
```

**What this does:** Authenticates your terminal with your Google account

**When needed:**
- When you want to deploy to Firebase Hosting
- When using Firebase CLI commands
- When setting up CI/CD

---

### 4. Install All Project Dependencies
```bash
npm install
```

**What this does:** Installs all dependencies listed in package.json

**Time:** 2-5 minutes (first time)

---

### 5. Start Development Server
```bash
npm run dev
```

**What this does:** Starts Vite development server

**Expected output:**
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.x.x:8080/
```

**Open in browser:** http://localhost:8080

---

## 🧪 Test Firebase Connection

After starting the dev server, open browser and press **F12** to open developer console.

### Check for Firebase initialization:

**✅ Good (No errors):**
```
No Firebase-related errors
App loads successfully
```

**❌ Bad (Errors):**
```
Error: Firebase app not initialized
Error: Invalid API key
```

**Fix:** 
1. Check `.env` file exists
2. Verify all `VITE_FIREBASE_*` variables are set
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

## 🔥 Firebase Console Checks

While your app is running, go to [Firebase Console](https://console.firebase.google.com/project/sehatsetu-c4172)

### Check 1: Authentication
1. Go to Build → Authentication
2. Should see "Email/Password" as **Enabled**
3. Users tab should show at least 1 user (doctor@mediease.demo)

### Check 2: Firestore
1. Go to Build → Firestore Database
2. Should see empty database (no errors)
3. Rules tab should show your security rules

### Check 3: Storage
1. Go to Build → Storage
2. Should see empty bucket (no errors)
3. Rules tab should show your security rules

---

## 📱 Test App Features

### Test 1: Patient Creation
1. Go to kiosk interface in your app
2. Fill out patient details
3. Submit

**Check:** Go to Firebase Console → Firestore → patients collection
**Expected:** New patient document appears ✅

---

### Test 2: Doctor Login
1. Go to doctor login page
2. Enter:
   - Email: `doctor@mediease.demo`
   - Password: `doctor123`
3. Click Login

**Expected:** Successful login, redirect to dashboard ✅

---

### Test 3: Document Upload
1. Go through patient intake flow
2. Upload a PDF or image file
3. Submit

**Check:** Go to Firebase Console → Storage → Files
**Expected:** Uploaded file appears in patients folder ✅

---

## 🐛 Common Issues & Fixes

### Issue: "npm: command not found"
**Problem:** Node.js not installed
**Fix:** Install Node.js from https://nodejs.org/

---

### Issue: "Firebase not initialized"
**Problem:** Environment variables not loaded
**Fix:**
1. Verify `.env` file exists in project root
2. Check all `VITE_FIREBASE_*` variables are set
3. Restart terminal and dev server

---

### Issue: "Permission denied" in Firestore
**Problem:** Security rules not published or too restrictive
**Fix:**
1. Go to Firebase Console → Firestore → Rules
2. Publish the rules from FIREBASE_SETUP.md
3. Wait 30 seconds for rules to propagate

---

### Issue: "Upload failed" for documents
**Problem:** Storage not enabled or wrong rules
**Fix:**
1. Verify Storage is enabled in Firebase Console
2. Check Storage rules are published
3. Verify file size is under 10MB

---

### Issue: "Cannot find module 'firebase'"
**Problem:** Firebase package not installed
**Fix:**
```bash
npm install firebase
```

---

## ✅ Success Indicators

Your setup is complete when:

- [x] `npm run dev` starts without errors
- [x] http://localhost:8080 opens successfully
- [x] No Firebase errors in browser console (F12)
- [x] Can create patient records
- [x] Can login as doctor
- [x] Can upload documents
- [x] Data appears in Firebase Console

---

## 🎯 Next Steps

After successful setup:

1. **Explore the app** - Test all patient intake flows
2. **Review the code** - Check `src/lib/firebase*.ts` files
3. **Customize** - Modify patient fields, questions, etc.
4. **Add features** - Implement queue management, notifications, etc.
5. **Deploy** - When ready, deploy to Vercel or Firebase Hosting

---

## 📚 Useful Commands Reference

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for linting errors
npm run lint

# Format code
npm run format

# Firebase login
firebase login

# Firebase deploy
firebase deploy

# Firebase emulators (local testing)
firebase emulators:start
```

---

## 🔗 Important Links

- **Your Firebase Console:** https://console.firebase.google.com/project/sehatsetu-c4172
- **Firebase Documentation:** https://firebase.google.com/docs
- **Firestore Docs:** https://firebase.google.com/docs/firestore
- **Storage Docs:** https://firebase.google.com/docs/storage
- **Authentication Docs:** https://firebase.google.com/docs/auth

---

## 💡 Pro Tips

1. **Keep `.env` secret** - Never commit it to Git (it's in .gitignore)
2. **Use test mode for development** - Switch to production rules before launch
3. **Monitor Firebase usage** - Check Firebase Console → Usage regularly
4. **Backup Firestore data** - Export data before making major changes
5. **Test security rules** - Use Firebase Console Rules Playground

---

**Happy coding! 🚀**
