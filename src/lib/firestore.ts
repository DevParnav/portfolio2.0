import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export type UserProfile = {
  fullName: string;
  city: string;
  country: string;
  role: string;
  experienceLevel?: string;
  bio?: string;
  interests?: string[];
  currentFocus?: string;
  goals?: string[];
  profileImage?: string;
  email?: string;
  profileCompleted?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

/**
 * Fetch a user's profile from Firestore
 * @param uid The Firebase Auth UID
 * @returns The user's profile data, or null if it doesn't exist
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  console.log("Authenticated UID (getUserProfile):", uid);
  console.log("Firestore profile path (getUserProfile):", `users/${uid}`);
  
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

/**
 * Update or create a user's profile in Firestore
 * @param uid The Firebase Auth UID
 * @param data The profile data to merge
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  console.log("Authenticated UID (updateUserProfile):", uid);
  console.log("Firestore profile path (updateUserProfile):", `users/${uid}`);
  
  try {
    const docRef = doc(db, "users", uid);
    const existingProfile = await getUserProfile(uid);
    
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: existingProfile?.createdAt || serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export type Experiment = {
  id?: string;
  userId: string;
  title: string;
  notes: string;
  date: string;
  time: string;
  createdAt?: any;
  updatedAt?: any;
};

/**
 * Save a new experiment to Firestore
 */
export async function saveExperiment(data: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const experimentsRef = collection(db, "experiments");
    const docRef = await addDoc(experimentsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving experiment:", error);
    throw error;
  }
}

/**
 * Update an existing experiment in Firestore
 */
export async function updateExperiment(id: string, data: Partial<Experiment>): Promise<void> {
  try {
    const docRef = doc(db, "experiments", id);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error("Error updating experiment:", error);
    throw error;
  }
}

/**
 * Fetch a user's experiments from Firestore
 */
export async function getUserExperiments(uid: string): Promise<Experiment[]> {
  try {
    const experimentsRef = collection(db, "experiments");
    const q = query(
      experimentsRef, 
      where("userId", "==", uid)
    );
    
    const querySnapshot = await getDocs(q);
    const experiments: Experiment[] = [];
    
    querySnapshot.forEach((doc) => {
      experiments.push({ id: doc.id, ...doc.data() } as Experiment);
    });
    
    // Sort locally to avoid requiring a Firestore composite index
    experiments.sort((a, b) => {
      // Fallback to string comparison of date + time if createdAt is missing
      const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(`${a.date}T${a.time}`).getTime();
      const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(`${b.date}T${b.time}`).getTime();
      return dateB - dateA;
    });
    
    return experiments;
  } catch (error) {
    console.error("Error fetching experiments:", error);
    throw error;
  }
}
