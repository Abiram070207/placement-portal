const BASE_URL = "http://localhost:8080/api";

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const isFormData = options.body instanceof FormData;
    const headers = { ...options.headers };
    
    if (!isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const fetchOptions = {
        ...options,
        headers,
    };

    // If token exists, add it to Authorization header
    if (token) {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Construct full URL if just a path is passed
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, fetchOptions);

        if (response.status === 401 || response.status === 403) {
            // Unauthorized or Forbidden: clear storage and redirect
            localStorage.clear();
            window.location.href = '/login';
            throw new Error(`Authentication failed: ${response.status}`);
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error in registerUser:', error);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in loginUser:', error);
        throw error;
    }
};
