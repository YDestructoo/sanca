# Sanca Project Checklist

A complete checklist to track progress for the Sanca student tracking system.

[+] Completed  
[~] In Progress  
[ ] Not Started  

---

## Phase 1: Project Setup
- [ ] **Install Prerequisites**
  - [+] Node.js LTS installed
  - [+] Firebase project created (Firestore, Auth, Storage enabled)
  - [+] Google Maps API Key generated

- [+] **Project Initialization**
  - [+] Create project folder `sanca/`
  - [+] Initialize Git repository
  - [+] Create `frontend/`, `backend/`, `shared/` folders

---

## Phase 2: Frontend (React Native + Expo)
- [+] **Environment Setup**
  - [+] Install Expo Router
  - [+] Install ReactNativeReusables UI library (Shad/cn for mobile)
  - [+] Install Google Maps SDK, Expo Location, Expo AV

- [+] **Navigation**
  - [+] Set up `app/_layout.tsx` for stack navigation
  - [+] Add pages: `index.tsx`, `map.tsx`, `logs.tsx`, `settings.tsx`, `student.tsx`

- [~] **Core Components**
  - [~] Auth | Log-in & Register
  - [~] Map Screen (Google Maps + real-time markers)
  - [~] Logs Screen (Location + Voice History)
  - [~] Settings Screen (API keys, backend URL) & Student Details Screen (info + recent activity(Optional))

- [ ] **Integrations**
  - [ ] Firebase Auth for guardian/teacher login
  - [ ] Firestore for logs and student data
  - [ ] Firebase Storage for voice files
  - [ ] Expo Location API for real-time GPS

- [ ] **Testing**
  - [ ] Run on Expo Go
  - [ ] Simulate location and voice logging
  - [ ] Verify map rendering and data flow

---

## Phase 3: Backend (Firebase or Node.js)
- [ ] **Backend Choice**
  - [ ] Decide: Firebase Cloud Functions OR Node.js Express server
  - [ ] If Node.js → Setup server + Firestore admin SDK

- [ ] **Endpoints**
  - [ ] ESP32 → Send location logs
  - [ ] ESP32 → Send voice logs
  - [ ] App → Fetch logs for each student
  - [ ] App → Create/Update student info

- [ ] **Realtime Support**
  - [ ] Enable Firestore real-time listeners for map updates

---

## Phase 4: ESP32 Integration
- [ ] **Firmware**
  - [ ] Send unique token + location to backend
  - [ ] Upload voice file via signed URL or REST endpoint

- [ ] **Testing**
  - [ ] Test with mock location data
  - [ ] Confirm logs appear in Firestore

---

## Phase 5: Deployment
- [ ] **Frontend**
  - [ ] Configure EAS Build
  - [ ] Generate signed APK for Android
  - [ ] Test on physical device

- [ ] **Backend**
  - [ ] Deploy Firebase Functions (if used)
  - [ ] Secure API endpoints with auth

- [ ] **Final Testing**
  - [ ] End-to-end test with ESP32 + App + Firebase
  - [ ] Validate location and voice logs in real time

---

## Phase 6: Documentation
- [ ] **Project README**
  - [ ] Installation steps
  - [ ] API docs
  - [ ] Architecture diagram

- [ ] **User Guide**
  - [ ] How to install and run the app
  - [ ] How to set up ESP32 device
