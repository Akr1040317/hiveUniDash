// Cal.com Configuration
// Replace these values with your actual Cal.com credentials

export const CALCOM_CONFIG = {
  // Your Cal.com API key (get from https://cal.com/settings/developer/api-keys)
  API_KEY: 'cal_live_7f30c6423533391f6d8a6d97eb315589',
  
  // Your Cal.com username (the part after cal.com/ in your booking page URL)
  USERNAME: 'akshatr',
  
  // Cal.com API base URL (usually https://api.cal.com/v1)
  BASE_URL: 'https://api.cal.com/v1',
  
  // Whether to show Cal.com events by default
  SHOW_BY_DEFAULT: true,
  
  // How often to refresh Cal.com events (in minutes)
  REFRESH_INTERVAL: 15,
  
  // Event types to include (only these specific Hive events will show)
  INCLUDED_EVENT_TYPES: [
    'Hive Investor Meeting',
    'Prepcenter Platform Demo',
    'Hive Education & Competition Consultation',
    'Hive Platform Demo',
    'Networking',
    'Hive Team Strategy Session',
    'Prepcenter Coordination Meeting'
  ],
  
  // Event types to exclude
  EXCLUDED_EVENT_TYPES: [],
  
  // Timezone for displaying events (defaults to user's timezone)
  DEFAULT_TIMEZONE: 'UTC',
};

// Helper function to check if Cal.com is configured
export const isCalComConfigured = () => {
  return CALCOM_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE' && 
         CALCOM_CONFIG.USERNAME !== 'YOUR_USERNAME_HERE';
};

// Helper function to get Cal.com settings
export const getCalComSettings = () => {
  return {
    ...CALCOM_CONFIG,
    isConfigured: isCalComConfigured(),
  };
};
