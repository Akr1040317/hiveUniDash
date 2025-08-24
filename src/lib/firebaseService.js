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
  limit 
} from 'firebase/firestore';
import { getFirebaseInstances } from './firebase';

// Generic function to get data from Firestore
export const getData = async (region, collectionName, filters = {}, sortBy = null, limitCount = null) => {
  try {
    const { db } = getFirebaseInstances(region);
    const collectionRef = collection(db, collectionName);
    
    let q = collectionRef;
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          q = query(q, where(key, '==', value));
        }
      });
    }
    
    // Apply sorting
    if (sortBy) {
      q = query(q, orderBy(sortBy.field, sortBy.direction || 'desc'));
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
    throw error;
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
    throw error;
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
  return await getData(region, 'content', filters, { field: 'created_at', direction: 'desc' });
};

export const getContentById = async (region, contentId) => {
  return await getDocument(region, 'content', contentId);
};

export const createContent = async (region, contentData) => {
  return await addDocument(region, 'content', contentData);
};

export const updateContent = async (region, contentId, contentData) => {
  return await updateDocument(region, 'content', contentId, contentData);
};

export const deleteContent = async (region, contentId) => {
  return await deleteDocument(region, 'content', contentId);
};

// Bug-specific functions
export const getBugs = async (region, filters = {}) => {
  return await getData(region, 'bugs', filters, { field: 'created_at', direction: 'desc' });
};

export const getBugById = async (region, bugId) => {
  return await getDocument(region, 'bugs', bugId);
};

export const createBug = async (region, bugData) => {
  return await addDocument(region, 'bugs', bugData);
};

export const updateBug = async (region, bugId, bugData) => {
  return await updateDocument(region, 'bugs', bugId, bugData);
};

export const deleteBug = async (region, bugId) => {
  return await deleteDocument(region, 'bugs', bugId);
};

// Feature-specific functions
export const getFeatures = async (region, filters = {}) => {
  return await getData(region, 'features', filters, { field: 'created_at', direction: 'desc' });
};

export const getFeatureById = async (region, featureId) => {
  return await getDocument(region, 'features', featureId);
};

export const createFeature = async (region, featureData) => {
  return await addDocument(region, 'features', featureData);
};

export const updateFeature = async (region, featureId, featureData) => {
  return await updateDocument(region, 'features', featureId, featureData);
};

export const deleteFeature = async (region, featureId) => {
  return await deleteDocument(region, 'features', featureId);
};

// Analytics-specific functions
export const getAnalytics = async (region, filters = {}) => {
  return await getData(region, 'analytics', filters, { field: 'created_at', direction: 'desc' });
};

export const createAnalytics = async (region, analyticsData) => {
  return await addDocument(region, 'analytics', analyticsData);
};

// Event-specific functions
export const getEvents = async (region, filters = {}) => {
  return await getData(region, 'events', filters, { field: 'date', direction: 'asc' });
};

export const getEventById = async (region, eventId) => {
  return await getDocument(region, 'events', eventId);
};

export const createEvent = async (region, eventData) => {
  return await addDocument(region, 'events', eventData);
};

export const updateEvent = async (region, eventId, eventData) => {
  return await updateDocument(region, 'events', eventId, eventData);
};

export const deleteEvent = async (region, eventId) => {
  return await deleteDocument(region, 'events', eventId);
};
