import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseInstances } from './firebase';

// Generic function to get data from Firestore
export const getData = async (region, collectionName, filters = {}, sortBy = null, limitCount = null) => {
  try {
    const { db } = getFirebaseInstances(region);
    const collectionRef = collection(db, collectionName);
    
    let q = collectionRef;
    
    // Only apply filters if they actually have values and are not empty
    const validFilters = Object.entries(filters).filter(([key, value]) => 
      value !== undefined && value !== null && value !== '' && 
      !(Array.isArray(value) && value.length === 0)
    );
    
    if (validFilters.length > 0) {
      validFilters.forEach(([key, value]) => {
        q = query(q, where(key, '==', value));
      });
    }
    
    // Apply sorting only if specified and the field exists
    if (sortBy && sortBy.field) {
      try {
        q = query(q, orderBy(sortBy.field, sortBy.direction || 'desc'));
      } catch (error) {
        console.warn(`Could not apply sorting by ${sortBy.field}:`, error);
        // Continue without sorting if the field doesn't exist
      }
    }
    
    // Apply limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const data = [];
    
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return data;
  } catch (error) {
    console.error(`Error getting ${collectionName} data:`, error);
    // Return empty array instead of throwing error
    return [];
  }
};

// Generic function to get a single document
export const getDocument = async (region, collectionName, documentId) => {
  try {
    const { db } = getFirebaseInstances(region);
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting ${collectionName} document:`, error);
    return null;
  }
};

// Generic function to add a document
export const addDocument = async (region, collectionName, data) => {
  try {
    const { db } = getFirebaseInstances(region);
    const collectionRef = collection(db, collectionName);
    
    // Add timestamp
    const documentData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const docRef = await addDoc(collectionRef, documentData);
    return {
      id: docRef.id,
      ...documentData
    };
  } catch (error) {
    console.error(`Error adding ${collectionName} document:`, error);
    throw error;
  }
};

// Generic function to update a document
export const updateDocument = async (region, collectionName, documentId, data) => {
  try {
    const { db } = getFirebaseInstances(region);
    const docRef = doc(db, collectionName, documentId);
    
    // Add updated timestamp
    const updateData = {
      ...data,
      updated_at: new Date()
    };
    
    await updateDoc(docRef, updateData);
    return {
      id: documentId,
      ...updateData
    };
  } catch (error) {
    console.error(`Error updating ${collectionName} document:`, error);
    throw error;
  }
};

// Generic function to delete a document
export const deleteDocument = async (region, collectionName, documentId) => {
  try {
    const { db } = getFirebaseInstances(region);
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting ${collectionName} document:`, error);
    throw error;
  }
};

// Content-specific functions
export const getContent = async (region, filters = {}) => {
  // For now, return empty array since content collection doesn't exist
  // This can be updated when you create the content collection
  return [];
};

export const getContentById = async (region, contentId) => {
  return null;
};

export const createContent = async (region, contentData) => {
  throw new Error('Content collection not yet implemented');
};

export const updateContent = async (region, contentId, contentData) => {
  throw new Error('Content collection not yet implemented');
};

export const deleteContent = async (region, contentId) => {
  throw new Error('Content collection not yet implemented');
};

// Bug-specific functions
export const getBugs = async (region, filters = {}) => {
  // For Dubai region, use the feedbackAndBugs collection
  if (region === 'dubai') {
    return await getData(region, 'feedbackAndBugs', { type: 'bug_report' }, { field: 'timestamp', direction: 'desc' });
  }
  // For US region, return empty array since bugs collection doesn't exist yet
  return [];
};

export const getBugById = async (region, bugId) => {
  if (region === 'dubai') {
    return await getDocument(region, 'feedbackAndBugs', bugId);
  }
  return null;
};

export const createBug = async (region, bugData) => {
  if (region === 'dubai') {
    return await addDocument(region, 'feedbackAndBugs', bugData);
  }
  throw new Error('Bug collection not yet implemented for US region');
};

export const updateBug = async (region, bugId, bugData) => {
  if (region === 'dubai') {
    return await updateDocument(region, 'feedbackAndBugs', bugId, bugData);
  }
  throw new Error('Bug collection not yet implemented for US region');
};

export const deleteBug = async (region, bugId) => {
  if (region === 'dubai') {
    return await deleteDocument(region, 'feedbackAndBugs', bugId);
  }
  throw new Error('Bug collection not yet implemented for US region');
};

// Feature functions
export const getFeatures = async (region = 'us') => {
  try {
    const { db } = getFirebaseInstances(region);
    const featuresRef = collection(db, 'planning');
    const q = query(featuresRef, where('type', '==', 'feature'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'Feature' // Ensure type is set for dashboard display
    }));
  } catch (error) {
    console.error('Error getting features:', error);
    return [];
  }
};

export const getFeatureById = async (region, featureId) => {
  return null;
};

export const createFeature = async (featureData, region = 'us') => {
  try {
    const { db } = getFirebaseInstances(region);
    const featuresRef = collection(db, 'planning');
    const docRef = await addDoc(featuresRef, {
      ...featureData,
      type: 'feature',
      createdAt: serverTimestamp(),
      region: region
    });
    return { id: docRef.id, ...featureData };
  } catch (error) {
    console.error('Error creating feature:', error);
    throw error;
  }
};

export const updateFeature = async (featureId, updateData, region = 'us') => {
  try {
    const { db } = getFirebaseInstances(region);
    const featureRef = doc(db, 'planning', featureId);
    await updateDoc(featureRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { id: featureId, ...updateData };
  } catch (error) {
    console.error('Error updating feature:', error);
    throw error;
  }
};

export const deleteFeature = async (featureId, region = 'us') => {
  try {
    const { db } = getFirebaseInstances(region);
    const featureRef = doc(db, 'planning', featureId);
    await deleteDoc(featureRef);
    return true;
  } catch (error) {
    console.error('Error deleting feature:', error);
    throw error;
  }
};

// Analytics-specific functions
export const getAnalytics = async (region, filters = {}) => {
  // For now, return empty array since analytics collection doesn't exist
  // This can be updated when you create the analytics collection
  return [];
};

export const createAnalytics = async (region, analyticsData) => {
  throw new Error('Analytics collection not yet implemented');
};

// Event-specific functions
export const getEvents = async (region, filters = {}) => {
  // For now, return empty array since events collection doesn't exist
  // This can be updated when you create the events collection
  return [];
};

export const getEventById = async (region, eventId) => {
  return null;
};

export const createEvent = async (region, eventData) => {
  throw new Error('Events collection not yet implemented');
};

export const updateEvent = async (region, eventId, eventData) => {
  throw new Error('Events collection not yet implemented');
};

export const deleteEvent = async (region, eventId) => {
  throw new Error('Events collection not yet implemented');
};
