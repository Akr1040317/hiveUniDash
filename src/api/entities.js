import { 
  getContent, 
  getContentById, 
  createContent, 
  updateContent, 
  deleteContent,
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  getAnalytics,
  createAnalytics,
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz
} from '@/lib/firebaseService';

// Content entity
export const Content = {
  filter: async (filters, sort) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await getContent(region, filters);
    } catch (error) {
      console.error('Error filtering content:', error);
      return [];
    }
  },
  create: async (data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await createContent(region, data);
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await updateContent(region, id, data);
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await deleteContent(region, id);
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }
};

// Bug entity
export const Bug = {
  filter: async (filters, sort) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await getBugs(region, filters);
    } catch (error) {
      console.error('Error filtering bugs:', error);
      return [];
    }
  },
  create: async (data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await createBug(region, data);
    } catch (error) {
      console.error('Error creating bug:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await updateBug(region, id, data);
    } catch (error) {
      console.error('Error updating bug:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await deleteBug(region, id);
    } catch (error) {
      console.error('Error deleting bug:', error);
      throw error;
    }
  }
};

// Feature entity
export const Feature = {
  filter: async (filters, sort) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await getFeatures(region, filters);
    } catch (error) {
      console.error('Error filtering features:', error);
      return [];
    }
  },
  create: async (data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await createFeature(region, data);
    } catch (error) {
      console.error('Error creating feature:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await updateFeature(region, id, data);
    } catch (error) {
      console.error('Error updating feature:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await deleteFeature(region, id);
    } catch (error) {
      console.error('Error deleting feature:', error);
      throw error;
    }
  }
};

// Analytics entity
export const Analytics = {
  filter: async (filters, sort) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await getAnalytics(region, filters);
    } catch (error) {
      console.error('Error filtering analytics:', error);
      return [];
    }
  },
  create: async (data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await createAnalytics(region, data);
    } catch (error) {
      console.error('Error creating analytics:', error);
      throw error;
    }
  }
};

// Event entity
export const Event = {
  filter: async (filters, sort) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await getEvents(region, filters);
    } catch (error) {
      console.error('Error filtering events:', error);
      return [];
    }
  },
  create: async (data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await createEvent(region, data);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await updateEvent(region, id, data);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const region = localStorage.getItem('hive_region') || 'us';
      return await deleteEvent(region, id);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

// Quiz entity
export const Quiz = {
  filter: async (filters = {}, sortBy = null, limit = null) => {
    try {
      const currentRegion = localStorage.getItem('hive_region') || 'us';
      return await getQuizzes(currentRegion);
    } catch (error) {
      console.error('Error filtering quizzes:', error);
      return [];
    }
  },

  get: async (id) => {
    try {
      const currentRegion = localStorage.getItem('hive_region') || 'us';
      return await getQuiz(id, currentRegion);
    } catch (error) {
      console.error('Error getting quiz:', error);
      return null;
    }
  },

  create: async (quizData) => {
    try {
      const currentRegion = localStorage.getItem('hive_region') || 'us';
      return await createQuiz(quizData, currentRegion);
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  update: async (id, quizData) => {
    try {
      const currentRegion = localStorage.getItem('hive_region') || 'us';
      return await updateQuiz(id, quizData, currentRegion);
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const currentRegion = localStorage.getItem('hive_region') || 'us';
      return await deleteQuiz(id, currentRegion);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }
};

// User entity (mock for now, can be extended with Firebase Auth)
export const User = {
  me: async () => {
    const userData = localStorage.getItem('hive_user');
    if (userData) {
      return JSON.parse(userData);
    }
    return {
      full_name: "Hive User",
      email: "user@hive.com",
      role: "admin",
      avatar_url: null
    };
  },
  logout: async () => {
    localStorage.removeItem('hive_user');
    localStorage.removeItem('hive_region');
    return true;
  }
};