# Firebase Configuration Security Guide

## 🔒 Secure Setup

### For Development:
1. **Copy environment template**: `cp .env.example .env`
2. **Fill in your Firebase values** in `.env` (get from Firebase Console)
3. **Never commit `.env`** to version control

### For Production/Deployment:
1. **Vercel/Netlify**: Add environment variables in dashboard
2. **Expo EAS**: Use `eas secret:create` command
3. **GitHub Actions**: Add secrets in repository settings

## 🚨 Security Notes

### Firebase API Keys are Public:
- Firebase client API keys are designed to be public
- Security comes from Firebase Security Rules, not hiding API keys
- Still good practice to use environment variables for configuration management

### What to Secure:
- ✅ **Environment variables** - for clean configuration
- ✅ **Firebase Security Rules** - actual security layer
- ✅ **Service account keys** - server-side authentication (never put in client code)

### What's Safe to be Public:
- ✅ **Firebase client API keys** - designed for public use
- ✅ **Project ID, Auth Domain** - public identifiers
- ✅ **App ID, Measurement ID** - public identifiers

## 🛡️ Firebase Security Rules

Your actual security comes from Firestore and Auth rules:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /symptoms/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /medications/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📁 File Structure
```
├── .env                    # Your actual config (gitignored)
├── .env.example           # Template for others (committed)
├── src/config/firebaseConfig.ts  # Uses environment variables (committed)
└── .gitignore             # Ignores .env files (committed)
```

## 🚀 Setup for New Team Members
1. Clone repository
2. Copy `.env.example` to `.env`
3. Get Firebase config from team lead
4. Fill in `.env` with actual values
5. Run `npm start`
