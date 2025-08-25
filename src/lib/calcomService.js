// Cal.com API Service
import { CALCOM_CONFIG, isCalComConfigured } from '@/config/calcom';

class CalComService {
  constructor() {
    this.apiKey = CALCOM_CONFIG.API_KEY;
    this.username = CALCOM_CONFIG.USERNAME;
    this.baseUrl = CALCOM_CONFIG.BASE_URL;
  }

  // Check if Cal.com is properly configured
  isConfigured() {
    return isCalComConfigured();
  }

  // Get headers for API requests
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Fetch all your bookings
  async getBookings(params = {}) {
    if (!this.isConfigured()) {
      console.warn('Cal.com is not configured. Please update your API key and username in src/config/calcom.js');
      return [];
    }

    try {
      const queryParams = new URLSearchParams({
        username: this.username,
        ...params
      });

      const response = await fetch(`${this.baseUrl}/bookings?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Cal.com API key is invalid or expired');
        } else if (response.status === 403) {
          throw new Error('Cal.com API key does not have permission to access bookings');
        } else if (response.status === 404) {
          throw new Error('Cal.com username not found');
        } else {
          throw new Error(`Cal.com API error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      return this.transformBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching Cal.com bookings:', error);
      return [];
    }
  }

  // Fetch your event types
  async getEventTypes() {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/event-types?username=${this.username}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Cal.com API error: ${response.status}`);
      }

      const data = await response.json();
      return data.event_types || [];
    } catch (error) {
      console.error('Error fetching Cal.com event types:', error);
      return [];
    }
  }

  // Transform Cal.com bookings to calendar events
  transformBookings(bookings) {
    return bookings
      .filter(booking => {
        // Filter by included/excluded event types if configured
        if (CALCOM_CONFIG.INCLUDED_EVENT_TYPES.length > 0) {
          return CALCOM_CONFIG.INCLUDED_EVENT_TYPES.includes(booking.eventType?.title);
        }
        if (CALCOM_CONFIG.EXCLUDED_EVENT_TYPES.length > 0) {
          return !CALCOM_CONFIG.EXCLUDED_EVENT_TYPES.includes(booking.eventType?.title);
        }
        return true;
      })
      .map(booking => ({
        id: `calcom-${booking.id}`,
        title: booking.title || 'Cal.com Meeting',
        description: booking.description || '',
        type: 'calcom',
        startDate: booking.startTime.split('T')[0], // Extract date from ISO string
        endDate: booking.endTime.split('T')[0],
        startTime: booking.startTime.split('T')[1].substring(0, 5), // Extract time (HH:MM)
        endTime: booking.endTime.split('T')[1].substring(0, 5),
        location: booking.location || 'Virtual',
        attendees: booking.attendees?.map(a => a.email).join(', ') || 'No attendees',
        priority: 'medium',
        originalData: booking,
        // Cal.com specific fields
        eventType: booking.eventType?.title || 'Unknown',
        status: booking.status,
        bookingId: booking.id,
        organizer: booking.organizer?.name || 'Unknown',
        timezone: booking.timezone || CALCOM_CONFIG.DEFAULT_TIMEZONE,
        // Add Cal.com booking URL for easy access
        bookingUrl: `https://cal.com/${this.username}/${booking.eventType?.slug || 'event'}`,
        // Add status-based styling
        isConfirmed: booking.status === 'ACCEPTED',
        isPending: booking.status === 'PENDING',
        isCancelled: booking.status === 'CANCELLED'
      }));
  }

  // Get bookings for a specific date range
  async getBookingsForDateRange(startDate, endDate) {
    const params = {
      startTime: startDate,
      endTime: endDate,
    };
    return await this.getBookings(params);
  }

  // Get today's bookings
  async getTodayBookings() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getBookingsForDateRange(today, today);
  }

  // Get this week's bookings
  async getThisWeekBookings() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];
    
    return await this.getBookingsForDateRange(startDate, endDate);
  }

  // Get this month's bookings
  async getThisMonthBookings() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];
    
    return await this.getBookingsForDateRange(startDate, endDate);
  }

  // Test API connection
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, error: 'Cal.com is not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/event-types?username=${this.username}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        return { success: true, message: 'Cal.com connection successful' };
      } else {
        return { success: false, error: `API error: ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const calComService = new CalComService();
export default calComService;

// Also export the class for testing or custom instances
export { CalComService };
