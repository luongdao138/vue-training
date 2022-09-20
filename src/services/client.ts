import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

client.interceptors.request.use(
  (config) => {
    if (config?.headers) {
      if (!config.headers?.['Authorization']) {
        // the first attempt
        config.headers['Authorization'] = `Bearer ${localStorage.getItem(
          'vue_training_token'
        )}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
