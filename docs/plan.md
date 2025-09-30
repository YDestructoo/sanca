# Sanca – Project Specification

## Description
A student tracking system where guardians/teachers can track students using IDs integrated with ESP32 devices.  
The ESP32 sends data to Firebase, and the mobile app displays student locations on Google Maps and allows manual location logging.

---

## Tech Stack
**Frontend:**
- React Native
- Expo
- ReactNativeReusables (Shad/cn for Mobile)

**Backend:**
- Firebase (Cloud Functions, Firestore, Storage)  
  *or*  
- Node.js Express (if custom backend needed)

**Development:**
- Node.js
- Expo CLI

---

## Project Details
- **Folder Structure:**  
  - `frontend/` → React Native app  
  - `backend/` → Firebase Cloud Functions or Node.js backend  
  - `shared/` → docs & configs  

- **Deployment Goal:**  
  Deploy mobile app as APK for Android devices; backend hosted via Firebase or custom Node.js server.

---

## Core Features
1. **Student Tracking** – ESP32 sends unique student token to backend.  
2. **GPS Map** – Real-time location of students displayed on Google Maps.  
3. **Location Logging** – Automatic every 30 mins + manual trigger.  
4. **Manual Logging Button** – Logs location instantly.  
5. **Guardian/Teacher Dashboard** – View students' location and logs.

---

## Database
- **Provider:** Firebase Firestore (cloud) for logs & metadata  
- **ORM:** Not required (NoSQL), Firebase SDK handles queries  

**Schema:**  

| Collection      | Fields                                                  |
|------------------|--------------------------------------------------------|
| students         | id: String (Document ID)                               |
|                  | name: String                                           |
|                  | school_id: String                                      |
|                  | device_id: String                                      |
|                  | guardian_ids: Array                                    |
|                  | location_logs: Sub-collection (lat, lng, timestamp)    |

---

## Pages & Components
- **Home Screen:** Overview & quick buttons  
- **Map Screen:** Real-time location of students  
- **Logs Screen:** View location history  
- **Settings Screen:** API keys, backend URL, and account settings  
- **Student Details Screen:** Student info & logs  

---

## Requirements
- **Guide:** Beginner-friendly, step-by-step with exact terminal commands, no skipped steps  
- **Versions:** Use latest stable versions of React Native, Expo, Firebase SDKs  

---

## Deliverables
1. Exact terminal commands for frontend setup  
2. React Native pages and navigation setup using Expo Router  
3. Firebase integration for location logs  
4. Code for Google Maps + Location APIs  
5. Instructions to build APK via Expo EAS  

---
