
# 🩺 PatientPrep SL – Solution Architecture Diagram

## 📱 Mobile App

### 🧱 Application Layer
- **UI (Screens, Components)** 📱  
  Handles all patient interactions for logging symptoms, medications, and generating summaries.

- **Local Storage (expo-sqlite, SecureStore)** 🗄️  
  Secure local storage for sensitive PHI data — stored encrypted and never synced online.

- **Agentic AI Nudges (Rule-Based, JSON Logic)** 🧠  
  Smart symptom-related suggestions driven by static rules and graph relationships.

- **Static Graph Knowledge (Offline JSON)** 📄  
  A local JSON file simulating a graph database to power the AI nudges without network dependency.

### ⚙️ Framework
- **React Native ⚛️** – Cross-platform mobile development
- **Expo Go 📲** – Streamlined runtime and dev/test environment for React Native apps

## ☁️ Cloud Backend

### 🔧 Spring Boot API (Non-PHI Services)
Handles general app logic, such as:
- Serving static content
- Managing notifications
- System configurations (non-sensitive)

### 🧪 Python FastAPI (AI/ML Services)
Optional cloud AI layer for:
- Lightweight NLP
- Labeling non-PHI symptom input
- Future ML expansions

## 🔥 Firebase Services (Non-PHI Only)

| Service                   | Purpose                                           |
|---------------------------|---------------------------------------------------|
| **Firebase Auth** 🔐       | Email/password authentication for users          |
| **Firestore DB** 📄       | Stores app configurations, wellness tips (non-PHI) |
| **Cloud Messaging (FCM)** 📩 | Sends reminders, push notifications (non-PHI)     |
| **Analytics** 📊          | Tracks app usage events (no sensitive data logged)  |

## 🧠 Neo4j Aura (Future Use)

- **Knowledge Graph** 🔗  
  Optional hosted graph DB to provide advanced AI-driven suggestions. Used only if cloud processing is enabled and PHI isn’t involved.

## 🔐 Privacy Boundary – Local Device

- **Local Device (Encrypted PHI Storage)** 🛡️  
  All sensitive health information is:
  - Stored locally
  - Encrypted using SecureStore
  - Never sent to Firebase, Neo4j, or external APIs

## 🔄 Data Flow Connections

```
Expo Go ➝ React Native
React Native ➝ UI
UI ➝ Local Storage → Local Device         – "Encrypted PHI Storage"
UI ➝ Agentic AI Nudges                   – "Triggers Suggestions"
Agentic AI Nudges ➝ Static Graph JSON    – "Local Graph Lookup"
Agentic AI Nudges ➝ FastAPI Service      – "Optional ML Queries (Non-PHI)"
FastAPI Service ➝ Knowledge Graph        – "Optional Cloud Queries"

UI ➝ Spring Boot API                     – "Non-PHI API Calls"
Spring Boot API ➝ Cloud Messaging        – "Send Reminders"
Spring Boot API ➝ Firestore DB           – "App Content (No PHI)"
UI ➝ Firebase Auth                       – "Login/Auth"
UI ➝ Analytics                           – "Event Tracking (Non-PHI)"
```

## ✅ Summary

This architecture ensures:
- **All PHI stays local** and encrypted
- Cloud services only handle **non-sensitive tasks**
- Designed for **offline-first** usage, with clear modular separation
- Scalable future support for AI/ML via **FastAPI** and **Neo4j**
