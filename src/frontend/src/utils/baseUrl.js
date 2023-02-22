const env = process.env;
const baseURL = `${env.REACT_APP_BASE_URL}:${env.REACT_APP_BACKEND_PORT}`;

export default baseURL;