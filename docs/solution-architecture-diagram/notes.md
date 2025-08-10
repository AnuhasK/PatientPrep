# Solution Architecture Diagram Notes

## Overview
This document outlines the key components and design decisions for the solution architecture of the PatientPrep SL application.

## Components
1. **Frontend**
   - **React Native with Expo Go**: Chosen for its cross-platform capabilities, allowing for a seamless user experience on both iOS and Android devices. The use of Expo simplifies the development process and provides built-in support for offline functionality.

2. **Backends**
   - **Python**: Utilized for the AI suggestion engine, leveraging libraries such as scikit-learn and NLTK for natural language processing and machine learning tasks.
   - **Spring Boot**: Serves as the backend framework for handling application logic, notifications, and static content delivery.

3. **Database**
   - **Google Firebase Firestore**: Selected for its real-time database capabilities, enabling efficient OLTP transactions and easy integration with the mobile app for user authentication and data storage.
   - **Neo4j Aura**: Used for the agentic AI component, providing a graph database to manage relationships between symptoms, medications, and user queries, facilitating intelligent suggestions.

## Design Decisions
- **Privacy and Compliance**: All health data is stored locally and encrypted, with no PHI transmitted to the cloud, ensuring compliance with PDPA regulations.
- **Offline Functionality**: The architecture is designed to support full offline capabilities for core features, enhancing user experience in areas with limited connectivity.

## Component Interactions
- The React Native frontend communicates with both the Python and Spring Boot backends via RESTful APIs.
- Firebase Firestore handles user data and authentication, while Neo4j Aura provides dynamic suggestions based on user input and historical data.

## Future Considerations
- Potential integration of on-device machine learning models for enhanced performance and privacy.
- Exploration of additional cloud services for optional data synchronization, ensuring compliance with healthcare data regulations.