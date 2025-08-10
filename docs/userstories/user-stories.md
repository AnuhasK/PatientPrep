# 📖 PatientPrep SL - Product Backlog

| Epic | Features | User Stories |
|------|----------|--------------|
| **Authentication & Security** | Welcome Screen | 1. Display Welcome Screen on App Launch for new Users |
| | User Login screens | 2. Providing a Secure Login Screen |
| | | 3. Allow Users to Log in Using Biometric Authentication |
| | | 4. Login Using Google Authentication |
| | Password reset link | 5. Allow Users to Reset Forgotten Passwords |
| | Sign in screens | 6. Allow New Users to Sign Up Easily |
| | | 7. Enable Google Authentication for Sign-Up |
| | | 8. Allow Users to Enable Biometric Authentication During Sign-Up |
| | Multifactor authentication | 9. Provide Option for Users to Enable Multi-Factor Authentication (MFA) |
| | | 10. Enable Multi-Factor Authentication via SMS/email |
| | | 11. Allow Users to Disable Multi-Factor Authentication (MFA) |
| **Patient Data Management** | Conversational Interface | 12. Use chatbot-like interface for natural health data input |
| | | 13. Allow users to type freely about symptoms in natural language |
| | | 14. Parse and extract structured data from conversational input |
| | | 15. Ask follow-up questions to clarify missing information |
| | | 16. Confirm extracted data with user before saving |
| | Symptom Data Structure (Backend) | 17. Store symptoms with structured details (onset, severity, duration, triggers) |
| | | 18. Automatically record symptom name and description with timestamps |
| | | 19. Store severity ratings on a scale (1-10) from conversational input |
| | | 20. Capture duration and frequency patterns from chat |
| | | 21. Store triggers or related factors extracted from conversation |
| | Medication Data Structure (Backend) | 22. Store comprehensive list of current medications |
| | | 23. Automatically extract medication name, dosage, and frequency from chat |
| | | 24. Parse and store medication details from natural language input |
| | | 25. Capture start and end dates for medications from conversation |
| | | 26. Store side effects or reactions mentioned in chat |
| | | 27. Track medication status as active or discontinued |
| | Medical History Data Structure (Backend) | 28. Store and organize past medical conditions |
| | | 29. Automatically record surgical history with dates from conversation |
| | | 30. Maintain allergy list with severity levels from chat input |
| | | 31. Auto-categorize conditions by type from conversational data |
| **Consultation Preparation** | Conversational Question Building | 32. Build questions through natural conversation |
| | | 33. Allow users to express concerns in their own words |
| | | 34. Convert conversational input into structured questions |
| | | 35. Suggest related questions based on user concerns |
| | Question Data Structure (Backend) | 36. Store and organize list of questions for doctor |
| | | 37. Auto-categorize questions by type from conversation |
| | | 38. Assign priority levels to questions based on context |
| | | 39. Track questions as answered/unanswered during consultation |
| | | 40. Store commonly asked questions as reusable templates |
| | Pre-Visit Summary | 41. Generate summary of current symptoms, medications, and questions |
| | | 42. Automatically compile recent symptoms |
| | | 43. Include current medications in summary |
| | | 44. Highlight priority questions |
| **AI-Powered Assistance** | Natural Language Processing | 45. Process and understand natural language input |
| | | 46. Extract medical entities from conversational text |
| | | 47. Identify symptoms, medications, and conditions from free text |
| | | 48. Handle medical terminology and common misspellings |
|
| | Conversational AI | 50. Provide ChatGPT-like conversational experience |
| | | 51. Ask intelligent follow-up questions |
| | | 52. Maintain conversation context and history |
| | | 53. Provide empathetic and supportive responses |
| | | 54. Guide users through data collection process |
| | Symptom Suggestions | 55. Receive relevant suggestions for additional symptoms to monitor |
| | | 56. AI suggests related symptoms based on logged data |
| | | 57. Accept or dismiss AI suggestions |
| | | 58. Learn from user responses locally |
| | | 59. Work offline using local knowledge base |
| | Question Recommendations | 60. Receive suggested questions based on symptoms and medications |
| | | 61. Categorize AI-suggested questions by importance |
| | | 62. Include follow-up questions in suggestions |
| | | 63. Customize suggested questions |
| | Interaction Alerts | 64. Alert about potential medication interactions |
| | | 65. Check for basic drug interactions when adding medications |
| | | 66. Show severity level and description of interactions |
| | | 67. Encourage discussion with healthcare provider |
| **Appointment Management** | Appointment Scheduling | 68. Schedule and manage upcoming appointments |
| | | 69. Add appointment details (date, time, doctor, location) |
| | | 70. Set appointment types (check-up, specialist, etc.) |
| | | 71. Attach preparation notes to specific appointments |
| | | 72. Display appointments in calendar view |
| | Appointment Reminders | 73. Receive timely reminders about upcoming appointments |
| | | 74. Set custom reminder times (hours/days before) |
| | | 75. Include appointment details and preparation checklist |
| | | 76. Snooze or dismiss reminders |
| | Pre-Appointment Checklist | 77. Have checklist of items to prepare or bring |
| | | 78. Generate appointment-specific checklists |
| | | 79. Include documents, medications, questions |
| | | 80. Customize checklist items |
| | | 81. Mark items as completed |
| **Post-Consultation Activities** | Consultation Notes | 82. Record what happened during appointment |
| | | 83. Record doctor's observations and recommendations |
| | | 84. Note prescribed medications or treatment changes |
| | | 85. Set follow-up reminders based on doctor's advice |
| | Treatment Tracking | 86. Track adherence to prescribed treatments |
| | | 87. Create treatment schedules based on recommendations |
| | | 88. Mark treatments as completed or missed |
| | | 89. Track adherence patterns |
| | | 90. Add notes about treatment effectiveness |
| | Follow-up Scheduling | 91. Schedule follow-up appointments based on recommendations |
| | | 92. Schedule follow-ups with recommended timeframes |
| | | 93. Link follow-up appointments to previous consultations |
| | | 94. Set different follow-up types (routine, urgent, specialist) |
| **Offline-First Experience** | Complete Offline Functionality | 95. Use all core app features without internet connection |
| | | 96. Symptom logging works offline |
| | | 97. Medication tracking functions offline |
| | | 98. Question building works offline |
| | | 99. AI nudges work with local knowledge base |
| | Local Data Sync | 100. Sync data when internet connectivity is available |
| | | 101. Automatic sync when online |
| | | 102. Intelligent sync conflict resolution |
| | | 103. Notify user of sync status |
| | | 104. Support partial syncs for poor connectivity |
| | Offline AI | 105. Receive intelligent suggestions without internet |
| | | 106. Local knowledge base provides suggestions |
| | | 107. Rule-based AI works offline |
| | | 108. Question suggestions available offline |

---

## 🔄 Cross-Epic Requirements

| Requirement | Description |
|-------------|-------------|
| **PDPA Compliance** | App complies with Sri Lanka's Personal Data Protection Act |

| **Emergency Disclaimer** | Clear disclaimers about emergency situations and app limitations |
| **Data Privacy** | All PHI encrypted and stored locally, never transmitted |
| **Medical Disclaimer** | App is not a substitute for professional medical care |

---

## 📈 Future Enhancements

| Feature | Description |
|---------|-------------|
| **Voice Input** | Voice input for logging symptoms and questions |
| **Provider Portal** | Healthcare provider interface for patient information |
| **Family Management** | Manage health information for multiple family members |
| **Advanced AI** | Integration with cloud-based LLMs for enhanced suggestions |

---

## 📝 Epic Prioritization

**High Priority (MVP):**
- Authentication & Security
- Patient Data Management  
- Consultation Preparation
- Offline-First Experience

**Medium Priority:**
- AI-Powered Assistance
- Appointment Management
- Post-Consultation Activities

**Low Priority:**
- Admin & Analytics
- Future Enhancements

---

*This Product Backlog serves as a comprehensive guide for development planning and should be updated as requirements evolve and user feedback is incorporated.*
