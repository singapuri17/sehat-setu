// Firebase service layer for patient data and documents
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PatientData {
  id?: string;
  name: string;
  age: number;
  gender: string;
  language: string;
  chiefComplaint: string;
  medicalHistory: Record<string, any>;
  documents: DocumentReference[];
  status: 'pending' | 'ready' | 'in-consultation' | 'completed';
  tokenNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentReference {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

// ─── Patient Operations ───────────────────────────────────────────────────────

/**
 * Create a new patient case
 */
export async function createPatientCase(
  patientData: Omit<PatientData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'patients'), {
      ...patientData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating patient case:', error);
    throw new Error('Failed to create patient case');
  }
}

/**
 * Get patient case by ID
 */
export async function getPatientCase(patientId: string): Promise<PatientData | null> {
  try {
    const docRef = doc(db, 'patients', patientId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as PatientData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching patient case:', error);
    throw new Error('Failed to fetch patient case');
  }
}

/**
 * Get all patient cases (for doctor dashboard)
 */
export async function getAllPatientCases(
  status?: PatientData['status']
): Promise<PatientData[]> {
  try {
    let q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));

    if (status) {
      q = query(
        collection(db, 'patients'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as PatientData[];
  } catch (error) {
    console.error('Error fetching patient cases:', error);
    throw new Error('Failed to fetch patient cases');
  }
}

/**
 * Update patient case
 */
export async function updatePatientCase(
  patientId: string,
  updates: Partial<PatientData>
): Promise<void> {
  try {
    const docRef = doc(db, 'patients', patientId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating patient case:', error);
    throw new Error('Failed to update patient case');
  }
}

// ─── Document Operations ──────────────────────────────────────────────────────

/**
 * Upload medical document to Firebase Storage
 */
export async function uploadMedicalDocument(
  patientId: string,
  file: File
): Promise<DocumentReference> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `patients/${patientId}/documents/${filename}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      id: filename,
      name: file.name,
      type: file.type,
      url: downloadURL,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
}

/**
 * Delete medical document from Firebase Storage
 */
export async function deleteMedicalDocument(
  patientId: string,
  documentId: string
): Promise<void> {
  try {
    const storageRef = ref(storage, `patients/${patientId}/documents/${documentId}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}

// ─── Token Generation ─────────────────────────────────────────────────────────

/**
 * Generate unique token number for patient
 */
export function generateTokenNumber(): string {
  const prefix = 'A'; // Can be customized based on department
  const number = Math.floor(100 + Math.random() * 900); // 100-999
  return `${prefix}-${number}`;
}
