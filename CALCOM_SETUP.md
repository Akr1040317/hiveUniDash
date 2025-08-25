# Cal.com Integration Setup Guide

This guide will help you integrate your Cal.com bookings with the Hive Dashboard calendar.

## 🔑 **Step 1: Get Your Cal.com API Key**

1. **Sign in to Cal.com**: Go to [cal.com](https://cal.com) and sign in to your account
2. **Navigate to Developer Settings**: Go to **Settings** → **Developer** → **API Keys**
3. **Create New API Key**: Click "Create New API Key"
4. **Set Permissions**: Ensure the key has access to:
   - `bookings:read` - Read your bookings
   - `event_types:read` - Read your event types
5. **Copy the API Key**: Save this key securely

## 👤 **Step 2: Get Your Username**

1. **Find Your Username**: Your username is the part after `cal.com/` in your booking page URL
   - Example: If your booking page is `cal.com/johndoe`, your username is `johndoe`
2. **Note Your Username**: You'll need this for the configuration

## ⚙️ **Step 3: Configure the Integration**

1. **Open Configuration File**: Edit `src/config/calcom.js`
2. **Update Credentials**:
   ```javascript
   export const CALCOM_CONFIG = {
     API_KEY: 'your_actual_api_key_here',
     USERNAME: 'your_actual_username_here',
     // ... other settings
   };
   ```
3. **Save the File**: Make sure to save your changes

## 🔧 **Step 4: Customize Settings (Optional)**

You can customize how Cal.com events appear:

```javascript
export const CALCOM_CONFIG = {
  // ... credentials ...
  
  // Show Cal.com events by default
  SHOW_BY_DEFAULT: true,
  
  // Refresh events every 15 minutes
  REFRESH_INTERVAL: 15,
  
  // Only show specific event types
  INCLUDED_EVENT_TYPES: ['Consultation', 'Meeting'],
  
  // Exclude specific event types
  EXCLUDED_EVENT_TYPES: ['Free Slot'],
  
  // Default timezone
  DEFAULT_TIMEZONE: 'America/New_York',
};
```

## ✅ **Step 5: Test the Integration**

1. **Restart Your App**: Restart your development server
2. **Go to Calendar**: Navigate to the Calendar page
3. **Check Cal.com Events**: Look for the "Show Cal.com Events" toggle
4. **Verify Events**: Cal.com events should appear with teal color and external link icon

## 🎯 **Features Available**

### **Automatic Event Display**:
- All your Cal.com bookings appear automatically
- Events are color-coded (teal) and marked as external
- Event details include title, time, attendees, and location

### **Smart Filtering**:
- Only shows events for the current month view
- Can filter by specific event types
- Excludes cancelled or declined bookings

### **Easy Access**:
- Click on Cal.com events to see details
- Events link back to your Cal.com dashboard
- Toggle Cal.com events on/off as needed

## 🔒 **Security & Privacy**

### **Private by Default**:
- Only you can see your Cal.com events
- API key is stored in your local configuration
- No data is shared with third parties

### **API Key Security**:
- Never commit your API key to version control
- Keep your API key secure and private
- Rotate your API key periodically

## 🚨 **Troubleshooting**

### **Events Not Showing**:
1. Check your API key is correct
2. Verify your username is correct
3. Ensure your API key has proper permissions
4. Check browser console for error messages

### **API Errors**:
- **401**: Invalid or expired API key
- **403**: API key lacks permissions
- **404**: Username not found
- **429**: Rate limit exceeded (wait and retry)

### **Common Issues**:
- **No Events**: Check if you have any confirmed bookings
- **Wrong Timezone**: Update DEFAULT_TIMEZONE in config
- **Missing Event Types**: Ensure event types are public

## 📱 **Mobile & Responsiveness**

The Cal.com integration works on all devices:
- **Desktop**: Full calendar view with all events
- **Tablet**: Responsive layout with touch-friendly controls
- **Mobile**: Optimized for small screens

## 🔄 **Keeping Events Updated**

Events are automatically refreshed:
- **On Page Load**: Events load when you visit the calendar
- **On Month Change**: Events refresh when navigating months
- **Manual Refresh**: Toggle Cal.com events off/on to refresh

## 📞 **Support**

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Cal.com API key and username
3. Test your API key directly with Cal.com's API
4. Check Cal.com's status page for service issues

---

**Note**: This integration is designed for personal/private use. Your Cal.com events are only visible to you and are not shared with other users of the Hive Dashboard.
