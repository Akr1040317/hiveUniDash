# Firebase OAuth Domain Setup

## Issue
The Google Sign-In is failing with the error: `Firebase: Error (auth/unauthorized-domain)`

## Solution
You need to add your Vercel domain to Firebase's authorized domains list.

## Steps to Fix

### 1. For US Firebase Project (beeapp-5c98b)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **beeapp-5c98b**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add: `dashboardhiveeducation-jvrg2kw6g-akr1040317s-projects.vercel.app`
6. Click **Add**

### 2. For Dubai Firebase Project (prepcenter-750c1)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **prepcenter-750c1**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add: `dashboardhiveeducation-jvrg2kw6g-akr1040317s-projects.vercel.app`
6. Click **Add**

## Alternative: Add All Vercel Domains
If you want to allow any Vercel subdomain, you can add:
- `*.vercel.app` (wildcard for all Vercel domains)

## After Adding Domains
1. Wait a few minutes for the changes to propagate
2. Try Google Sign-In again
3. The error should be resolved

## Note
- Each Firebase project needs the domain added separately
- The domain must match exactly (including the subdomain)
- Changes may take up to 10 minutes to take effect
