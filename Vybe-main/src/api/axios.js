import axios from 'axios';

const api = axios.create({
    baseURL: 'https://vybe-express-2.onrender.com',
    withCredentials: true 
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 400) { 
            try {
                await refreshAccessToken();
                return api(error.config); 
            } catch (error) {
                console.error("Session expired! Redirecting to login...");
                window.location.href = '/';
                throw new Error('Session expired! Redirecting to login...');
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    try {
        await api.post('/refreshToken', {}, { withCredentials: true });
    } catch (error) {
        throw new Error('Refresh token expired! Redirecting to login...');
    }
};

export default api;
