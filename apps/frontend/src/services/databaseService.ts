import { db } from '../config/firebaseConfig';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface SymptomEntry {
  id?: string;
  userId: string;
  symptoms: string[];
  severity: number;
  notes?: string;
  date: Date;
  createdAt: Date;
}

export interface MedicationEntry {
  id?: string;
  userId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeTaken: Date;
  notes?: string;
  createdAt: Date;
}

// Symptom tracking functions
export const addSymptomEntry = async (entry: Omit<SymptomEntry, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'symptoms'), {
      ...entry,
      date: Timestamp.fromDate(entry.date),
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserSymptoms = async (userId: string): Promise<SymptomEntry[]> => {
  try {
    const q = query(
      collection(db, 'symptoms'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate()
    })) as SymptomEntry[];
  } catch (error) {
    throw error;
  }
};

// Medication tracking functions
export const addMedicationEntry = async (entry: Omit<MedicationEntry, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'medications'), {
      ...entry,
      timeTaken: Timestamp.fromDate(entry.timeTaken),
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserMedications = async (userId: string): Promise<MedicationEntry[]> => {
  try {
    const q = query(
      collection(db, 'medications'),
      where('userId', '==', userId),
      orderBy('timeTaken', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timeTaken: doc.data().timeTaken.toDate(),
      createdAt: doc.data().createdAt.toDate()
    })) as MedicationEntry[];
  } catch (error) {
    throw error;
  }
};

// Generic CRUD operations
export const updateDocument = async (collectionName: string, docId: string, data: any): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};
