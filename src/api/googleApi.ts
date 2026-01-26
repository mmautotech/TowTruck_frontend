// src/api/googleApi.ts

import axios from 'axios';

export interface GoogleApiKeyResponse {
    apiKey: string;
}

/**
 * Fetch Google API key directly from backend
 * Backend running on: http://192.168.18.84:5000/api
 * No authentication required
 */
export async function fetchGoogleApiKey(): Promise<string> {
    try {
        const response = await axios.get<{ apiKey?: string; data?: GoogleApiKeyResponse }>(
            'https://towly-backend.onrender.com/api/google-api-key'
        );

        // Handle response formats: { apiKey } or { data: { apiKey } }
        const apiKey = response.data.apiKey || response.data.data?.apiKey;
        if (!apiKey) throw new Error('Google API key not found in response');

        console.log('✅ Google API key fetched successfully:', apiKey);
        return apiKey;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Failed to fetch Google API key';
        console.error('❌ Google API key fetch error:', message);
        throw new Error(message);
    }
}
