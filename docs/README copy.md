# 🩺 Project Summary: PatientPrep SL – Your Smart Consultation Companion

## 📌 Overview

**PatientPrep SL** is a mobile healthcare companion app designed for patients in Sri Lanka to **prepare more effectively for medical consultations**. It helps users organize their symptoms, medications, and questions before seeing a doctor — improving the quality and efficiency of healthcare interactions.

This app focuses on **delivering the best possible user experience and intelligent output**, using advanced AI (Gemini Pro LLM via LangChain), scalable cloud infrastructure, and agentic suggestions. While privacy is considered, the priority is now on providing high-quality, dynamic responses, which may involve processing some health data in the cloud.

---

## 🎯 Key Objectives

- Help patients log health details clearly before doctor visits
- Provide intelligent “agentic” nudges to help users think about what to ask or note
- Provide high-quality, dynamic AI-powered suggestions and responses, even if some health data is processed in the cloud
- Build a foundation for future **AI/ML enhancements** using Gemini Pro LLM and LangChain

---

## 🧠 Core Features

- 📋 **Symptom Logger** with structured input (onset, severity, etc.)
- 💊 **Medication Tracker** with dosage & frequency
- ❓ **Question Builder** for doctor queries
- 📆 **Appointment Planner**
- 🧠 **Agentic AI Nudges** (symptom-linked suggestions)
- 🗒️ **Post-consultation Notes**
- 📜 **Consultation Summary Generator**
- 🤖 **AI-powered suggestions using Gemini Pro LLM via LangChain**
- 🔒 **Local storage for PHI where possible, but some data may be processed in the cloud for better AI output**
- 🔔 **Optional appointment reminders**

---

## 🏗️ Technical Architecture & Technology Stack

### 1️⃣ Frontend (Mobile App)

| Component          | Stack / Tool                                      |
|--------------------|---------------------------------------------------|
| Framework          | React Native with Expo Go                         |
| Languages          | JavaScript / TypeScript                           |
| Design Tool        | Figma (AI-augmented tools like Diagram/Magician)  |
| UI Features        | Symptom log, medication tracker, question builder |
| UI Style           | Forms and mobile-friendly structured inputs       |
| Offline Capability | Fully offline for all core patient features       |

---

### 2️⃣ Local Data Storage (for PHI)

| Purpose               | Tool                      |
|-----------------------|---------------------------|
| Secure storage        | Expo SecureStore          |
| Structured DB         | SQLite via `expo-sqlite`  |
| Cloud sync for PHI    | ❌ Not used                |
| PHI Data Policy       | 🔒 Stored **only on device** |

---

### 3️⃣ AI / Agentic Suggestion Layer

| Component                 | Stack / Tool                                      |
|---------------------------|---------------------------------------------------|
| Agentic AI logic          | Gemini Pro LLM via LangChain, Neo4j for ontology  |
| Knowledge Graph           | Neo4j (exported as JSON or via Neo4j Aura Cloud)  |
| AI Development            | Python (e.g., symptom-question dataset building)  |
| ML Enhancement (optional) | TensorFlow Lite classifier (on-device)            |

---

### 4️⃣ Backend Services (Non-PHI, Optional Cloud)

| Component       | Stack                           |
|-----------------|----------------------------------|
| Framework       | Spring Boot (Java) or Node.js    |
| Purpose         | App logic, notifications, static tips |
| Hosting         | Firebase Hosting or private server |

---

### 5️⃣ Firebase Integration (Non-sensitive Services Only)

| Feature             | Stack                             |
|---------------------|------------------------------------|
| Authentication      | Firebase Auth (email/password)     |
| Static Content       | Firebase Firestore or Realtime DB  |
| Push Notifications  | Firebase Cloud Messaging (FCM)     |
| Analytics (non-PHI) | Firebase Analytics                 |
| Legal Hosting       | Firebase Hosting                   |

---

### 6️⃣ Python Utility Layer (AI/ML Development)

| Purpose              | Toolset                            |
|----------------------|------------------------------------|
| Data preprocessing   | Python (pandas, NumPy)             |
| AI suggestion engine | Python (scikit-learn, NLTK)        |
| Export logic         | JSON format for mobile integration |
| Future integration   | FastAPI for AI microservices       |

---

## 🔐 Privacy & Compliance

| Rule                         | Implementation Description                                 |
|------------------------------|-------------------------------------------------------------|
| Cloud processing of health data | Some health data may be processed in the cloud for AI-powered features |
| PDPA compliance (where possible) | Efforts made to comply, but some features may require cloud processing |
| Explicit user consent        | Required for notifications, analytics, and AI features      |
| App disclaimer & limitations | Users are informed that some data may be sent to external AI services; not a diagnostic tool or emergency service |

---

## 🌐 Offline vs Online Behavior

| Module                       | Offline | Online |
|-----------------------------|:-------:|:------:|
| Symptom logging, questions  | ✅      | ✅ (for enhanced AI output) |
| Agentic AI (Gemini Pro LLM) | ❌      | ✅     |
| Firebase Auth (first time)  | ❌      | ✅     |
| Notifications (FCM)         | ❌      | ✅     |
| Admin & analytics           | ❌      | ✅     |
| Dynamic AI with Neo4j Aura  | ❌      | ✅     |

---

## 📈 Future Enhancements

- Add cloud sync (opt-in) using HIPAA/PDPA-compliant services
- Integrate lightweight or on-device LLMs for NLP suggestions
- Build a dashboard to track personal health trends
- Support Sinhala/Tamil interfaces and voice input

---

## 🧾 Conclusion

**PatientPrep SL** is a user-focused, AI-powered mobile app that empowers patients with structured preparation and intelligent, agentic suggestions. It uses a hybrid stack of modern mobile technologies, secure local storage, graph-based AI reasoning (via Neo4j), Gemini Pro LLM via LangChain for advanced suggestions, and scalable backend support through Firebase and Spring Boot/Node.js. Some health data may be processed in the cloud to provide the best possible user experience and output.

