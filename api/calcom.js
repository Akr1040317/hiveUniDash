// Vercel API route to proxy Cal.com API calls
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get query parameters
  const { username, startTime, endTime, type } = req.query;

  // Validate required parameters
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Cal.com API configuration
    const apiKey = 'cal_live_7f30c6423533391f6d8a6d97eb315589';
    const baseUrl = 'https://api.cal.com/v1';

    // Determine endpoint based on type
    let endpoint = '/bookings';
    if (type === 'event-types') {
      endpoint = '/event-types';
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('username', username);
    
    if (startTime) queryParams.append('startTime', startTime);
    if (endTime) queryParams.append('endTime', endTime);

    // Make request to Cal.com API
    const response = await fetch(`${baseUrl}${endpoint}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cal.com API error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        return res.status(401).json({ error: 'Cal.com API key is invalid or expired' });
      } else if (response.status === 403) {
        return res.status(403).json({ error: 'Cal.com API key does not have permission to access this resource' });
      } else if (response.status === 404) {
        return res.status(404).json({ error: 'Cal.com username not found' });
      } else {
        return res.status(response.status).json({ 
          error: `Cal.com API error: ${response.status}`,
          details: errorText
        });
      }
    }

    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in Cal.com proxy:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
