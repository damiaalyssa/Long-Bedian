# Long Bedian Admin (Firebase Edition)

A lightweight admin console that uses **Firebase Authentication** and **Cloud Firestore** so administrators can log in, register new shops, and edit existing listings without managing their own backend server.

---

## 🔐 Features

- Email/password login secured by Firebase Authentication
- Add new shops with name, description, location, category, operating hours, and image URL
- Edit/update existing shops inline
- Toggle shop visibility (Active / Hidden)
- Delete shops entirely when needed
- Real-time updates powered by Firestore snapshots

The UI lives in `admin/index.html` and is entirely client-side.

---

## 📁 File Overview

```
admin/
├── index.html              # Admin UI (login + dashboard)
├── firebase-config.js      # 🔒 Your Firebase credentials (placeholder provided)
└── js/
    └── admin.js            # All Firebase + Firestore logic
```

> ⚠️ Keep `firebase-config.js` private. Do **not** commit production credentials.

---

## 🚀 Getting Started

### 1. Create / use a Firebase project
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create a project (or reuse one)
3. Enable **Authentication ➜ Email/Password** provider
4. Create at least one admin user manually under *Users*
5. Enable **Firestore Database** (Start in production mode ➜ choose a region close to you)

### 2. Update `firebase-config.js`
Copy the SDK snippet from *Project settings ➜ General ➜ Your apps ➜ Web app* and replace placeholders in `admin/firebase-config.js`:

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 3. Firestore Security Rules (recommended starter)
Restrict reads/writes to authenticated admins only:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shops/{shopId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Serve the site locally
Because the admin uses JavaScript modules, serve over HTTP (not `file://`). Any simple dev server works. Examples:

#### PHP built-in server
```bash
cd /Users/hafizfauzi/development/Long-Bedian
php -S localhost:8000
```
Visit: `http://localhost:8000/admin/index.html`

#### VS Code Live Server / `npx serve`
```bash
npx serve .
```

---

## 🧭 Using the Admin Console

1. Navigate to `/admin/index.html`
2. Log in with the Firebase user you created
3. **Add Shop**
   - Fill in the form
   - Paste an image URL (from Firebase Storage, public CDN, etc.)
   - Click **Save Shop**
4. **Edit Shop**
   - Click *Edit* under the shop card
   - Update any fields, click **Update Shop**
5. **Toggle Visibility**
   - *Hide* removes the shop from the public listing (but keeps it in Firestore)
6. **Delete Shop**
   - Removes the document entirely

All changes sync instantly thanks to Firestore snapshots.

---

## 🔗 Displaying Shops on the Public Website

The admin writes to a Firestore collection named `shops`. To show these shops on `shops.html`, fetch from Firestore the same way (or expose a Cloud Function / REST endpoint). The current implementation still uses the previous static carousel; adapt it when ready.

Example pseudo-code:
```js
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const q = query(collection(db, "shops"), where("isActive", "==", true));
const snapshot = await getDocs(q);
```

---

## ✅ Checklist Before Going Live

- [ ] Firebase project created
- [ ] Email/Password auth enabled
- [ ] Admin user accounts provisioned
- [ ] Firestore rules tightened
- [ ] `firebase-config.js` filled with real values
- [ ] Site served via HTTPS (production)
- [ ] Optional: store images in Firebase Storage + use generated URLs

---

## 💡 Tips

- Use Firebase Hosting for a serverless deployment
- Add role-based claims if you need multiple admin tiers
- Connect public pages directly to Firestore to avoid manual syncing
- For more complex workflows, wrap Firebase with your own Cloud Functions API

Happy building!
