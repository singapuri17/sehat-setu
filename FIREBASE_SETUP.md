# 🔥 Firebase Setup Guide for MediEase

This guide will help you connect your MediEase application to Firebase.

---

## 📋 Prerequisites

- Node.js and Bun installed
- A Google account
- Basic understanding of Firebase

---

## 🚀 Quick Setup (Step-by-Step)

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** or **"Create a project"**
3. Enter project name: **"MediEase"**
4. Enable Google Analytics (recommended)
5. Click **"Create Project"**

---

### **Step 2: Register Web App**

1. In Firebase Console, click the **Web icon** `</>`
2. Enter app nickname: **"MediEase Web App"**
3. Click **"Register app"**
4. **Copy the Firebase configuration** (you'll need this in Step 6)

Your config will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "mediease-xxxxx.firebaseapp.com",
  projectId: "mediease-xxxxx",
  storageBucket: "mediease-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

---

### **Step 3: Enable Firebase Services**

#### **A. Authentication** (for doctor login)

1. Go to **Build** → **Authentication**
2. Click **"Get Started"**
3. Click **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

#### **B. Firestore Database** (for patient records)

1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose location: **asia-south1 (Mumbai)** - closest to India
5. Click **"Enable"**

#### **C. Cloud Storage** (for medical documents)

1. Go to **Build** → **Storage**
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Use default location
5. Click **"Done"**

---

### **Step 4: Install Firebase SDK**

Open terminal in your project directory:

```bash
bun add firebase
```

---

### **Step 5: Create Environment File**

Copy the example environment file:

```bash
cp .env.example .env
```

---

### **Step 6: Add Firebase Configuration**

Open the `.env` file and add your Firebase configuration values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=mediease-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mediease-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=mediease-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

**Where to find these values:**
- Go to Firebase Console → Project Settings (gear icon)
- Scroll down to "Your apps" section
- Click on your web app
- Copy each value

---

### **Step 7: Create Demo Doctor Account**

You need at least one doctor account to test the system.

**Option A: Via Firebase Console (Recommended)**

1. Go to **Authentication** → **Users** tab
2. Click **"Add User"**
3. Enter:
   - Email: `doctor@mediease.demo`
   - Password: `doctor123`
4. Click **"Add User"**

**Option B: Via Code (Advanced)**

Add this to your code temporarily and run once:

```typescript
import { createDemoDoctor } from './lib/authService';

// Run this once to create demo doctor
createDemoDoctor();
```

---

### **Step 8: Set Up Security Rules**

#### **Firestore Rules**

1. Go to **Firestore Database** → **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Patients collection
    match /patients/{patientId} {
      // Allow read for authenticated doctors
      allow read: if request.auth != null;
      
      // Allow create for anyone (kiosk creates patient records)
      allow create: if true;
      
      // Allow update for authenticated doctors only
      allow update: if request.auth != null;
      
      // No delete allowed
      allow delete: if false;
    }
    
    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

#### **Storage Rules**

1. Go to **Storage** → **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Patient documents
    match /patients/{patientId}/documents/{document} {
      // Allow read for authenticated doctors
      allow read: if request.auth != null;
      
      // Allow upload for anyone (kiosk uploads documents)
      allow create: if true;
      
      // Allow delete for authenticated doctors
      allow delete: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

### **Step 9: Test the Connection**

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun run dev
```

3. Open `http://localhost:8080` in your browser

4. Test features:
   - Create a patient case (kiosk flow)
   - Login as doctor (`doctor@mediease.demo` / `doctor123`)
   - View patient cases in doctor dashboard

---

## 📁 File Structure

Your Firebase integration files:

```
src/
├── lib/
│   ├── firebase.ts          # Firebase initialization
│   ├── firebaseService.ts   # Patient & document operations
│   └── authService.ts       # Authentication operations
```

---

## 🔧 Available Functions

### Authentication (`authService.ts`)

```typescript
// Sign in doctor
await signInDoctor(email, password);

// Sign out doctor
await signOutDoctor();

// Get current user
const user = getCurrentUser();

// Check if authenticated
const isAuth = isAuthenticated();
```

### Patient Operations (`firebaseService.ts`)

```typescript
// Create patient case
const patientId = await createPatientCase(patientData);

// Get patient case
const patient = await getPatientCase(patientId);

// Get all patients
const patients = await getAllPatientCases();

// Get patients by status
const readyPatients = await getAllPatientCases('ready');

// Update patient case
await updatePatientCase(patientId, { status: 'in-consultation' });
```

### Document Operations (`firebaseService.ts`)

```typescript
// Upload document
const docRef = await uploadMedicalDocument(patientId, file);

// Delete document
await deleteMedicalDocument(patientId, documentId);

// Generate token
const token = generateTokenNumber(); // Returns: "A-123"
```

---

## 🔒 Production Security Checklist

Before deploying to production:

- [ ] Change Firestore rules from "test mode" to production rules
- [ ] Change Storage rules from "test mode" to production rules
- [ ] Remove demo credentials from code
- [ ] Enable App Check for security
- [ ] Set up proper user roles (doctor, admin, etc.)
- [ ] Enable Firebase monitoring and alerts
- [ ] Set up backup for Firestore
- [ ] Review and limit API key restrictions in Google Cloud Console

---

## 🌐 Deploy to Vercel

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [Vercel Dashboard](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all `VITE_FIREBASE_*` variables

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

---

## 🆘 Troubleshooting

### "Firebase not configured"
- Check that all environment variables are set in `.env`
- Restart the dev server after changing `.env`

### "Permission denied" errors
- Check Firestore/Storage security rules
- Make sure you're authenticated when accessing protected resources

### "Invalid API key"
- Verify API key in Firebase Console → Project Settings
- Make sure there are no extra spaces in `.env` file

### Documents not uploading
- Check Storage rules
- Verify file size is under Storage limits
- Check browser console for detailed errors

---

## ✅ Success Indicators

Your Firebase is properly connected if:

1. ✅ No console errors about Firebase configuration
2. ✅ Can create patient records from kiosk
3. ✅ Can upload medical documents
4. ✅ Can login as doctor
5. ✅ Can view patient cases in doctor dashboard
6. ✅ Data persists after page refresh

---

## 🎯 Next Steps

After Firebase is connected:

1. Integrate Firebase functions with your existing UI components
2. Test the complete patient flow (kiosk → doctor review)
3. Add more security rules as needed
4. Set up Firebase Analytics for tracking
5. Consider adding Firebase Cloud Functions for automated tasks

---

**Need help?** Check the Firebase Console logs or browser console for detailed error messages.
