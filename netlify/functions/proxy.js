const axios = require('axios');

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
    
    try {
        const { apiKey, action, params } = JSON.parse(event.body);
        
        if (!apiKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, error: 'API key is required' })
            };
        }
        
        // Build the API URL
        let apiUrl = `https://hero-sms.com/stubs/handler_api.php?api_key=${apiKey}&action=${action}`;
        
        // Add additional parameters
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value) {
                    apiUrl += `&${key}=${encodeURIComponent(value)}`;
                }
            }
        }
        
        console.log('Calling API:', apiUrl);
        
        // Make the request to hero-sms.com
        const response = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log('API Response:', response.data);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                result: response.data
            })
        };
        
    } catch (error) {
        console.error('Proxy Error:', error.message);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
